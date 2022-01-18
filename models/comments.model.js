const db = require('../db/connection');

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
