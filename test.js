const nodeLoginout = require('./index');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const httpsOptions = {
	// REMOVED
};

nodeLoginout.prompt('.login', httpsOptions, 'app').then((loginResult) => {
	console.log(loginResult);

	return nodeLoginout.logout(httpsOptions, loginResult);
}, (error) => {
	console.error(error);
});
