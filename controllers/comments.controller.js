const {
	selectComments,
	selectCommentById,
	eraseComments,
	selectCommentsByReviewId,
	enterComment,
	insertComment,
} = require('../models/comments.model');
const { checkIfIdExists } = require('../utils/utils');

exports.getComments = (req, res, next) => {
	selectComments()
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.getCommentById = (req, res, next) => {
	const { comment_id } = req.params;

	return checkIfIdExists(comment_id)
		.then((idExists) => {
			if (idExists) {
				return selectCommentById(comment_id).then((comment) => {
					res.status(200).send({ comment });
				});
			} else {
				return Promise.reject({ status: 404, msg: 'Not Found' });
			}
		})
		.catch(next);
};

exports.deleteComment = (req, res, next) => {
	const { comment_id } = req.params;
	eraseComments(comment_id)
		.then((msg) => {
			res.status(204).end();
		})
		.catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
	const { review_id } = req.params;
	if (isNaN(review_id)) {
		res.status(400).send({ msg: 'Bad request' });
	}
	selectCommentsByReviewId(review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postComment = (req, res, next) => {
	const { review_id } = req.params;
	const { username } = req.body;
	const { body } = req.body;
	insertComment(review_id, username, body)
		.then((comment) => {
			console.log(comment);
			res.status(201).send({ comment });
		})
		.catch(next);
};
