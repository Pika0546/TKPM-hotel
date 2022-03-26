//Library import
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./auth/passport');
const flash = require('connect-flash');
const route = require('./routes');

var app = express();

app.use(logger('dev'));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SECRET_SESSION, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
	res.locals.user = req.user
	next();
})


//view engine setup
//Handlebar engine
app.engine('.hbs', hbs.engine({
	extname: '.hbs',
	helpers:{
		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		},
}
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

route(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', {msg: `${err.status || 500} ${err.message}` });
});

module.exports = app;
