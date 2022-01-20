const db = require('../db/connection');
const format = require('pg-format');

exports.selectComments = () => {
	return db
		.query(`SELECT * FROM comments ORDER BY created_at DESC;`)
		.then(({ rows }) => {
			return rows;
		});
};

exports.selectCommentById = (id) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
		.then(({ rows }) => {
			return rows[0];
		});
};

exports.eraseComments = (id) => {
	return db
		.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [id])
		.then((comment) => {
			const deletedComment = comment.rows;
			if (!deletedComment.length) {
				return Promise.reject({
					status: 404,
					msg: 'Comment not found',
				});
			}
			return deletedComment;
		});
};

exports.selectCommentsByReviewId = (id) => {
	return db
		.query(`SELECT * FROM comments WHERE review_id = $1`, [id])
		.then(({ rows }) => {
			return rows;
		});
};

exports.insertComment = (id, name, body) => {
	return db
		.query(
			`
		INSERT INTO comments 
		(review_id, body, author)
        VALUES 
		($1, $2, $3)
		 RETURNING *;`,
			[id, body, name]
		)
		.then(({ rows }) => {
			console.log(rows);
		});
};
