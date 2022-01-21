const { request } = require('express');
const {
	selectReviews,
	selectReviewsById,
	updateReviews,
} = require('../models/reviews.model');
const { checkIfReviewExists } = require('../utils/utils');

exports.getReviewByID = (req, res, next) => {
	const { review_id } = req.params;

	return checkIfReviewExists(review_id)
		.then((reviewExists) => {
			if (reviewExists) {
				selectReviewsById(review_id).then((review) => {
					res.status(200).send({ review });
				});
			} else {
				return Promise.reject({ status: 404, msg: 'Not Found' });
			}
		})
		.catch(next);
};

exports.patchReviews = (req, res, next) => {
	const { inc_votes } = req.body;
	const { review_id } = req.params;
	updateReviews(review_id, inc_votes)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch(next);
};

exports.getReviews = (req, res, next) => {
	const { sort_by, order, category } = req.query;
	selectReviews(sort_by, order, category)
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch(next);
};
