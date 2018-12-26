var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var app = express();


//mongo connection
mongoose.connect("mongodb://localhost:27017/bookworm",{ useNewUrlParser: true });

var db = mongoose.connection;
//mongo error
db.on('error', console.error.bind(console, 'connection error'))

//use session for tracking logins
app.use(session({
  secret: 'session secret', //signs session id cookie
  resave: true, //forces session to be saved in sessionStore
  saveUninitialized: false, //do not save uninitialized session
  store: new mongoStore({
    mongooseConnection: db
  })
}))
// make userID available for all template
app.use((req,res,next)=>{
//locals lets you add additional info to the response
  res.locals.currentUser = req.session.userId 
  next()
})


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var port = process.env.PORT || 3000
// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port' + port);
});