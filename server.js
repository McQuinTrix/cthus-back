/**
 * Created by harshalcarpenter on 11/24/17.
 */
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    config = require('./models/config'),
    request = require('request'),
    time = 1000*60*60;

var j = setInterval(function () {
    saveCoin("eth");
    saveCoin("btc");
},3000);

function saveCoin(type){
    console.log(type);
    switch(type){
        case "btc":
            callAPI('https://api.gemini.com/v1/pubticker/btcusd',type);
            break;
        case "eth":
            callAPI('https://api.gemini.com/v1/pubticker/ethusd',type);
            break;
    }
}

function callAPI(url,type){
    request({
        method: 'GET',
        uri: url,
        gzip: true
    }, function(error, response, body){

        var resp = JSON.parse(body);

        console.log(resp,type);

        request({
            uri:'https://cryptonthus.herokuapp.com/api/daily-save',
            method: 'POST',
            json: {"value": resp.last, "type": type }
        })
    })
}

//database config

mongoose.connect(config.dbStr);

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
        btc.date = moment().valueOf();
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
    })
    .delete(function(req,res){
        BTCSchema.remove({
            _id: req.params.btc_id
        }, function (err,bear) {
            if(err){
                res.send({err:err, isSuccess: false})
            }
            res.json({message: 'Value Deleted', isSuccess: true})
        })
    });

//Email Sign In/Up
var Account = require('./models/account');

//--------------------------
//--------------------------
//Create User
//--------------------------
//--------------------------

router.route('/signup')
    .post(function(req,res){
        var json = req.body,
            acc = new Account();
        
        acc.email = json.email;
        acc.password = json.password;
        acc.pin = json.pin || "";
        acc.fname = json.fname || "";
        acc.lname = json.lname || "";
        acc.date = moment().valueOf();
        acc.lastUpdate = moment.valueOf();

        console.log(json);
        //Find if email already exists
        Account.findByEmail(json.email,function (err,data) {
            console.log(data);
            if(data.length === 0){
                acc.save(function (err) {
                    if(err){
                        res.send({"error":err,isSuccess: false});
                    }
                    res.json({message: 'Value Saved', isSuccess: true})
                })
            }else{
                res.json({message: 'Email Already Registered!', isSuccess: true})
            }
            if(err){
                res.send({err:err, isSuccess: false})
            }
        });
    })

//--------------------------
//--------------------------
//Get/Update/Delete userInfo
//--------------------------
//--------------------------
router.route('/userInfo')
        .post(function(req,res){
            Account.findByEmail(req.body.email, function (err,data) {
                if(err){
                    res.send({
                        data:{
                            message: "Error Encountered"
                        },
                        isSuccess: false,
                        error: err
                    })
                }

                if(req.body.password === data[0].password){
                    res.json({
                        data:{
                            fname: data[0].fname,
                            lname: data[0].lname,
                            message: "Request Successful",
                            userId: data[0]._id
                        },
                        isSuccess: true
                    });
                }else{
                    res.json({
                        data:{
                            userId: data[0]._id,
                            message: "Password incorrect!"
                        },
                        isSuccess: false
                    });
                }

            })
        })
        .put(function(res,req){
            var json = req.body;
            Account.findByEmail(req.body.email, function (err,data) {
                if(err){
                    res.send({err:err, isSuccess: false})
                }

                data.password = json.password;
                data.pin = json.pin || "";
                data.fname = json.fname || "";
                data.lname = json.lname || "";
                data.lastUpdate = moment.valueOf();
    
                btc.save(function(err){
                    if(err){
                        res.send({err:err, isSuccess: false})
                    }
                    res.json({message: 'Value Saved', isSuccess: true})
                })
            })
        })
        .delete(function(res,req){
            Account.remove({
                email: req.body.email
            }, function (err,bear) {
                if(err){
                    res.send({err:err, isSuccess: false})
                }
                res.json({message: 'Value Deleted', isSuccess: true})
            })
        });

//End userInfo
/****************************/

//--------------------------
//--------------------------
//Get/Update/Delete User BTC/ETH Account
//--------------------------
//--------------------------

//Portfolio save
var PSchema = require('./models/portfolio');

router.route('/portfolio')
    .post(function(req,res){
        var json = req.body,
            pAcc = new PSchema();

        pAcc.date = moment().valueOf();
        pAcc.value = json.value;
        pAcc.userId = json.userId;
        pAcc.type = json.type;

        pAcc.save(function (err) {
            console.log(err);
            if(err){
                res.send({"error":err,isSuccess: false});
            }
            res.json({message: 'Value Saved', isSuccess: true})
        })
    });
router.route('/portfolio/:id').get(function (req,res) {
        PSchema.findByUser(req.params.id, function (err,data) {
            if(err){
                res.send({err:err, isSuccess: false})
            }

            console.log(data);
            res.json({result:data})
        })
    });

/*
 Daily Save for coin save
 */
var DailySchema = require('./models/daily-value');

router.route('/daily-save')
    .post(function(req,res){
        var json = req.body,
            daily = new DailySchema();

        daily.date = moment().valueOf();
        daily.value = json.value;
        daily.type = json.type.toLowerCase();


        daily.save(function (err) {
            if(err){
                res.send({"error":err,isSuccess: false});
            }
            res.json({message: 'Value Saved', isSuccess: true})
        })
    });

router.route('/get-values/:type')
    .get(function (req,res){
        DailySchema.findByType(req.params.type, function (err,data) {
            if(err){
                res.send({err:err, isSuccess: false})
            }

            data = data.map(function (val,ind) {
                return {
                    value: val.value,
                    date: val.date
                }
            });

            //Respond
            res.json({type: req.params.type, result:data})
        })
    });

//End userInfo
/****************************/

//Registering our routes
app.use('/api',router);

//Starting the server
app.listen(port);
