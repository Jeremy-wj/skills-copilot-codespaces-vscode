// Create web server
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var qs = require('querystring');
var commentData = require('./comments.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set the path for static files
app.use(express.static(path.join(__dirname, 'public')));

// Set the path for the Bootstrap files
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Set the path for the jQuery files
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// Set the path for the Popper files
app.use('/popper', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));

// Set the path for the Font Awesome files
app.use('/font-awesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));

// Render the index page
app.get('/', function(req, res) {
  res.render('index', {
    comments: commentData
  });
});

// Render the new comment page
app.get('/new', function(req, res) {
  res.render('new');
});

// Post the new comment
app.post('/new', function(req, res) {
  var newComment = req.body;
  commentData.push(newComment);
  fs.writeFile('./comments.json', JSON.stringify(commentData), function(err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/');
});

// Render the edit comment page
app.get('/edit/:id', function(req, res) {
  var id = req.params.id;
  var comment = commentData[id];
  res.render('edit', {
    id: id,
    comment: comment
  });
});

// Post the edited comment
app.post('/edit/:id', function(req, res) {
  var id = req.params.id;
  var editedComment = req.body;
  commentData[id] = editedComment;
  fs.writeFile('./comments.json', JSON.stringify(commentData), function(err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect('/');
});