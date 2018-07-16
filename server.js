/**
 * Created by harshalcarpenter on 11/24/17.
 */
var express = require('express'),
    path = require('path'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    config ,
    request = require('request'),
    coinValTime = 1000*60*30,
    nodemailer = require('nodemailer'),
    sendMail = require('./components/mail'),
    mailObject = require('./components/mail'),
    baseUrl = "",
    confirmEmailFunc = require("./components/api-func/confirm-email"),
    UserInfoAPI = require('./components/api-func/user-info'),
    coinValInterval = setInterval(function () {
        getCoinValue("eth");
        getCoinValue("btc");
    },coinValTime);

//database config
if(!process.env.MONGODB_URI){
    config = require('./models/config')

    //Initiate Mail Object 
    mailObject = mailObject(config.gmailPass);

    baseUrl = 'http://localhost:8000'
}else{
    mailObject = mailObject(process.env.GMAIL_PASS);
    baseUrl = 'http://www.cryptonthus.com';
}

//Mongo DB connect
mongoose.connect(process.env.MONGODB_URI || config.dbStr);

var BTCSchema = require('./models/btc-schema');

//------------------------------------
// configuring app to use bodyParser
// this lets us get data from a POST req
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Setting the port
var port = process.env.PORT || 8000;

//API Routes
var router = express.Router();

//---------- API Start ----------------
//middleware to intercept
router.use(function (req,res,next) {
   console.log('--- API Called ---');
   
   res.header("Access-Control-Allow-Origin", "*");
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

//Create User
router.route('/signup')
    .post(function(request,response){
        var bodyJson = request.body,
            AccountSchema = new Account();
        
        AccountSchema.email     = bodyJson.email;
        AccountSchema.password  = bodyJson.password;
        AccountSchema.pin       = bodyJson.pin || "";
        AccountSchema.fname     = bodyJson.fname || "";
        AccountSchema.lname     = bodyJson.lname || "";
        AccountSchema.date      = moment().valueOf();
        AccountSchema.lastUpdate = moment().valueOf();
        AccountSchema.emailConfirm = false;

        //Find if email already exists
        Account.findByEmail(bodyJson.email,function (accountError,data) {

            //If Email not found..
            if(data.length === 0){

                //Account Schema save if not found in emails
                AccountSchema.save(function (accountSchemaError,newInsertedData) {

                    var portfolioSchema = new PSchema();

                    if(accountSchemaError){
                        response.send({
                            "error": accountSchemaError,
                            isSuccess: false
                        });
                    }

                    //Set Portfolio and save
                    portfolioSchema.date = moment().valueOf();
                    portfolioSchema.userId = newInsertedData._id;
                    portfolioSchema.coins = [];

                    portfolioSchema.save(function (portfolioSchemaError,data) {

                        var newUserData = newInsertedData._doc;

                        mailObject.sendMail({
                            from: "Cryptonthus <support@cryptonthus.com>",
                            to: newUserData.email, 
                            subject: "Cryptonthus - Confirm Email", 
                            text: "", 
                            link: "<a href='"+baseUrl+"/confirm-email/"+newInsertedData._id+"'>Confirmation Link</a>",
                            html: "",
                            type: "confirmEmail"
                        });

                        if(portfolioSchemaError){
                            response.send({
                                "error"     : portfolioSchemaError,
                                isSuccess   : false
                            });
                        }

                        response.json({
                            message: 'Value Saved',
                            isSuccess: true,
                            data:{
                                fname: newUserData.fname,
                                lname: newUserData.lname,
                                message: "Request Successful",
                                userId: newUserData._id
                            }
                        });
                    });
                })
            }else{
                response.json({
                    message: 'Email Already Registered!',
                    isSuccess: true
                })
            }
            if(accountError){
                response.send({
                    error: accountError, 
                    isSuccess: false
                })
            }
        });
    });


//Get/Update/Delete userInfo
router.route('/userInfo/:id')
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

                if(data.length === 0){
                    res.json({
                        data:{
                            message: "Email or Password incorrect"
                        },
                        isSuccess: false
                    });
                }else{
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
                                message: "Password incorrect!"
                            },
                            isSuccess: false
                        });
                    }
                }
            })
        })
        .put(function(res,req){
            var json = req.req.body,
                id = req.req.params.id,
                account = new Account(),
                response = res.res;

            Account.findById(id, function (err,data) {
                if(err){
                    response.send({err:err, isSuccess: false})
                }

                data.password = json.password || data.password;
                data.pin = json.pin || "";
                data.fname = json.fname || data.fname;
                data.lname = json.lname || data.lname;
                data.lastUpdate = moment().valueOf();

                data.save(function(err){
                    if(err){
                        response.send({err:err, isSuccess: false})
                    }
                    response.json({
                        message: 'Value Saved',
                        isSuccess: true,
                        result: json
                    });
                })
            })
        })
        .delete()
        .get(UserInfoAPI.getUserInfo);

//Get/Update/Delete User BTC/ETH Account
//Portfolio save
var PSchema = require('./models/portfolio');

router.route('/portfolio')
    .post(function(req,res){
        var json = req.body,
            pAcc = new PSchema();

        /**
         * {
         *  userId: "",
         *  type: "",
         *  value: ""
         * }
         */

        pAcc.date = moment().valueOf();
        pAcc.userId = json.userId;

        PSchema.findByUser(json.userId, function (err,data) {
            if(err){
                res.send({err:err, isSuccess: false})
            }

            var found = false;
            console.log(data);

            //Find coin type and assign value
            data[0].coins.map(function(elem,ind){
                if(elem.type === json.type){
                    found = true;
                    elem.value = json.value;
                }
                return elem;
            });

            if(!found){
                data[0].coins.push({
                    type: json.type.toUpperCase(),
                    value: json.value
                })
            }

            //Assign coins
            pAcc.coins = data[0].coins;

            pAcc.save(function (err) {
                console.log(err);
                if(err){
                    res.send({"error":err,isSuccess: false});
                }
                res.json({message: 'Value Saved', isSuccess: true})
            })
        });
    });

router.route('/portfolio/:id')
    .get(function (req,res) {
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
        var type = req.params.type;

        DailySchema.findByType(type, function (err,data) {
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
            res.json({type: type, result:data})
        })
    });

router.route('/action/:type')
    .post( handleAction );

//Confirming Email
router.route('/confirm-email/:id').post( confirmEmailFunc );

//Registering our routes for api
app.use('/api',router);

//---------- API END --------------------


function getCoinValue(coinType){

    switch(coinType){
        case "btc":
            reqCoinAPI('https://api.gemini.com/v1/pubticker/btcusd',coinType);
            break;
        case "eth":
            reqCoinAPI('https://api.gemini.com/v1/pubticker/ethusd',coinType);
            break;
    }
}

function reqCoinAPI(url,coinType){
    request({
        method: 'GET',
        uri: url,
        gzip: true
    }, function(error, response, body){
        body = JSON.parse(body);
        saveCoinValue(body,coinType);
    })
}

function saveCoinValue(response,coinType){
    request({
        uri:'https://cryptonthus.herokuapp.com/api/daily-save',
        method: 'POST',
        json: {"value": response.last, "type": coinType }
    })
}

//---------- HTML Server Start ----------------

// For Webpage
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/website/index.html'));
});

//---------- HTML Server End ----------------

//Starting the server
app.listen(port);