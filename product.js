module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getProduct(res, mysql, context, complete){
        mysql.pool.query("SELECT Products.product_id as id, supplier_id, product_name, product_stock, price FROM Products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results;
            complete();
        });
    }

    /* Display all product */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteproduct.js"];
        var mysql = req.app.get('mysql');
        getProduct(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('product', context);
            }
        }
    });

    /* Adds a product, redirects to the product page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Products (supplier_id, product_name, product_stock, price) VALUES (?,?,?,?)";
        var inserts = [req.body.supplier_id, req.body.product_name, req.body.product_stock, req.body.price];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/product');
            }
        });
    });

    /* Delete a product */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Products WHERE product_id = ?";
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
