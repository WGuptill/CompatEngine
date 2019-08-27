const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
'mongodb+srv://shootbuildthink:S3cur3Password@compatibilitycluster-qvcnj.mongodb.net/test?retryWrites=true&w=majority';

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

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

app.post('/login', function(request, response) {
  newUser = new User(request.body.id, request.body.pass);
  response.send(newUser.username + " " + newUser.password);
})

router.get('/getUsers', (request, response) => {
  Data.find((err, data) => {
    if (err) return "Bad Beans";
    else return "Beans";
  });
});

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));