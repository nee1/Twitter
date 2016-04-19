/**
 * New node file
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should login', function(done){
		request.post('http://localhost:3000/user/login?username=u1&password=u1', function(res) {
			assert.equal(200, res.status);
		});
		done();
	});

	it('should not signup', function(done){
		request.post('http://localhost:3000/user/signup?username=u1&password=u55&firstname=user55&email=user55@u.com', function(res) {
			assert.equal(401, res.status);
		});
		done();
	});

	it('gets all users', function(done) {
		http.get('http://localhost:3000/user/suggest', function(res){
			assert.equal(200,res.status);
		});
		done();
	});

	it('gets search user results', function(done) {
		http.get('http://localhost:3000/search/user?searchkey=use', function(res){
			assert.equal(200,res.status);
		});
		done();
	});

	it('gets search by hashtag results', function(done) {
		http.get('http://localhost:3000/search/tag?searchkey=trend', function(res){
			assert.equal(200,res.status);
		});
		done();
	});
});
