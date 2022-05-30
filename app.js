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
const numeral = require('numeral');
const favicon = require('serve-favicon')
const route = require('./routes');


var app = express();

// app.use(logger('dev'));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img/logosn.png')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SECRET_SESSION, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('remember-me'));
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
		isBigger: function(v1, v2, options) {
			if(v1 > v2) {
			  return options.fn(this);
			}
			return options.inverse(this);
		},
		isEqual: function(v1, v2, options) {
			if(v1 == v2) {
			  return options.fn(this);
			}	
			return options.inverse(this);
		},
		select: function( selected, options ){
			return options.fn(this).replace(
				new RegExp(' value=\"' + selected + '\"'),
				'$& selected="selected"');
		},
		currency: function(value, options){
			return numeral(value).format('0,0') + " VND"
		},
		isEmptyRoom: function(status, options){
			if(status === "Trống"){
				return options.fn(this);
			}
			return options.inverse(this);
		},
		json: function(obj) {
			return JSON.stringify(obj);
		},
		sum: function(a, b, options){
			return a + b;
		},
		ratio: function(value){
			return numeral(value).format("0%");
		}
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
	const status = err.status || 500
	res.status(status);
	console.log(err);
	if(status === 404){
		res.render('404', {
			layout:false,
		});
	}
	else if(status === 500){
		res.render('500', {
			layout:false,
		});
	}
	else{
		res.render('error', {msg: `${err.status || 500} ${err.message}`, layout:false });
	}
	
});

module.exports = app;
