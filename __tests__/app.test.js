const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET - /api', () => {
	test('status 200: returns with a JSON object containing all the information of the possible endpoints', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(require('../endpoints.json'));
			});
	});
});

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
	test('status 404: returns with an error message if given incorrect path', () => {
		return request(app)
			.get('/hello123')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('Page Not Found');
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
	test('status 404: returns not found if path is entered incorrectly', () => {
		return request(app)
			.get('/api/commento')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Page Not Found');
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

describe('DELETE /api/comments/:comment_id', () => {
	test('status 204 deletes the comment and returns with no content ', () => {
		return request(app)
			.delete('/api/comments/1')
			.expect(204)
			.then(() => {
				return request(app)
					.delete('/api/comments/1')
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toEqual('Comment not found');
					});
			});
	});
	test('status 400: returns bad request when given an invalid id', () => {
		return request(app)
			.delete('/api/comments/hello')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad Request');
			});
	});
	test('status 404, returns not found if given a id that doesnt exist', () => {
		return request(app)
			.delete('/api/comments/900')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Comment not found');
			});
	});
});

describe('GET - /api/reviews', () => {
	test('status 200: returns an array of objects containing all the reviews with their correct key value pairs', () => {
		return request(app)
			.get('/api/reviews')
			.expect(200)
			.then(({ body: { reviews } }) => {
				expect(reviews).toHaveLength(13);
				expect(reviews).toBeInstanceOf(Array);
				reviews.forEach((review) => {
					expect(review).toHaveProperty('comment_count');
					expect(review).toMatchObject({
						owner: expect.any(String),
						title: expect.any(String),
						review_id: expect.any(Number),
						review_body: expect.any(String),
						designer: expect.any(String),
						review_img_url: expect.any(String),
						category: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
					});
				});
			});
	});
	test('status 200: returns an array of reviews to be sorted by created_at in descending order', () => {
		return request(app)
			.get('/api/reviews')
			.expect(200)
			.then(({ body: { reviews } }) => {
				expect(reviews).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('status 200: returns an array of reviews sorted by votes in descending order', () => {
		return request(app)
			.get('/api/reviews?sort_by=votes&order=desc')
			.expect(200)
			.then(({ body: { reviews } }) => {
				expect(reviews).toBeSortedBy('votes', { descending: true });
			});
	});
	test('status 200: returns an array of reviews sorted by review_id in ascending order', () => {
		return request(app)
			.get('/api/reviews?sort_by=review_id&order=asc')
			.expect(200)
			.then(({ body: { reviews } }) => {
				expect(reviews).toBeSortedBy('review_id', { ascending: true });
			});
	});
	test('status 200: returns array of reviews sorted by category', () => {
		return request(app)
			.get('/api/reviews?category=dexterity')
			.expect(200)
			.then(({ body: { reviews } }) => {
				reviews.forEach((review) => {
					expect(review.category).toBe('dexterity');
				});
			});
	});
	test('status 400: returns bad request when passed an invalid sort_by query', () => {
		return request(app)
			.get('/api/reviews?sort_by=hellomate')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request, invalid input');
			});
	});
	test('status 400: returns bad request when passed an invalid order query ', () => {
		return request(app)
			.get('/api/reviews?sort_by=votes&order=helloboss')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request, invalid input');
			});
	});
	test('status 404: returns not found if given incorrect path', () => {
		return request(app)
			.get('/api/revews')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Page Not Found');
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

describe('PATCH - /api/reviews/:review_id', () => {
	test('status 201: returns the updated review with the votes incremented based on request', () => {
		return request(app)
			.patch('/api/reviews/1')
			.send({ inc_votes: 1 })
			.expect(201)
			.then(({ body: { review } }) => {
				expect(review).toBeInstanceOf(Object);
				expect(review.votes).toBe(2);
			});
	});
	test('status 201: returns the updated review when votes are decremented based on request', () => {
		return request(app)
			.patch('/api/reviews/1')
			.send({ inc_votes: -100 })
			.expect(201)
			.then(({ body: { review } }) => {
				expect(review).toBeInstanceOf(Object);
				expect(review.votes).toBe(-99);
			});
	});
	test('status 400: returns bad request when given invalid id ', () => {
		return request(app)
			.patch('/api/reviews/banana')
			.send({ helloMate: 'Bye' })
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad Request');
			});
	});
	test('status 404: returns not found when given id that does not exist', () => {
		return request(app)
			.patch('/api/reviews/900')
			.send({ inc_votes: 90 })
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Id Invalid - Not found');
			});
	});
	test('status 404: returns not found when path is incorrect', () => {
		return request(app)
			.patch('/apu/reviews/2')
			.send({ inc_votes: 1 })
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Page Not Found');
			});
	});
});

describe('GET - /api/reviews/:review_id/comments', () => {
	test('status 200: returns an array of comments with the following review_id', () => {
		return request(app)
			.get('/api/reviews/3/comments')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toHaveLength(3);
				comments.forEach((comment) => {
					expect(comment).toMatchObject({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						review_id: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
					});
				});
			});
	});
	test('status 200: returns an empty array if no comments on review_id passed ', () => {
		return request(app)
			.get('/api/reviews/4/comments')
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toHaveLength(0);
				expect(comments).toEqual([]);
			});
	});
	test('status 400: returns bad request if passed an invalid id', () => {
		return request(app)
			.get('/api/reviedw')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Page Not Found');
			});
	});
});

describe('POST /api/reviews/:review_id/comments', () => {
	test('status 200: returns newly inputted comment', () => {
		return request(app)
			.post('/api/reviews/2/comments')
			.send({
				username: 'Khalid123',
				body: 'My first comment',
			})
			.expect(201)
			.then(({ body: { comment } }) => {
				expect(comment).toBeInstanceOf(Object);
				expect(comment.username).toBe('Khalid123');
				expect(comment.body).toBe('My first comment');
			});
	});
});
