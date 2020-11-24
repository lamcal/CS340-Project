module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getDelivery(res, mysql, context, complete){
        mysql.pool.query("SELECT Deliveries.delivery_id as id, order_id, delivery_status, delivery_date FROM Deliveries", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.delivery = results;
            complete();
        });
    }

    /* Display all deliveries */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletedelivery.js"];
        var mysql = req.app.get('mysql');
        getDelivery(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('delivery', context);
            }
        }
    });

    /* Adds a delivery, redirects to the delivery page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Deliveries (order_id, delivery_status, delivery_date) VALUES (?,?,?)";
        var inserts = [req.body.order_id, req.body.delivery_status, req.body.delivery_date];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/delivery');
            }
        });
    });

    /* Delete a delivery */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Deliveries WHERE delivery_id = ?";
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
