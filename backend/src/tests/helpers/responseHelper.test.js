// Simulamos process.env.JWT_SECRET
process.env.JWT_SECRET = 'test_secret';
const jwt = require('jsonwebtoken');
const {
  generateToken,
  formatUserResponse,
  successResponse,
  errorResponse,
  authResponse
} = require('../../helpers/responseHelper');

jest.mock('jsonwebtoken');

describe('Helpers Tests', () => {
  const mockUser = {
    _id: '123',
    name: 'Test User',
    email: 'usertest@dominiotest.com'
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generateToken debe retornar un token JWT', () => {
    jwt.sign.mockReturnValue('mocked_token');

    const token = generateToken(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith({
      id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email
    }, 'test_secret', { expiresIn: '1h' });

    expect(token).toBe('mocked_token');
  });

  it('formatUserResponse debe formatear correctamente al usuario', () => {
    const result = formatUserResponse(mockUser);
    expect(result).toEqual({
      id: '123',
      name: 'Test User',
      email: 'usertest@dominiotest.com'
    });
  });

  it('successResponse debe retornar un response con éxito', () => {
    successResponse(res, { valor: 123 }, 'Operation successful', 200);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Operation successful',
      data: { valor: 123 }
    });
  });

  it('errorResponse debe retornar un response con error por defecto', () => {
    errorResponse(res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server error'
    });
  });

  it('errorResponse debe retornar un response con error personalizado', () => {
    errorResponse(res, 'Fallo login', 401);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Fallo login'
    });
  });

  it('authResponse debe retornar el usuario formateado y token', () => {
    const token = 'abc123';
    authResponse(res, mockUser, token);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Operation successful',
      data: {
        user: {
          id: '123',
          name: 'Test User',
          email: 'usertest@dominiotest.com'
        },
        token: 'abc123'
      }
    });
  });
});