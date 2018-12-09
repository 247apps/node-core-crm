'use strict'

const express = require('express');
const router = express.Router();
const errors = require('throw.js');
const appError = require('../bin/config.js').appError;
const products = require('../db_modules/products.js');
var dateFormat = require('dateformat');
const tools = require('../includes/tools.js');
var php = require('phpjs');
const chalk = require('chalk');


router.get('/test', async (req, res, next) => {
      
    //var key2 = tools.lcfirst("BinhTest")
console.log('key2')
console.log(chalk.bgRed.bold('Hello world!'));

var t1 =['test','test2','test3']
var t2 = {"test":"binh", "lname":"Doe"}

process.exit()

//var tt1 = php.json_decode(t2)

                console.log(chalk.bgRed.bold(tt1));

//php.echo ( lcfirst('TTTest'));
//php.echo(php.strtotime('2 januari 2012, 11:12:13 GMT'));
   // res.status(200).send('Product endpoints');
});


var now = new Date();

let products_fields = {
    IsActive   : 0
    ,ProdName   : 'TEST'
    ,ProdInvoiceDesc: ''
    ,ProdCost   : 0
    ,ProdAllocBy: 0
    ,ProdExpires: 0
    ,HasVersion : 0
    ,VersionNo  : ''
    ,VersionDate: dateFormat(now, "yyyy-mm-dd HH:MM:ss")
    ,IsService  : 0
    }


//done
router.post('/FindProduct', async (req, res, next) => {

    var id = req.body.uid;
    
    if ( !id && id <= 0 && !isNumeric(id) ){
  
        var err_invalid = { success : false, errorMsg: "Invalid input"};
        return res.status(404).send(err_invalid);
    }
  
    try{
        let results = await products.FindProduct(id);
        
        var responseObject = { product: results[0] }; 
        return res.status(200).send(responseObject);
    }
    catch(err) {
       
        if (appError.shouldLog(err)) {
            next(new errors.BadGateway(err.message));
            
            var err_internal = { success : false, errorMsg: '500 Internal Server Error'};
            return res.status(500).send(err_internal); //client crash/requires Abort if missing this line
            
        }
        else{
            
            var err_not_found = { success : false, errorMsg: "404 Not Found"};
            return res.status(404).send(err_not_found);
        }
  }
    
});


//done
router.post('/GetProductsList', async (req, res, next) => {
   
    try{
        
        let results = await products.GetProductsList();
   
        var responseObject = { products: results }; // comply with Marty Venzon format request
        return res.status(200).send(responseObject)
      
    }
    catch(err) {

        if (appError.shouldLog(err)) {
            
            next(new errors.BadGateway(err.message))
               
            var err_not_found = { success : false, products: [], errorMsg: '500 Internal Server Error'};
            return res.status(500).send(err_not_found); //client crash/requires Abort if missing this line
            
        }
        else{
            var err_not_found = { success : false, products: [], errorMsg: "404 Not Found"};
            return res.status(404).send(err_not_found); //client crash/requires Abort if missing this line
        }
  }
    
});


//todo
router.post('/AddProduct', async (req, res, next) => {
    
    let fields = req.body.reqFields;
    
    try{
        
        let results = await products.Save('insert', fields, 0 );
         
        if (results.affectedRows == 1 ){
          var responseObject = { success : true, uID:9999 }; //TODO
        } else {
          var responseObject = { success : false, errorMsg: "No product created"};
        }
        
        return res.status(201).send(responseObject);
      
    }
    catch(err) {
        
        if (appError.shouldLog(err)) {
            next(new errors.BadGateway(err.message))
            
            var err_not_found = { success : false, errorMsg: err.message};
            return res.status(500).send(err_not_found);
  
        }
        else{
            var err_not_found = { success : false, errorMsg: "Product Not Found"};
            return res.status(404).send(err_not_found);
        }        
    }
});


//done
router.post('/UpdateProduct', async (req, res, next) => {
    
    var id = req.body.uid;
    
    var xfields = {
        Updated         : dateFormat(req.body.updated, "yyyy-mm-dd HH:MM:ss")
        ,VersionDate    : dateFormat(req.body.versionDate, "yyyy-mm-dd HH:MM:ss")
    }    
   
    var products_fields_to_update = {} // empty Object
  
    for(var key in products_fields) {
        
        var key2 = tools.lcfirst(key) //req always send lowercase 1st letter in the json keys
        
        var req_value = req.body[key2]
        
        products_fields_to_update[key] =  req.body[key2] ;
        
     }
     
     
    var fields_ready = Object.assign(products_fields_to_update,xfields);
    
   
    if ( ( id <= 0 || isNaN(id) ) || ( !id && !fields_ready  ) ){
        
            var err_invalid = { success : false, errorMsg: "Invalid input"};
            return res.status(400).send(err_invalid);
    }
  
    try{
        
        //let results = await products.UpdateProduct(fields_ready,id );
        
        //change to this for Update & Add Product
        let results = await products.Save('update', fields_ready,id );
         
        if (results.affectedRows == 1 ){
          var responseObject = { success : true }; 
        } else {
          var responseObject = { success : false, errorMsg: "No product updated"};  //add errorMsg based on Marty api doc, errorMsg: "..."
        }
        
        return res.status(200).send(responseObject);
      
    }
    catch(err) {
        
        if (appError.shouldLog(err)) {
            next(new errors.BadGateway(err.message))
            
            var err_not_found = { success : false, errorMsg: err.message};
            return res.status(500).send(err_not_found);
  
        }
        else{
            var err_not_found = { success : false, errorMsg: "Product Not Found"};
            return res.status(404).send(err_not_found);
        }        
    }
  
    
});

/*
router.get('/test', async (req, res, next) => {
    res.status(200).send('Product endpoints');
});
*/
    
module.exports = router;    