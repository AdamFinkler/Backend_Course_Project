jest.mock('../config/db', () => jest.fn().mockResolvedValue());
jest.mock('../models/log.model', () => ({
  create: jest.fn().mockResolvedValue({})
}));
jest.mock('../services/costs/cost.service');

const request = require('supertest');
const app = require('../services/costs/costs.process');
const { createCost, getMonthlyReport } = require('../services/costs/cost.service');

describe('cost.router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/add', () => {
    it('returns created cost document', async () => {
      createCost.mockResolvedValue({
        description: 'choco',
        category: 'food',
        userid: 123123,
        sum: 12,
        created_at: new Date('2026-05-25T10:00:00.000Z')
      });

      const response = await request(app)
        .post('/api/add')
        .send({
          description: 'choco',
          category: 'food',
          userid: 123123,
          sum: 12
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        description: 'choco',
        category: 'food',
        userid: 123123,
        sum: 12,
        created_at: '2026-05-25T10:00:00.000Z'
      });
    });

    it('returns error with id and message', async () => {
      const error = new Error('User not found');
      error.id = 'USER_NOT_FOUND';
      createCost.mockRejectedValue(error);

      const response = await request(app)
        .post('/api/add')
        .send({
          description: 'choco',
          category: 'food',
          userid: 999999,
          sum: 12
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        id: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    });
  });

  describe('GET /api/report', () => {
    it('returns monthly report', async () => {
      getMonthlyReport.mockResolvedValue({
        userid: 123123,
        year: 2025,
        month: 5,
        costs: [{ food: [] }]
      });

      const response = await request(app).get('/api/report').query({
        id: 123123,
        year: 2025,
        month: 5
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userid: 123123,
        year: 2025,
        month: 5,
        costs: [{ food: [] }]
      });
    });
  });
});
