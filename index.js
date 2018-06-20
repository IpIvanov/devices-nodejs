const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://heroku_pzjkqtx4:jopj4k95skgmra6noco7g85hod@ds163510.mlab.com:63510/heroku_pzjkqtx4';


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

