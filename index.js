const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

const MongoClient = require('mongodb').MongoClient;
const mongoURL =
  'mongodb://heroku_pzjkqtx4:jopj4k95skgmra6noco7g85hod@ds163510.mlab.com:63510/heroku_pzjkqtx4';

// all of our routes will be prefixed with /api

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

router.get('/devices', function (request, response) {
  MongoClient.connect(mongoURL, function (err, db) {
    if (err) throw err;
    db
      .collection('devices')
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        response.json(result);
        db.close();
      });
  });
});

router.post('/device', function (request, response) {
  let device = request.body.device;

  MongoClient.connect(mongoURL, function (err, db) {
    if (err) throw err;
    db.collection('devices').findOne({ name: device }, function (err, result) {
      if (err) throw err;
      response.json(result);
      db.close();
    });
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});