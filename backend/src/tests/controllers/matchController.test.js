const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { registerSwipe, getMatchesByUser } = require('../../controllers/matchController');
const User = require('../../models/User');
const Match = require('../../models/Match');

jest.mock('../../models/User');
jest.mock('../../models/Match');

const app = express();
app.use(express.json());
app.post('/swipe', (req, res) => {
  req.user = { id: req.body.currentUserId }; // Simular usuario autenticado
  registerSwipe(req, res);
});
app.get('/matches/:userId', getMatchesByUser);

describe('registerSwipe', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return 404 if target user does not exist', async () => {
    User.findById.mockResolvedValueOnce(null);
    const res = await request(app).post('/swipe').send({
      currentUserId: '123',
      targetUserId: '456',
      action: 'like'
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

//   it('should register a like and return match if mutual', async () => {
//     const currentUser = { _id: '123', likes: [], save: jest.fn(), dislikes: [] };
//     const targetUser = { _id: '456', likes: ['123'] };

//     User.findById
//       .mockResolvedValueOnce(targetUser) // Target user
//       .mockResolvedValueOnce(currentUser); // Current user

//     Match.findOne.mockResolvedValueOnce(null);
//     Match.prototype.save = jest.fn().mockResolvedValue({ _id: 'matchId' });

//     const res = await request(app).post('/swipe').send({
//       currentUserId: '123',
//       targetUserId: '456',
//       action: 'like'
//     });

//     expect(res.status).toBe(200);
//     expect(res.body.data.isMatch).toBe(true);
//   });

  it('should register a dislike', async () => {
    const currentUser = { _id: '123', dislikes: [], save: jest.fn() };
    const targetUser = { _id: '456' };

    User.findById
      .mockResolvedValueOnce(targetUser) // Target user
      .mockResolvedValueOnce(currentUser); // Current user

    const res = await request(app).post('/swipe').send({
      currentUserId: '123',
      targetUserId: '456',
      action: 'dislike'
    });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Dislike registered');
  });

  it('should return 400 for invalid action', async () => {
    const currentUser = { _id: '123', likes: [], dislikes: [] };
    const targetUser = { _id: '456' };

    User.findById
      .mockResolvedValueOnce(targetUser)
      .mockResolvedValueOnce(currentUser);

    const res = await request(app).post('/swipe').send({
      currentUserId: '123',
      targetUserId: '456',
      action: 'hug' // invalid
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid action');
  });
});

describe('getMatchesByUser', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return 400 for invalid user ID format', async () => {
    const res = await request(app).get('/matches/invalidId');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid user ID format');
  });

  it('should return 404 if user not found', async () => {
    mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
    User.findById.mockResolvedValueOnce(null);
    const res = await request(app).get('/matches/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

//   it('should return matched users', async () => {
//     mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);
//     User.findById.mockResolvedValueOnce({ _id: '123' });
//     Match.find.mockResolvedValueOnce([
//       {
//         user1: { _id: '123', email: 'a@test.com' },
//         user2: { _id: '456', email: 'b@test.com' },
//         isActive: true
//       }
//     ]);

//     const res = await request(app).get('/matches/123');
//     expect(res.status).toBe(200);
//     expect(res.body.matches[0].userId).toBe('456');
//     expect(res.body.matches[0].email).toBe('b@test.com');
//   });
});