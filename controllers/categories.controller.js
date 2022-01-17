const { selectCategory } = require('../models/categories.model');

exports.getCategories = (req, res, next) => {
	selectCategory().then((categories) => {
		res.status(200).send({ categories });
	});
};
