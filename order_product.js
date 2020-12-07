module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getOrderProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT order_id, product_id, quantity FROM Order_Products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order_products = results;
            complete();
        });
    }

    /*Get a specific order_product based on a given order_id */
    function getOrderProductsByOrderId(res, mysql, context, id, complete){
        var sql = "SELECT order_id, product_id, quantity FROM Order_Products WHERE order_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order_products = results[0];
            complete();
        });
    }

    /* Display all order_products */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteorder_product.js"];
        var mysql = req.app.get('mysql');
        getOrder(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('order_product', context);
            }
        }
    });

    /* Used for updating a chosen order */

    router.get('/:order_id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateorder_product.js"];
        var mysql = req.app.get('mysql');
        getOrderProductsByOrderId(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update-order_product', context);
            }
        }
    });

    /* Adds an order, redirects to the order page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Order_Products (order_id, product_id, quantity) VALUES (?,?,?)";
        var inserts = [req.body.order_id, req.body.product_id, req.body.quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/order_product');
            }
        });
    });

    /* The URI that updates what data is sent to so that a chosen order is updated */
    router.put('/:order_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Order_Products SET order_id = ?, product_id = ?, quantity = ? WHERE order_id = ?";
        var inserts = [req.body.order_id, req.body.product_id, req.body.quantity, req.params.order_id];
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

    router.delete('/:order_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Order_Products WHERE order_id = ?";
        var inserts = [req.params.order_id];
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
