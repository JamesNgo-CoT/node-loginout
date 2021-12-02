const nodeLoginout = require('./index');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

nodeLoginout.prompt('.login', {
	// REMOVED
}, 'app').then((loginResult) => {
	console.log(loginResult);

	return nodeLoginout.logout({
		// REMOVED
	}, loginResult);
}, (error) => {
	console.error(error);
});
