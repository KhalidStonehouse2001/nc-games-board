const { selectReviews, selectReviewsById } = require('../models/reviews.model');
const { checkIfReviewExists } = require('../utils/utils');

exports.getReviews = (req, res, next) => {
	selectReviews().then((reviews) => {
		res.status(200).send({ reviews });
	});
};

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
