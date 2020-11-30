module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getOrder(res, mysql, context, complete){
        mysql.pool.query("SELECT Orders.order_id as id, customer_id, order_placed, total_due, payment_method FROM Orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order = results;
            complete();
        });
    }

    /*Get a specific order based on a given order_id */
    function getOrderById(res, mysql, context, id, complete){
        var sql = "SELECT Orders.order_id as id, customer_id, order_placed, total_due, payment_method FROM Orders WHERE Order_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order = results[0];
            complete();
        });
    }

    /* Display all orders */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteorder.js"];
        var mysql = req.app.get('mysql');
        getOrder(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('order', context);
            }
        }
    });

    /* Used for updating a chosen order */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateorder.js"];
        var mysql = req.app.get('mysql');
        getOrderById(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update-order', context);
            }
        }
    });

    /* Adds an order, redirects to the order page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (customer_id, order_placed, total_due, payment_method) VALUES (?,?,?,?)";
        var inserts = [req.body.customer_id, req.body.order_placed, req.body.total_due, req.body.payment_method];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/order');
            }
        });
    });

    /* The URI that updates what data is sent to so that a chosen order is updated */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Orders SET customer_id = ?, order_placed = ?, total_due = ?, payment_method = ? WHERE order_id = ?";
        var inserts = [req.body.customer_id, req.body.order_placed, req.body.total_due, req.body.payment_method, req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("There was an issue updating the selected order.")
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

    /* Delete an order */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Orders WHERE order_id = ?";
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
    /* TEST */
}();
