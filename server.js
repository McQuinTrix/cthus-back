/**
 * Created by harshalcarpenter on 11/24/17.
 */
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configuring app to use bodyParser(
// this lets us get data from a POST req
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Setting the port
var port = process.env.PORT || 8000;

//API Routes
var router = express.Router();

router.get('/', function(req,res){
    res.json({message: "Reached Cryptonthus API"});
});

//Registering our routes
app.use('/api',router);

//Starting the server
app.listen(port);
