const db = require('../db/connection');

exports.selectCategory = () => {
	return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
		return rows;
	});
};
