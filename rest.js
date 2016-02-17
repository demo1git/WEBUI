var mysql = require('mysql');
//var Client = require('node-rest-client').Client;
//var client = new Client();
var requestify = require('requestify');
//var unirest = require('unirest');

//var querystring = require('querystring');
//var http = require('http');

var async = require('async');

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.getProduct= function(router,connection,md5, callback) {
    var query = "SELECT * FROM ??";
        var table = ["product"];
        var products = [];
        query = mysql.format(query,table);
     
        connection.query(query,function(err,rows){
            if(err) {
                callback(err);
            } else {
               
                 for( var i in rows){               
                    products.push(rows[i]);
                }
                callback(null, products);
            }
        });
}

REST_ROUTER.prototype.getSeller= function(router,connection,md5, callback) {
    var query = "SELECT * FROM ?? WHERE user_type='S'";
        var table = ["user"];
        var seller = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                 callback(err);
            } else {
               
                 for( var i in rows){               
                    seller.push(rows[i]);
                }
                callback(null, seller);
            }
        });
}

REST_ROUTER.prototype.getBuyer= function(router,connection,md5, callback) {
    var query = "SELECT * FROM ?? WHERE user_type='B'";
        var table = ["user"];
        var buyer = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                 callback(err);
            } else {
               
                 for( var i in rows){               
                    buyer.push(rows[i]);
                }
                callback(null, buyer);
            }
        });
}


REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    var self = this;
    router.get("/user",function(req,res){
       res.render('register');
    });

    router.get("/buyer",function(req,res){
      
      async.parallel(
            [
                function(callback) {
                    self.getProduct(router,connection,md5, callback);
                },
                function(callback) {
                    self.getBuyer(router,connection,md5, callback);
                }
            ], 
            function(err, results) {
                res.render('buyer', { product: results[0], buyer: results[1]});
            }
        );
           /* self.getProduct(router,connection,md5, function(err, product){
            self.getBuyer(router,connection,md5,res,  function(err,buyer){
              res.render('buyer', { product: product, buyer: buyer});
           });
        });*/
    });

    router.get("/seller",function(req,res){
        
         async.parallel(
            [
                function(callback) {
                    self.getProduct(router,connection,md5, callback);
                },
                function(callback) {
                    self.getSeller(router,connection,md5, callback);
                }
            ], 
            function(err, results) {
                res.render('seller', { product: results[0], seller: results[1]});
            }
        );

        /*self.getProduct(router,connection,md5, function(err,product){
            self.getSeller(router,connection,md5,res,  function(err,seller){
              res.render('seller', { product: product, seller: seller});
           });
        });*/
    });

    router.get("/product",function(req,res){
        self.getProduct(router,connection,md5, function(err,result){
          res.render('product', { product: result});
        });
    });

    router.post("/user",function(req,res){
       var query = "INSERT INTO ??(??,??) VALUES (?,?)";
       var type = req.body.type;
        var table = ["user","user_name","user_type",req.body.username, req.body.type];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                if(type=="S"){
                    self.getProduct(router,connection,md5, function(err, product){
                        self.getSeller(router,connection,md5,res,  function(err, seller){
                          res.render('seller', { product: product, seller: seller});
                       });
                    });
                }
                else{
                   self.getProduct(router,connection,md5, function(err, product){
                        self.getBuyer(router,connection,md5,res,  function(err, buyer){
                          res.render('buyer', { product: product, buyer: buyer});
                       });
                    });
                }
            }
        });
    });

    router.post("/product",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["product","product_name","description",req.body.product, req.body.description];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                self.getProduct(router,connection,md5, function(err,result){
                  res.render('product', { product: result});
                });
            }
        });
    });

    router.post("/seller",function(req,res){
        /*  var args = {
            data: { userId: req.body.seller, productId: req.body.product, unitPrice: req.body.price, quantity: req.body.quantity },
            headers: { "Content-Type": "application/json" }
        };
         
        client.post("http://localhost:3001/create", args, function (data, response) {
            // parsed response body as js object 
            console.log(data);
            // raw response 
            console.log(response);
        });*/


        //request.post('http://localhost:3001/create', {form:{ userId: req.body.seller, productId: req.body.product, unitPrice: req.body.price, quantity: req.body.quantity }});
  
        /*request.post(
            'http://localhost:3001/create',
            {form: { userId: req.body.seller, productId: req.body.product, unitPrice: req.body.price, quantity: req.body.quantity }},
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
*/
        /*unirest.post('http://localhost:3001/create')
            .header('Accept', 'application/json')
            .send({ userId: req.body.seller, productId: req.body.product, unitPrice: req.body.price, quantity: req.body.quantity })
            .end(function (response) {
              console.log(response.body);
            });*/

        /*var options = {
          host: http://localhost:3001/create,
          port: 3001,
          path: '/resource?id=foo&bar=baz',
          method: 'POST'
        };

        http.request(options, function(res) {
          console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
          });
        }).end();*/


requestify.post('http://localhost:3001/create', {
        userId: req.body.seller, 
        productId: req.body.product, 
        unitPrice: req.body.price, 
        quantity: req.body.quantity
    })
    .then(function(response) {
        // Get the response body (JSON parsed or jQuery object for XMLs)
        //response.getBody();

        // Get the raw response body
        //response.body;
        console.log("success");
    });
    });
}

module.exports = REST_ROUTER;