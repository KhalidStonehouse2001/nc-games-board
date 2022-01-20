const express = require('express');
const endpoints = require('./endpoints.json');
const { getCategories } = require('./controllers/categories.controller');
const {
	getComments,
	getCommentById,
	deleteComment,
	getCommentsByReviewId,
	postComment,
} = require('./controllers/comments.controller');
const {
	getReviewByID,
	getReviews,
	patchReviews,
} = require('./controllers/reviews.controller');
const {
	internalServer,
	handle404s,
	handlePsqlErrors,
	handleCustomErrors,
} = require('./error-handling/error.js');
const { getApi } = require('./controllers/api.controllers');
const app = express();

app.use(express.json());
app.get('/api', getApi);
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewByID);
app.patch('/api/reviews/:review_id', patchReviews);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);
app.get('/api/comments', getComments);
app.get('/api/comments/:comment_id', getCommentById);
app.delete('/api/comments/:comment_id', deleteComment);
app.post('/api/reviews/:review_id/comments', postComment);
app.all('*', handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(internalServer);
module.exports = app;
