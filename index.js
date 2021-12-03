const fs = require('fs');
const nodeHttpsRequest = require('node-https-request');
const nodePrompts = require('node-prompts');

function readloginResult(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, { encoding: 'utf8' }, (error, content) => {
			if (error) {
				return reject(error);
			}

			try {
				resolve(JSON.parse(content));
			} catch (error) {
				reject(error);
			}
		});
	});
}

function writeloginResult(fileName, loginResult) {
	return new Promise((resolve, reject) => {
		fs.writeFile(fileName, JSON.stringify(loginResult), { encoding: 'utf8' }, (error) => {
			if (error) {
				return reject(error);
			}

			resolve(loginResult);
		});
	});
}

/**
 * Login a user.
 * @param {object} httpsOptions Node https request options
 * @param {string} app Application name
 * @param {string} user User name
 * @param {string} pwd Password
 * @returns {Promise.<object, any>} When resolved returns the login result, when rejected returns any error information
 */
function login(httpsOptions, app, user, pwd) {
	const loginOptions = Object.assign({}, httpsOptions);
	loginOptions.method = 'POST';
	loginOptions.headers = Object.assign({}, loginOptions.headers);
	loginOptions.headers['Accept'] = 'application/json';
	loginOptions.headers['Content-Type'] = 'application/json';

	return nodeHttpsRequest(loginOptions, { app, user, pwd }).then(({ response, data }) => {
		if (response.statusCode === 200) {
			const loginResult = JSON.parse(data);
			const { sid } = loginResult;

			if (sid) {
				return loginResult;
			}

			return Promise.reject();
		}

		return Promise.reject();
	});
}

/**
 * Verify a user.
 * @param {object} httpsOptions Node https request options
 * @param {object} loginResult Login result to verify
 * @returns {Promise.<object, any>} When resolved returns the login result, when rejected returns any error information
 */
function verify(httpsOptions, loginResult) {
	const { sid } = loginResult;

	if (!sid) {
		return Promise.reject();
	}

	const verifyOptions = Object.assign({}, httpsOptions);
	verifyOptions.method = 'GET';
	verifyOptions.path = `${httpsOptions.path}('${sid}')`;
	verifyOptions.headers = Object.assign({}, verifyOptions.headers);
	verifyOptions.headers['Accept'] = 'application/json';

	return nodeHttpsRequest(verifyOptions).then(({ response, data }) => {
		if (response.statusCode === 200) {
			const loginResult = JSON.parse(data);
			const { sid } = loginResult;

			if (sid) {
				return loginResult;
			}

			return Promise.reject();
		}

		return Promise.reject();
	});
}

/**
 * Logout a user.
 * @param {object} httpsOptions Node https request options
 * @param {object} loginResult Login result to logout
 * @returns {Promise} When resolved returns nothing, when rejected returns any error information
 */
function logout(httpsOptions, loginResult) {
	const { sid, userID } = loginResult;

	if (!sid || !userID) {
		return Promise.reject();
	}

	const logoutOptions = Object.assign({}, httpsOptions);
	logoutOptions.method = 'DELETE';
	logoutOptions.path = `${logoutOptions.path}('${sid}')`;
	logoutOptions.headers = Object.assign({}, logoutOptions.headers);
	logoutOptions.headers['Authorization'] = userID;

	return nodeHttpsRequest(logoutOptions).then(({ response }) => {
		if (response.statusCode === 200) {
			return;
		}

		return Promise.reject();
	});
}

/**
 * Prompt for logging in a user.
 * @param {string} fileName File name to cache login result
 * @param {object} httpsOptions Node https request options
 * @param {string} app Application name
 * @returns {Promise.<object, any>} When resolved returns the login result, when rejected returns any error information
 */
function prompt(fileName, httpsOptions, app) {
	return readloginResult(fileName)
		.then((loginResult) => {
			return verify(httpsOptions, loginResult);
		})
		.catch(() => {
			return nodePrompts([{ question: 'User Name' }, { question: 'Password', muted: true }], 'Login')
				.then(([{ answer: user }, { answer: pwd }]) => {
					return login(httpsOptions, app, user, pwd)
						.then((loginResult) => {
							return writeloginResult(fileName, loginResult);
						});
				});
		});
}

module.exports = {
	login,
	verify,
	logout,
	prompt
};
