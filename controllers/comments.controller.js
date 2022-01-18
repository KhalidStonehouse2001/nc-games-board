const {
	selectComments,
	selectCommentById,
} = require('../models/comments.model');
const { checkIfIdExists } = require('../utils/utils');

exports.getComments = (req, res, next) => {
	selectComments().then((comments) => {
		res.status(200).send({ comments });
	});
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
