const  	request 						= require('request'),
   			assert            	= require('assert'),
				ADMIN_KEY          	= "ew5XjmBTOCiOf6uzF0rcBZ7mDQ84CEmQkEg",
				KEY                 = "o61k0e4xMAYO3Q1rKw4"
				
describe('Gender', function() {  
  it('should return the gender male for khalid', function(done) {
		var url  = "http://127.0.0.1:3000/gender/get?key="+ADMIN_KEY+"&name=khalid" 
		request({ gzip: true, url: url, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			assert.equal(data.results.khalid.gender, "male")
			if(error) done(error)
			else done()	
		})
  })
  it('should return the gender and first last name user', function(done) {
		var url  = "http://127.0.0.1:3000/gender/get?key="+ADMIN_KEY+"&name=khalid rahmani;nora hayat;dr kimi raikonen&type=full_name" 
		request({ gzip: true, url: url, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			assert.equal(data.results['khalid rahmani'].gender, "male")
			assert.equal(data.results['nora hayat'].gender, "female")
			assert.equal(data.results['dr kimi raikonen'].gender, "unisex")
			if(error) done(error)
			else done()	
		})
  })  
})

