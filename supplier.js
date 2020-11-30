module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSupplier(res, mysql, context, complete){
        mysql.pool.query("SELECT Suppliers.supplier_id as id, supplier_name, supplier_quantity FROM Suppliers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.supplier = results;
            complete();
        });
    }

    /*Get a specific supplier based on a given supplier_id */
    function getSupplierById(res, mysql, context, id, complete){
        var sql = "SELECT Suppliers.supplier_id as id, supplier_name, supplier_quantity FROM Suppliers WHERE supplier_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.supplier = results[0];
            complete();
        });
    }

    /* Display all suppliers */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletesupplier.js"];
        var mysql = req.app.get('mysql');
        getSupplier(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('supplier', context);
            }
        }
    });

    /* Used for updating a chosen supplier */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatesupplier.js"];
        var mysql = req.app.get('mysql');
        getSupplierById(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                console.log(context);
                res.render('update-supplier', context);
            }
        }
    });

    /* Adds a supplier, redirects to the supplier page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Suppliers (supplier_name, supplier_quantity) VALUES (?,?)";
        var inserts = [req.body.supplier_name, req.body.supplier_quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/supplier');
            }
        });
    });

    /* The URI that updates what data is sent to so that a chosen supplier is updated */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Suppliers SET supplier_name = ?, supplier_quantity = ? WHERE supplier_id = ?";
        var inserts = [req.body.supplier_name, req.body.supplier_quantity, req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("There was an issue updating the selected supplier.")
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

    /* Delete a supplier */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Suppliers WHERE supplier_id = ?";
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
