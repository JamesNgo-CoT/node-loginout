const nodeLoginout = require('./index');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

nodeLoginout.loginPrompt('.login', {
	// REMOVED
}, 'app').then((loginResult) => {
	console.log(loginResult);

	return nodeLoginout.logout({
		// REMOVED
	}, loginResult);
}, (error) => {
	console.error(error);
});
