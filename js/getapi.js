const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Assignment");

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
	    // Website you wish to allow to connect
	if(req.headers.origin) {
	   	res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
	    }
	    next();
    });

app.get('/', (req, res) => {
	res.send("Hello World!");
})

app.get('/users', (req, res) => {
	dbo.collection("Users").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    // console.log(result);
	    var myjson=JSON.stringify(result);
	    res.send(myjson);
	});
});

app.get('/city', (req, res) => {
  	dbo.collection("City").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    // console.log(result);
	    var myjson2=JSON.stringify(result);
	    res.send(myjson2);
	});
});

app.get('/states', (req, res) => {
  	dbo.collection("State").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    // console.log(result);
	    var myjson1=JSON.stringify(result);
	    res.send(myjson1);
	});
});

app.get('/count', (req, res) => {
	// console.log("req.query", req);

  	// console.log("req.body", res);
  dbo.collection("Users").find().limit(3).toArray(function(err, result) {
    if (err) throw err;
    // console.log(result);
    var myjson3=JSON.stringify(result);
	    res.send(myjson3);
  });
});

app.post('/cityselect',(req,res)=> {
    var body = req.body;
   // console.log("body = >", body);
    if(!body.cname){
      res.send(JSON.stringify({ mess: "cname parameter missing"}));
    }
    else{
      dbo.collection("Users").find({city: body.cname }).toArray(function(err,result){
        if(err) throw err;
        // console.log(result);
        var myjson4=JSON.stringify(result);
          res.send(myjson4);
      });
    }
  });



app.post('/insert', function (req, res) {
	var body1 = req.body;
    // for safety reasons
    // console.log("body =", body1);
    if(!body1.name|| !body1.mobile || !body1.address || !body1.city || !body1.state || !body1.gender){
      res.status(400).send(JSON.stringify({ mess: " parameter missing"}));
    }   
    else{
      dbo.collection("Users").insertOne(body1,function(err,result){
        if(err) throw err;
       //console.log("result",JSON.stringify(result));
        //var myjson4=JSON.stringify(result);
        //console.log(result.insertedId);
        var my={"id":result.insertedId};
        console.log("newid",my);
          res.status(200).send(JSON.stringify(my));
      });
     }
  });

app.post('/delete', function (req, res) {
  var body1 = req.body;
  console.log("body =", body1._id);
  if(!body1._id){ // 400 - 401
    res.status(400).send(JSON.stringify({ mess: "parameter missing"}));
  }
  else
  {
    dbo.collection('Users').deleteOne({_id: new mongodb.ObjectID(body1._id)},function(err,result){
      console.log("err",err,"result",result);
      if(err){
        throw err;
        res.status(503).send(JSON.stringify({ mess: err}));  
        console.log("document deleted");
      }
      else res.status(200).send(JSON.stringify({ mess: "deleted successfully"}));
    });
  }
});

 
app.post('/update', function (req, res) {
  console.log("req",req.body);
  var body1 = req.body;
  var body2 = body1._id;
  delete body1._id;
  if(!body1.name|| !body1.mobile || !body1.address || !body1.city || !body1.state || !body1.gender)
  {
    res.status(400).send(JSON.stringify({ mess: " parameter missing"}));
  }
  else{
    newquery = { $set: body1 }
    dbo.collection('Users').updateOne({ _id: new mongodb.ObjectID(body2)},newquery,function(err,result){
      if(err) {
        throw err;
        res.status(503).send(JSON.stringify({ mess: err}));  
      }else{
        console.log("sendind response",body1);
        res.status(200).send(JSON.stringify(body1));
      } 
    });
  }
});

app.post('/citydata', function (req, res)
 {
	var body1 = req.body;
	// console.log(body1._id);
	if(!body1._id){
    res.send(JSON.stringify({ mess: " parameter missing"}));
  }
  else{
    dbo.collection("City").find({sid: new mongodb.ObjectID(body1._id)}).toArray(function(err,result){
      if(err) throw err;
      var myjson4=JSON.stringify(result);
      // console.log(myjson4);
      res.send(myjson4);
    });
  }
});


// ÷

  app.listen(3005, () => console.log('Example app listening on port 3005!'))

});



