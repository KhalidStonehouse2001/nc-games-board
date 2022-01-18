const express = require('express');
const { getCategories } = require('./controllers/categories.controller');
const {
	getComments,
	getCommentById,
} = require('./controllers/comments.controller');
const {
	getReviewByID,
	getReviews,
} = require('./controllers/reviews.controller');
const {
	internalServer,
	handle404s,
	handlePsqlErrors,
	handleCustomErrors,
} = require('./Error-Handling/error');
const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewByID);
app.get('/api/comments', getComments);
app.get('/api/comments/:comment_id', getCommentById);
app.all('*', handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(internalServer);

module.exports = app;
