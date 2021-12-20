const dotenv = require('dotenv');

const nodeLoginout = require('./index');

dotenv.config();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const httpsOptions = {
	host: process.env.BASE_HOST,
	path: process.env.BASE_PATH
};

nodeLoginout.prompt('.login', httpsOptions, 'app').then((loginResult) => {
	console.log(loginResult);

	return nodeLoginout.logout(httpsOptions, loginResult);
}, (error) => {
	console.error(error);
});
