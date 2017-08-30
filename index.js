const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// each app.use call is wiring up middleware
// middleware - small functions that are used to modify incoming requests before they are sent off to route handlers.
// these three middlewares will take the incoming request and modify it to get certain data:
//		cookie-session extracts cookie data
//		passport pulls user id out of cookie data
// 		function to turn user id into a user
// Tell express to use cookies, pass in config as objects
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
		keys: [keys.cookieKey] // key to encrypt cookie
	})
);
// tell passport to use cookies
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
