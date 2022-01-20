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

exports.checkIfUserExists = (username) => {
	if (username === undefined) {
		return Promise.reject({
			status: 400,
			msg: 'Bad request, incomplete body',
		});
	}
	if (!isNaN(username)) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request, Invalid username',
		});
	} else {
		return db
			.query(`SELECT * FROM users WHERE username = $1`, [username])
			.then(({ rows }) => {
				if (rows.length === 0) {
					return Promise.reject({
						status: 404,
						msg: 'User doesnt exist',
					});
				} else {
					return rows;
				}
			});
	}
};
