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

exports.selectReviews = (sort_by = 'created_at', order = 'DESC', category) => {
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

	if (sort_by === undefined || order === undefined) {
		sort_by = 'created_at';
		order = 'DESC';
	} else if (sort_by === undefined) {
		sort_by = 'created_at';
	} else if (order === undefined) {
		order = 'DESC';
	}

	if (!allowedSortBys.includes(sort_by) || !allowedOrder.includes(order)) {
		return Promise.reject({
			status: 400,
			msg: 'Bad request, invalid input',
		});
	}

	let queryStr = `SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id`;

	if (category) {
		queryStr += ` WHERE reviews.category = '${category}'`;
	}

	queryStr += ` ORDER BY ${sort_by} ${order}`;
	console.log(queryStr);
	return db.query(queryStr).then(({ rows }) => {
		console.log(rows);
		return rows;
	});
};
