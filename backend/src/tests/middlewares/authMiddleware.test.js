const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword, verifyToken, authenticateToken } = require('../../middlewares/authMiddleware');
const { errorResponse } = require('../../helpers/responseHelper');
const User = require('../../models/User');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models/User');
jest.mock('../../helpers/responseHelper');

describe('Auth Controller', () => {

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      bcrypt.genSalt.mockResolvedValue('fake_salt');
      bcrypt.hash.mockResolvedValue('hashed_password');

      const result = await hashPassword('myPassword');

      expect(result).toBe('hashed_password');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('myPassword', 'fake_salt');
    });
  });

  describe('comparePassword', () => {
    it('should compare a password', async () => {
      bcrypt.compare.mockResolvedValue(true);
      const result = await comparePassword('pass', 'hashed');
      expect(result).toBe(true);
    });
  });

  describe('verifyToken', () => {
    it('should call next if token is valid', () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer valid_token')
      };
      const res = {};
      const next = jest.fn();
      jwt.verify.mockReturnValue({ id: '123' });

      verifyToken(req, res, next);

      expect(req.user).toEqual({ id: '123' });
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', () => {
      const req = { header: jest.fn().mockReturnValue(undefined) };
      const res = {};
      errorResponse.mockReturnValue('No token provided response');

      const result = verifyToken(req, res, jest.fn());
      expect(result).toBe('No token provided response');
    });

    it('should return 401 on token error', () => {
      const req = { header: jest.fn().mockReturnValue('Bearer invalid') };
      const res = {};
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
      errorResponse.mockReturnValue('Invalid token response');

      const result = verifyToken(req, res, jest.fn());
      expect(result).toBe('Invalid token response');
    });
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and user', async () => {
      const req = {
        headers: { authorization: 'Bearer valid_token' }
      };
      const res = {};
      const next = jest.fn();
      const userMock = { id: '123', name: 'John' };

      jwt.verify.mockReturnValue({ id: '123' });
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(userMock) });

      await authenticateToken(req, res, next);
      expect(req.user).toEqual(userMock);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token', async () => {
      const req = { headers: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authenticateToken(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token no proporcionado'
      });
    });

    it('should return 401 if user not found', async () => {
      const req = { headers: { authorization: 'Bearer valid_token' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jwt.verify.mockReturnValue({ id: '123' });
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await authenticateToken(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('should handle token error and return 401', async () => {
      const req = { headers: { authorization: 'Bearer invalid' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });

      await authenticateToken(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      });
    });
  });
});