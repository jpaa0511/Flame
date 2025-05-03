const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { validateRegister, validateLogin, validateSwipe } = require('../../middlewares/validationMiddleware');

const app = express();
app.use(bodyParser.json());

app.post('/register', validateRegister, (req, res) => res.status(200).json({ success: true }));
app.post('/login', validateLogin, (req, res) => res.status(200).json({ success: true }));
app.post('/swipe', validateSwipe, (req, res) => res.status(200).json({ success: true }));

describe('Validation Middleware', () => {
  describe('Register Validation', () => {
    const validData = {
      email: 'usertest@dominiotest.com',
      password: '123456',
      name: 'Test',
      age: 25,
      gender: 'male',
      department: 'IT',
      city: 'Bogotá',
      interests: ['music', 'tech'],
      photos: ['photo1.jpg'],
      bio: 'Hello world',
      preferences: { ageRange: [20, 30] }
    };

    it('should pass with valid data', async () => {
      const res = await request(app).post('/register').send(validData);
      expect(res.statusCode).toBe(200);
    });

    it('should fail if email is missing', async () => {
      const { email, ...data } = validData;
      const res = await request(app).post('/register').send(data);
      expect(res.statusCode).toBe(400);
    });

    it('should fail if email is invalid', async () => {
      const res = await request(app).post('/register').send({ ...validData, email: 'invalid' });
      expect(res.statusCode).toBe(400);
    });

    it('should fail if password is short', async () => {
      const res = await request(app).post('/register').send({ ...validData, password: '123' });
      expect(res.statusCode).toBe(400);
    });

    it('should fail if age is under 18', async () => {
      const res = await request(app).post('/register').send({ ...validData, age: 17 });
      expect(res.statusCode).toBe(400);
    });

    it('should fail if gender is invalid', async () => {
      const res = await request(app).post('/register').send({ ...validData, gender: 'unknown' });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Login Validation', () => {
    const validLogin = {
      email: 'usertest@dominiotest.com',
      password: '123456'
    };

    it('should pass with valid login', async () => {
      const res = await request(app).post('/login').send(validLogin);
      expect(res.statusCode).toBe(200);
    });

    it('should fail if password is missing', async () => {
      const { password, ...data } = validLogin;
      const res = await request(app).post('/login').send(data);
      expect(res.statusCode).toBe(400);
    });
  });

  describe('Swipe Validation', () => {
    const validSwipe = {
      targetUserId: '60c72b2f5f1b2c001c8d1234',
      action: 'like'
    };

    it('should pass with valid swipe', async () => {
      const res = await request(app).post('/swipe').send(validSwipe);
      expect(res.statusCode).toBe(200);
    });

    it('should fail if targetUserId is invalid', async () => {
      const res = await request(app).post('/swipe').send({ ...validSwipe, targetUserId: 'invalid' });
      expect(res.statusCode).toBe(400);
    });

    it('should fail if action is missing', async () => {
      const { action, ...data } = validSwipe;
      const res = await request(app).post('/swipe').send(data);
      expect(res.statusCode).toBe(400);
    });
  });
});
