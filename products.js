'use strict'

const appError = require('../bin/config.js').appError;
const chalk = require('chalk');
 
 
 
//done
module.exports.FindProduct = async (pUid) => {

    try {
        
        var results = await global.db.query('select * from Products WHERE UID = ?', [pUid] );

    }
    catch(err) {
       
        throw new appError(appError.types.systemError, 5002, err.sqlMessage, "Encountered error while trying to retireve a product");
    }

    if (results.length === 0){        
        /*
            Same as the above comment. Only the error type is less critical user error.
        */
        throw new appError(appError.types.userError, 4004, "Product not found")
        
    }
    else
        return results;    
}


//done
module.exports.GetProductsList = async () => {

    try {
        
        var results = await global.db.query('SELECT * FROM Products');
                
    }
    catch(err) {

        throw new appError(appError.types.systemError, 5002, "Encountered error while trying to retireve a list of products");
    }

    if (results.length === 0){
       
        throw new appError(appError.types.userError, 4004, "Product not found")
    }
    else
        return results;   
    
}



//done
module.exports.UpdateProduct = async (pFields, pUid ) => {

    try {
        
        var results = await global.db.query(`update Products set ? WHERE UID = ${pUid} limit 1 `, pFields);   
        
    }
    catch(err) {

        throw new appError(appError.types.systemError, 5002, err.sqlMessage, "Encountered error while trying to update a product.");        
        
    }

    if (results.length === 0){
        throw new appError(appError.types.userError, 4004, "Product not updated")
    }
    else
        return results;   
}


//WILL USE SAVE , remove thismodule
module.exports.AddProduct = async (pFields ) => {

    try {
        
        var results = await global.db.query('insert into Products set ? ', pFields);     
        return results;   
        
    }
    
    catch(err) {
        
        var error_internal = "Internal Server Error. Encountered error while trying to add a product."
        throw new appError(appError.types.systemError, 5002, err.sqlMessage, error_internal);
        
    }
    
}

//todo
module.exports.Save = async (pAction, pFields, pId =0) => {
        
    try {
        
        if(pAction == 'insert' && pID == 0){
            console.log(chalk.bgRed.bold( pAction+ 'inserthere'));
            //var results = await global.db.query('insert into Products set ? ', pFields);
        }
        else{ //update
            console.log(chalk.bgRed.bold(pAction+ 'updatehere'));
            
            //var results = await global.db.query(`update Products set ? WHERE UID = ${uid} `, pFields); 
        }
        
        process.exit()
        return results;   
        
    }
    
    catch(err) {
        var error_internal = "Internal Server Error. Encountered error while trying to add a product."
        throw new appError(appError.types.systemError, 5002, err.sqlMessage, error_internal);
        
    }
    
}