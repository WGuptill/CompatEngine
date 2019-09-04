const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const MongoClient = require('mongodb').MongoClient;

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRouteUsers =
'mongodb+srv://shootbuildthink:S3cur3Password@compatibilitycluster-qvcnj.mongodb.net/UserInformation?retryWrites=true&w=majority';

// connects our back end code with the database
mongoose.connect(dbRouteUsers, { useNewUrlParser: true });

let db = mongoose.connection;
const schema = new mongoose.Schema({username: 'string', password: 'string'}, { versionKey: false }, );

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (request, response) => {
  Data.find((err, data) => {
    if (err) return response.json({ success: false, error: err });
    return response.json({ success: true, data: data });
  });
});

// this is our create method
// this method adds new data in our database
router.post('/putData', (request, response) => {
  let data = new Data();

  const { id, message } = request.body;

  if ((id.trim() == "") || (message.trim() == "")) {
    return response.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.message = message;
  data.id = id;
  data.save((err) => {
    if (err) return response.json({ success: false, error: err });
    return response.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);

app.post('/signup', function(request, response) {
    var username;
    var User = db.model('User', schema);

    MongoClient.connect(dbRouteUsers, function(err, db) {
      if (err) throw err;
      var dbo = db.db("UserInformation");
      dbo.collection("users").findOne({username: request.body.username}, function(err, result) {
        if (err) throw err;
        if(result !== null)
        {
        username = result.username;
        }
        db.close();
        if(username !== request.body.username)
        {
          User.create({username: request.body.username, password: request.body.password});
          response.send("User Created")
        }
        else
        {
          response.send("User Exists")
        }
      })
    })
})

app.post('/signin', function(request, response) {
  var username;
  var password;
  MongoClient.connect(dbRouteUsers, function(err, db) {
    if (err) throw err;
    var dbo = db.db("UserInformation");
    dbo.collection("users").findOne({username: request.body.username}, function(err, result) {
      if (err) throw err;
      if(result !== null)
      {
      username = result.username;
      password = result.password;
      }
      db.close();
      if(username !== request.body.username)
      {
        response.send("No User");
      }
      else if(password === request.body.password)
      {
        response.send("Sign In");
      }
      else
      {
        response.send("Wrong Password");
      }
    })
  })
})

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));