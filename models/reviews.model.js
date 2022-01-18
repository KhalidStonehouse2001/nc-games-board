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

exports.selectReviews = (sortQuery, orderQuery, categoryQuery) => {
	const allowedSortBys = [
		'owner',
		'title',
		'review_id',
		'review_img_url',
		'created_at',
		'votes',
		'comment_count',
	];

	const allowedOrder = ['ASC', 'DESC', 'asc', 'desc'];

	if (sortQuery === undefined || orderQuery === undefined) {
		sortQuery = 'created_at';
		orderQuery = 'DESC';
	} else if (sortQuery === undefined) {
		sortQuery = 'created_at';
	} else if (orderQuery === undefined) {
		orderQuery = 'DESC';
	}

	if (
		!allowedSortBys.includes(sortQuery) ||
		!allowedOrder.includes(orderQuery)
	) {
		return Promise.reject({
			status: 400,
			msg: 'Bad request, invalid input',
		});
	}
	return db
		.query(
			`
			SELECT reviews.review_id, reviews.title, reviews.designer, reviews.review_img_url, reviews.owner, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count FROM reviews
                    FULL JOIN comments
                    ON reviews.review_id = comments.review_id
                    GROUP BY reviews.review_id
                    ORDER BY ${sortQuery} ${orderQuery}`
		)
		.then(({ rows }) => {
			return rows;
		});
};
