const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Request to /api/categories', () => {
	test('GET - 200: returns an array on category objects', () => {
		return request(app)
			.get('/api/categories')
			.expect(200)
			.then((res) => {
				expect(res.body.categories).toHaveLength(4);
				res.body.categories.forEach((category) => {
					expect(category).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});
