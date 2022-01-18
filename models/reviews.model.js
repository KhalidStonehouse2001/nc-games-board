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

exports.selectReviews = () => {
	return db.query(`SELECT * FROM reviews;`).then(({ rows }) => {
		return rows;
	});
};
