/**
 * Created by harshalcarpenter on 11/24/17.
 */
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    moment = require('moment');

//database config

mongoose.connect("mongodb://heroku_h86dbp94:23lqki7gjgpht4q7u1h0ti9gae@ds147681.mlab.com:47681/heroku_h86dbp94")

var BTCSchema = require('./models/btc-schema');

//------------------------------------
// configuring app to use bodyParser
// this lets us get data from a POST req
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Setting the port
var port = process.env.PORT || 8001;

//API Routes
var router = express.Router();

//middleware to intercept and stuff
router.use(function (req,res,next) {
   console.log('**Something up**');
   next();
});

router.get('/', function(req,res){
    res.json({message: "Reached Cryptonthus API"});
});

router.route('/btc')
    .post(function(req,res){
        var btc = new BTCSchema();
        btc.date = moment().millisecond();
        btc.value = req.body.value;

        console.log(btc,req);

        btc.save(function (err) {
            if(err){
                res.send({"error":err,isSuccess: false});
            }
            res.json({message: 'Value Saved', isSuccess: true})
        })

    })
    .get(function(req,res){
        BTCSchema.find(function(err,btc){
            if(err){
                res.send({err: err,isSuccess: false})
            }
            res.json(btc);
        })
    });

router.route('/btc/:btc_id')
    .get(function(req,res){
        BTCSchema.findByID(req.params.btc_id, function (err,btc) {
            if(err){
                res.send({err:err, isSuccess: false})
            }
            res.json(btc)
        })
    })
    .put(function(req,res){
        BTCSchema.findById(req.params.btc_id, function (err,btc) {
            if(err){
                res.send({err:err, isSuccess: false})
            }

            btc.value = req.body.value;

            btc.save(function(err){
                if(err){
                    res.send({err:err, isSuccess: false})
                }
                res.json({message: 'Value Saved', isSuccess: true})
            })
        })
    }).delete(function(req,res){
        BTCSchema.remove({
            _id: req.params.btc_id
        }, function (err,bear) {
            if(err){
                res.send({err:err, isSuccess: false})
            }
            res.json({message: 'Value Deleted', isSuccess: true})
        })
})

//Registering our routes
app.use('/api',router);

//Starting the server
app.listen(port);
