select distinct * (select distinct * from tweets as t2 right join ("
	+"select r1.tweetid from retweets as r1 left join users as u1 on r1.user_id = u1.id "+
	"where r1.user_id in "+
	"( select follow_uname from following as f1 where f1.user_uname ="+ userid +") as res "+
	"on t2.tweet_id = res.tweet_id ) union "+
	"select * from tweets as t1 left join users as u2 "+
	"on t1.user_id = u2.id where t1.user_id in "+
	"( select follow_uname from following as f2 where f2.user_uname= " 
	+ userid + "));";



var ejs= require('ejs');
var mysql = require('mysql');

var pool  = mysql.createPool({
	  connectionLimit : 10,
	  host            : 'localhost',
	  user            : 'root',
	  password        : 'neel',
	  database		  : 'test',
	  port			  : 3306	
	});
	
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
};


function fetchData(sqlQuery,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.getConnection(function(err,connection){
		if(err){
			console.log("pool error" + err);
		}
		else
		{
			connection.query(sqlQuery, function(err, rows, fields) {
				if(err){
					console.log("ERROR: " + err.message);
					//callback(err,rows);
				}
				else 
				{	// return err or result

					console.log("\nConnection released");
					connection.release();				
					console.log("query success");
					callback(err, rows);
				}
			});	
					
		}
	});
};

function storeData(sqlQuery,callback){
	console.log("\n SQL query :: "+ sqlQuery);
	
	pool.getConnection(function(err,connection){
		if(err){
			console.log("pool error" + err);
		}
		else
		{
			connection.query(sqlQuery, function(err,results){
				if(err){
					console.log("ERROR : "+err);
					callback(err,results);
				}
				else
				{
					console.log("\nConnection released");
					connection.release();
					console.log("query success");
					callback(err,results);
				}
			});
		}
	});
	
};


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
};


function fetchData(sqlQuery,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	connection = getConnection();

	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			//callback(err,rows);
		}
		else 
		{	// return err or result

			console.log("\nConnection released");
			connection.end();				
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
			connection.release();
			console.log("query success");
			callback(err,results);
		}
	});
	connection.end();	
};

exports.fetchData=fetchData;
exports.storeData=storeData;