var ejs= require('ejs');
var mysql = require('mysql');

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'neel',
	    database : 'test',
	    port	 : 3306
	});
	return connection;
}


function fetchData(sqlQuery,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	connection = getConnection();

	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			callback(err,rows);
		}
		else 
		{	// return err or result

			console.log("\nConnection released");
			//connection.end();				
			console.log("query success");
			callback(err, rows);
		}
	});	
	
	connection.end();
};

function storeData(sqlQuery,callback){
	console.log("\n SQL query :: "+ sqlQuery);
	var connection = getConnection();

	connection.query(sqlQuery, function(err,results){
		if(err){
			console.log("ERROR : "+err);
			callback(err,results);
		}
		else
		{
			console.log("\nConnection released");
			//connection.end();
			console.log("query success");
			callback(err,results);
		}
	});
	connection.end();	
};

exports.fetchData=fetchData;
exports.storeData=storeData;
