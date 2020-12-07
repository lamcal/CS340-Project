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

    function getOrder(res, mysql, context, complete){
        mysql.pool.query("SELECT Orders.order_id as id FROM Orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order = results;
            complete();
        });
    }

    /*Get a specific delivery based on a given delivery_id */
    function getDeliveryById(res, mysql, context, id, complete){
        var sql = "SELECT Deliveries.delivery_id as id, order_id, delivery_status, delivery_date FROM Deliveries WHERE delivery_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.delivery = results[0];
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
        getOrder(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('delivery', context);
            }
        }
    });

    /* Used for updating a chosen delivery */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatedelivery.js"];
        var mysql = req.app.get('mysql');
        getDeliveryById(res, mysql, context, req.params.id, complete);
        getOrder(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                console.log(context);
                res.render('update-delivery', context);
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

    /* The URI that updates what data is sent to so that a chosen delivery is updated */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Deliveries SET order_id = ?, delivery_status = ?, delivery_date = ? WHERE delivery_id = ?";
        var inserts = [req.body.order_id, req.body.delivery_status, req.body.delivery_date, req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("There was an issue updating the selected delivery.")
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
