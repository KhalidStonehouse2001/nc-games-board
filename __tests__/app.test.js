const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
	test('status 200: returns an array on category objects', () => {
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
	test('GET - 404: returns with an error message if given incorrect path', () => {
		return request(app)
			.get('/hello123')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('Not Found');
			});
	});
});

describe('GET /api/comments', () => {
	test('status 200: returns an array of objects containing comments', () => {
		return request(app)
			.get('/api/comments')
			.expect(200)
			.then((res) => {
				expect(res.body.comments).toHaveLength(6);
				res.body.comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						body: expect.any(String),
						author: expect.any(String),
						review_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
					});
				});
			});
	});
	test('status: 200, returns an array of objects sorted by created_at in desending order by default', () => {
		return request(app)
			.get('/api/comments')
			.expect(200)
			.then((res) => {
				expect(res.body.comments).toBeSortedBy('created_at', {
					descending: true,
				});
			});
	});
	test('404: returns not found if path is entered incorrectly', () => {
		return request(app)
			.get('/api/commento')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not Found');
			});
	});
});

describe('GET /api/comments/:comment_id', () => {
	test('status 200: returns an object of the specified comment ', () => {
		return request(app)
			.get('/api/comments/1')
			.expect(200)
			.then(({ body: { comment } }) => {
				expect(comment).toBeInstanceOf(Object);
				expect(comment).toMatchObject({
					comment_id: expect.any(Number),
					author: expect.any(String),
					review_id: expect.any(Number),
					votes: expect.any(Number),
					created_at: expect.any(String),
					body: expect.any(String),
				});
			});
	});
	test('status 400: returns bad request when id is an invalid data type', () => {
		return request(app)
			.get('/api/comments/bananna')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad Request');
			});
	});
	test('status 404: returns Id doesnt exist when ID does not exist', () => {
		return request(app)
			.get('/api/comments/90')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not Found');
			});
	});
});

describe('GET /api/reviews/:review_id', () => {
	test('status 200: returns an array of review objects based on review id', () => {
		return request(app)
			.get('/api/reviews/3')
			.expect(200)
			.then(({ body: { review } }) => {
				expect(review[0]).toHaveProperty('comment_count');
				expect(review[0]).toMatchObject({
					review_id: 3,
					title: 'Ultimate Werewolf',
					designer: 'Akihisa Okui',
					owner: 'bainesface',
					review_img_url:
						'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
					review_body: "We couldn't find the werewolf!",
					category: 'social deduction',
					created_at: expect.any(String),
					votes: 5,
				});
			});
	});
	test('status: 400, returns bad request when invalid data type is inputted', () => {
		return request(app)
			.get('/api/reviews/apple')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad Request');
			});
	});
	test('status 404: returns not found when ID deosnt exist', () => {
		return request(app)
			.get('/api/reviews/90')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not Found');
			});
	});
});

describe('GET - /api/reviews', () => {
	test('status 200: returns an array of objects of reviews with the correct key-value pairs', () => {
		return request(app)
			.get('/api/reviews')
			.expect(200)
			.then(({ body: { reviews } }) => {
				expect(reviews).toHaveLength(13);
				reviews.forEach((review) => {
					expect(review).toHaveProperty('comment_count');
					expect(review).toMatchObject({
						owner: expect.any(String),
						title: expect.any(String),
						review_id: expect.any(Number),
						category: expect.any(String),
						review_img_url: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
					});
				});
			});
	});
});
