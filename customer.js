const { pool } = require('./dbcon');

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomer(res, mysql, context, complete){
        mysql.pool.query("SELECT Customers.customer_id as id, first_name, last_name, email, password, address_1, address_2, city, state, zip_code FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
        });
    }
    function getCustomerById(res, mysql, context, id, complete){
        var sql = "SELECT Customers.customer_id as id, first_name, last_name, email, password, address_1, address_2, city, state, zip_code FROM Customers WHERE customer_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete();
        });

    }

    /* Find customer whose email starts with a given string in the req */

    function getCustomerWithEmailLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
      var query = "SELECT Customers.customer_id as id, first_name, last_name, email, password, address_1, address_2, city, state, zip_code FROM Customers WHERE Customers.email LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
        });
    }

    /* Display all customers */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('customer', context);
            }
        }
    });

    /* Display customer by email. Requires web based javascript to delete users with AJAX */

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletecustomer.js","searchcustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomerWithEmailLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('customer', context);
            }
        }
    });

    /* Used for updating a chosen customer */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomerById(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update-customer', context);
            }
        }
    });

    /* Adds a customer, redirects to the people page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers (first_name, last_name, email, password, address_1, address_2, city, state, zip_code) VALUES (?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.address_1, req.body.address_2, req.body.city, req.body.state, req.body.zip_code];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customer');
            }
        });
    });

    /* The URI that updates data is sent to so that a customer is updated */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Customers SET first_name = ?, last_name = ?, email = ?, password = ?, address_1 = ?, address_2 = ?, city = ?, state = ?, zip_code = ? WHERE customer_id = ?";
        var inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.address_1, req.body.address_2, req.body.city, req.body.state, req.body.zip_code, req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("There was an issue updating the selected customer.")
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }
            else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Delete a customer */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE customer_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
