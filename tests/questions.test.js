require('./setup');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Question = require('../models/Question');

describe('Question Tests', () => {
  let adminToken;
  let adminUser;
  let userToken;
  let regularUser;

  beforeEach(async () => {

    regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'User123!',
      role: 'user'
    });



    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'User123!' });
    userToken = userRes.body.data.token;
  });

  describe('POST /api/questions', () => {
    it('should create question as admin', async () => {
      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          questionText: { en: 'What is testing?' },
          type: 'single-choice',
          options: [
            { text: { en: 'Option 1' }, isCorrect: true },
            { text: { en: 'Option 2' }, isCorrect: false }
          ],
          category: 'fundamentals',
          difficulty: 'foundation'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.question).toHaveProperty('_id');
    });

    it('should not create question as regular user', async () => {
      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          questionText: { en: 'What is testing?' },
          type: 'single-choice',
          options: [
            { text: { en: 'Option 1' }, isCorrect: true },
            { text: { en: 'Option 2' }, isCorrect: false }
          ],
          category: 'fundamentals'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/questions', () => {
    beforeEach(async () => {
      await Question.create({
        questionText: new Map([['en', 'Test Question 1']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'Option 1']]), isCorrect: true },
          { text: new Map([['en', 'Option 2']]), isCorrect: false }
        ],
        category: 'fundamentals',
        difficulty: 'foundation',
        createdBy: adminUser._id,
        status: 'published'
      });

      await Question.create({
        questionText: new Map([['en', 'Test Question 2']]),
        type: 'true-false',
        options: [
          { text: new Map([['en', 'True']]), isCorrect: true },
          { text: new Map([['en', 'False']]), isCorrect: false }
        ],
        category: 'test-techniques',
        difficulty: 'advanced',
        createdBy: adminUser._id,
        status: 'published'
      });
    });

    it('should get all published questions', async () => {
      const res = await request(app).get('/api/questions');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.questions).toHaveLength(2);
    });

    it('should filter questions by category', async () => {
      const res = await request(app).get('/api/questions?category=fundamentals');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.questions).toHaveLength(1);
      expect(res.body.data.questions[0].category).toBe('fundamentals');
    });

    it('should filter questions by difficulty', async () => {
      const res = await request(app).get('/api/questions?difficulty=advanced');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.questions).toHaveLength(1);
      expect(res.body.data.questions[0].difficulty).toBe('advanced');
    });
  });
});