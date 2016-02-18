var mysql = require('mysql');
var request = require('request');
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

      async.parallel([
            function(callback) {
                self.getProduct(router,connection,md5, callback);
            },
            function(callback) {
                self.getBuyer(router,connection,md5, callback);
            }], 
            function(err, results) {
                res.render('buyer', { product: results[0], buyer: results[1]});
            }
        );
    });

    router.get("/seller",function(req,res){
        var seller_data = [];   
        //Calling inventory service to fetch the data
        request({
           uri: "http://localhost:3001/seller",
           method: "GET"          
         }, function(error, response, body) {
             seller_data = JSON.parse(body);
             async.parallel([
                function(callback) {
                    self.getProduct(router,connection,md5, callback);
                },
                function(callback) {
                    self.getSeller(router,connection,md5, callback);
                }], 
                function(err, results) {
                    res.render('seller', { product: results[0], seller: results[1] , seller_data: seller_data});
                }
            );
        });

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
                res.json({"Error" : true, "Message" : err});
            } else {
                if(type=="S"){
                    async.parallel([
                        function(callback) {
                            self.getProduct(router,connection,md5, callback);
                        },
                        function(callback) {
                            self.getSeller(router,connection,md5, callback);
                        }], 
                        function(err, results) {
                            res.render('seller', { product: results[0], seller: results[1]});
                        }
                    );
                }
                else{
                  /* self.getProduct(router,connection,md5, function(err, product){
                        self.getBuyer(router,connection,md5,res,  function(err, buyer){
                          res.render('buyer', { product: product, buyer: buyer});
                       });
                    });*/

                async.parallel([
                            function(callback) {
                                self.getProduct(router,connection,md5, callback);
                            },
                            function(callback) {
                                self.getBuyer(router,connection,md5, callback);
                            }], 
                            function(err, results) {
                                res.render('buyer', { product: results[0], buyer: results[1]});
                            }
                    );
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
        //Calling inventory service to insert data
        request({
           headers: {
              'Content-Type': 'application/json'
            },
           uri: "http://localhost:3001/seller/create",
           method: "POST",
           form:{
               "userId": req.body.seller, "productId": req.body.product, "unitPrice": req.body.price, "quantity": req.body.quantity 
           }
         }, function(error, response, body) {
            res.redirect('/api/seller');
        });
    });
}
module.exports = REST_ROUTER;