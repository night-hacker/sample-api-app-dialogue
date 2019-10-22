var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var logger = require('morgan');

var app = express();
const port = 4000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

app.post('/', (req, res) => {
  
  
  req2API({name: req.body.name}, data => {
    
    if (data) {
      res.send(data);
    }
    else {
      res.send("no data..............");
      
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log('\x1b[32m', `>>> APP URL: http://localhost:${port}`, '\x1b[0m'));

module.exports = app;


/************************************************************\
# API requests handler
\************************************************************/

function req2API(body, callback) {
  const post2API = JSON.stringify(body, null, 2);
  const req2APIOptions = {
    method: "POST",
    hostname: "localhost",
    port: 3000,
    path: "/",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": post2API.length,
    }
  };
  let resFromAPI = "";
  const req2API = http.request(req2APIOptions, chunks => {
    chunks.on('data', data => resFromAPI += data);
    chunks.on('end', () => callback(JSON.parse(resFromAPI)));
  });
  req2API.write(post2API);
  req2API.end();
}
/************************************************************/