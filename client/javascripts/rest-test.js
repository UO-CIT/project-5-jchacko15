“C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe” –dbpath=c:\data\db
//jshint esversion: 6
//Connects to a MongoDB server
//Endpoints for Get, Post, and Delete requests

// initialize

const
 port = 8888,
 bodyParser = require('body-parser'),
 express = require('express'),
 app = express(),
 dbURL = 'mongodb://127.0.0.1:27017',
 MongoClient = require('mongodb').MongoClient,
 client = new MongoClient(dbURL),
 dbName = 'todoDB',
 collName = 'todos';

let db, col, key = 0;

MongoClient.connect(dbURL, {
 useNewUrlParser: true
}, (err, client) => {
 if (err) return console.log(err)
 // Storing a reference to the database so you can use it later
 db = client.db(dbName);
 col = db.collection(collName);
 console.log(`Connected MongoDB: ${dbURL}`)
 console.log(`Database: ${dbName}`)
})

//if the client directory contains an "index.html" web page
//  it will be displayed as the default document
app.use(express.static(__dirname + "/client"));

// Parse data from incoming Post requests
app.use(bodyParser.urlencoded({
 extended: false
}));
app.use(bodyParser.json());

// enable CORS
app.use((req, res, next) => {
 res.append('Access-Control-Allow-Origin', '*');
 next();
});

// endpoint to Get all comments
app.get('/todos', (req, res) => {
 db.collection(collName).find({}).toArray(function(err, result) {
   if (err) throw err;
   //console.log(result);
   res.status(200).send({
     success: 'true',
     message: 'todos retrieved successfully',
     todos: result
   })
 })
});

//endpoint to get a single comment
app.get('/gettodo/:data', (req, res, next) => {
 const data = req.params.data;

 db.collection(collName).findOne({
   "data": data
 }, function(err, result) {
   if (err) throw err;
   console.log(result);
   res.status(200).send({
     status_code: 200,
     message: ((result) ? result : 'comment not found')
   })
 });
});


//Endpoint to add a comment
app.post('/addtodo', (req, res) => {
 // Insert a single document
 let todo = {
   data: req.body.data
 }

 db.collection(collName).insertOne(todo)
   .then(result => {
     console.log(`record inserted ${result}`)
     return res.status(201).send({
       status_code: 200,
       message: 'todo added successfully',
       todo
     })
   })
   .catch(error => console.error(error))
})
<!-- this file goes in the client directory -->

<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="ie=edge">
 <title>REST Test</title>
</head>
<body>
 <h2>RESTful Web App Test</h2>
 <p>Endpoint URL:
   <input id="endpointURL" style="font-size: 20px;"  type="text"></p>
 <p>
   Your Name:
   <input id="userName" style="font-size: 20px;" type="text">
 </p>
 <p><button style="font-size: 20px;">Go!</button></p>
 <hr>
 <div></div>
 <script src="http://code.jquery.com/jquery-latest.min.js"></script>
 <script src="javascripts/rest-test.js"></script>
</body>
</html>
