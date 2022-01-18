exports.getApi = (req, res, next) => {
	res.status(200).send(require('../endpoints.json'));
};
