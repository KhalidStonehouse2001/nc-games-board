const db = require('../db/connection');
exports.selectReviewsById = (id) => {
	return db
		.query(
			`SELECT reviews.*, COUNT(comments.review_id) 
            AS comment_count 
            FROM reviews LEFT JOIN comments 
            ON reviews.review_id = comments.review_id 
            WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
			[id]
		)
		.then((res) => {
			return res.rows;
		});
};

exports.updateReviews = (id, body) => {
	return db
		.query(
			`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,
			[body, id]
		)
		.then(({ rows }) => {
			if (!rows[0]) {
				return Promise.reject({ status: 404, msg: 'Id Invalid - Not found' });
			}
			return rows[0];
		});
};
