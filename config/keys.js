// keys.js - logic to determine which set of creditials to return (dev.js or prod.js)

if (process.env.NODE_ENV === 'production') {
	// we are in production - return prod set of keys
	module.exports = require('./prod');
} else {
	// we are in development - return dev set of keys
	module.exports = require('./dev');
}
