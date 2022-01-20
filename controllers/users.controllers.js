const { selectUsers, selectUsersByUsername } = require('../models/users.model');
const { checkIfUserExists } = require('../utils/utils');

exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};

exports.getUserByUsername = (req, res, next) => {
	const { username } = req.params;
	checkIfUserExists(username)
		.then((doesUserExist) => {
			if (doesUserExist) {
				selectUsersByUsername(username).then((user) => {
					res.status(200).send({ user });
				});
			}
		})
		.catch(next);
};
