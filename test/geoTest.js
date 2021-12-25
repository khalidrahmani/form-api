const  	request 						= require('request'),
   			assert            	= require('assert'),
				ADMIN_KEY          	= "ew5XjmBTOCiOf6uzF0rcBZ7mDQ84CEmQkEg",
				KEY                 = ADMIN_KEY//"soa2dzh50pxdwy8936d"

describe('Geo', function() {
  it('should return states for UK', function(done) {
		var url  = "http://127.0.0.1:3000/geo/country/states?key="+KEY+"&country=uk" 
		request({ gzip: true, url: url, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			//console.log(data)
			assert.equal(data.status, "Ok")
			if(error) done(error)
			else done()	
		})
  })
  /*
  it('should return level2area for NY, US', function(done) {
		var url  = "http://127.0.0.1:3000/geo/country/state/level2area?key="+KEY+"&country=us&state=NY"
		request({ gzip: true, url: url, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			//console.log(data)
			assert.equal(data.status, "Ok")
			if(error) done(error)
			else done()	
		})
  })*/
  it('should return states for NY, US', function(done) {
		var url  = "http://127.0.0.1:3000/geo/country/state/cities?key="+KEY+"&country=us&state=NY"
		request({ gzip: true, url: url, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			assert.equal(data.status, "Ok")
			if(error) done(error)
			else done()	
		})
  })
  it('should return zip codes for New York US', function(done) {
		var url  = "http://127.0.0.1:3000/geo/country/state/city/zips?key="+KEY+"&country=us&state=NY&city=3"
		request({ gzip: true, url: url, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			console.log(data)
			assert.equal(data.status, "Ok")
			if(error) done(error)
			else done()	
		})
  })  
  it('should return zip codes for New York US', function(done) {
		var url  = "http://127.0.0.1:3000/geo/country/zip?key="+KEY+"&country=us&zipcode=99605"
		request({ gzip: true, url: url, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			assert.equal(data.status, "Ok")
			if(error) done(error)
			else done()	
		})
  })  



})

