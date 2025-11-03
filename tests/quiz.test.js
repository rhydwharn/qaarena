require('./setup');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');

describe('Quiz Tests', () => {
  let token;
  let user;
  let question;

  beforeEach(async () => {
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!'
    });

    await Progress.create({ user: user._id });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test123!' });
    token = res.body.data.token;

    question = await Question.create({
      questionText: new Map([['en', 'Test Question']]),
      type: 'single-choice',
      options: [
        { text: new Map([['en', 'Correct Answer']]), isCorrect: true },
        { text: new Map([['en', 'Wrong Answer']]), isCorrect: false }
      ],
      category: 'fundamentals',
      difficulty: 'foundation',
      createdBy: user._id,
      status: 'published'
    });
  });

  describe('POST /api/quiz/start', () => {
    it('should start a new quiz', async () => {
      const res = await request(app)
        .post('/api/quiz/start')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mode: 'practice',
          category: 'fundamentals',
          numberOfQuestions: 1
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.quiz).toHaveProperty('_id');
      expect(res.body.data.quiz.questions).toHaveLength(1);
      expect(res.body.data.quiz.status).toBe('in-progress');
    });

    it('should return error when no questions match criteria', async () => {
      const res = await request(app)
        .post('/api/quiz/start')
        .set('Authorization', `Bearer ${token}`)
        .send({
          mode: 'practice',
          category: 'non-existent-category',
          numberOfQuestions: 10
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/quiz/answer', () => {
    let quiz;

    beforeEach(async () => {
      quiz = await Quiz.create({
        user: user._id,
        mode: 'practice',
        questions: [{ question: question._id }],
        settings: { language: 'en' }
      });
    });

    it('should answer a question correctly', async () => {
      const res = await request(app)
        .post('/api/quiz/answer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          quizId: quiz._id,
          questionId: question._id,
          answer: 0,
          timeSpent: 30
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.isCorrect).toBe(true);
    });

    it('should answer a question incorrectly', async () => {
      const res = await request(app)
        .post('/api/quiz/answer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          quizId: quiz._id,
          questionId: question._id,
          answer: 1,
          timeSpent: 25
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.isCorrect).toBe(false);
    });
  });

  describe('POST /api/quiz/:id/complete', () => {
    let quiz;

    beforeEach(async () => {
      quiz = await Quiz.create({
        user: user._id,
        mode: 'practice',
        questions: [
          {
            question: question._id,
            userAnswer: [0],
            isCorrect: true,
            timeSpent: 30
          }
        ],
        settings: { language: 'en', category: 'fundamentals' }
      });
    });

    it('should complete a quiz and update stats', async () => {
      const res = await request(app)
        .post(`/api/quiz/${quiz._id}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.quiz.status).toBe('completed');
      expect(res.body.data.quiz.score.correct).toBe(1);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.stats.totalQuizzes).toBe(1);
      expect(updatedUser.stats.correctAnswers).toBe(1);
    });
  });
});