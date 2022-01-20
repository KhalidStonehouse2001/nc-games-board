const db = require('../db/connection');

exports.checkIfIdExists = (id) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1`, [id])
		.then(({ rows }) => {
			if (rows.length) {
				return true;
			} else {
				return false;
			}
		});
};

exports.checkIfReviewExists = (id) => {
	return db
		.query(
			`SELECT reviews.*, COUNT(comments.review_id) 
        AS comment_count 
        FROM reviews LEFT JOIN comments 
        ON reviews.review_id = comments.review_id 
        WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
			[id]
		)
		.then(({ rows }) => {
			if (rows.length) {
				return true;
			} else {
				return false;
			}
		});
};

exports.checkIfUserExists = (username) => {};
