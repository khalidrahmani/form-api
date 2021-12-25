const  	request 						= require('request'),
   			assert            	= require('assert'),
				ADMIN_KEY          	= "ew5XjmBTOCiOf6uzF0rcBZ7mDQ84CEmQkEg",
				KEY                 = ADMIN_KEY//"soa2dzh50pxdwy8936d"

describe('Validate', function() {  
  it('should be invalid', function(done) {
		var url  = "http://127.0.0.1:3000/validate?key="+KEY
		var invalidBody = { 
												"email":{"isEmail":"true","errorMessage":"invalid email"},
		                    "email1":{"isEmailx":"true","errorMessage":"invalid email", "value": "email@g.com"},
		                    "email2":{"isEmail":"true","errorMessage":"email2 does not exist", "value": "email@g.com"}
		                   }
		request({ gzip: true, method: 'POST', url: url, body: invalidBody, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {			
			assert.equal(data.valid, false)
			if(error) done(error)
			else done()	
		})
  })
  it('should be invalid', function(done) {
		var url  = "http://127.0.0.1:3000/validate?key="+KEY
		var invalidBody = {
            "name":       {"value": "Ali", "isAlpha": true, "isLength": {"min": 2, "max": 20}},
            "email":      {"value": "yahya@gmail.com", "isEmail": true, "errorMessage": "invalid email"},
            "password":   {"value": "password", "isLength": {"min": 8, "max": 20}, "errorMessage": "invalid password"},
            "repassword": {"value": "password", "isEqual": {"ref": "password"}, "errorMessage": "rePasword does not match password"},
            "age":        {"value": 16, "isInt": {"min": 18, "max": 99}, "errorMessage": "Age should be valid number greater than 18 years", "required": false }
          }
		request({ gzip: true, method: 'POST', url: url, body: invalidBody, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			assert.equal(data.valid, false)
			if(error) done(error)
			else done()	
		})
  })

  it('should be valid', function(done) {
		var url  = "http://127.0.0.1:3000/validate?key="+KEY
		var validBody = { 
											"email":  						{"value": "email@g.com", "isEmail":"true", 	"errorMessage":"invalid email"},
	                    "email_confirmation": {"value": "email@g.com", "isEqual":{"ref": "email"}, "errorMessage": "emails do not match"},
	                    "password":   				{"value": "k!Alk84B3swo", "isStrongPassword": true, "errorMessage": "invalid password"},
	                    "age":    						{"value": 18, "isInt":{"min": 18, "max": 99}, "errorMessage":"invalid value for age"},	                    
	                    "start_date":         {"value": "10/10/2015", "isDate": "true", "format": "MM/DD/YYYY", "errorMessage":"invalid date"},
	                    "end_date":  					{"value": "10/11/2016", "isAfter": {"ref": "start_date"}, "format": "MM/DD/YYYY", "errorMessage": "end date should be after start date"},
	                    "max_products":       {"value": 77, "isInt": "true", "isGreaterThan": 0, "match": {"pattern": "^[0-9]+$"}, "errorMessage":"max products should be valid number"},
	                    "products":           {"value": 10, "isInt": "true", "isLowerThan": {"ref": "max_products"}, "errorMessage": "products count should be lower than max products"}
		                }
		request({ gzip: true, method: 'POST', url: url, body: validBody, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			console.log(data)
			assert.equal(data.valid, true)
			if(error) done(error)
			else done()	
		})
  })  
   
  it('should return email error', function(done) {
		var url  = "http://127.0.0.1:3000/validate?key="+KEY
		var invalidBody = { 
												"email":  {"isEmail":"true", "errorMessage": "invalid email", "value": "invalidemail.com"},
		                    "age":    {"isInt":"true",	 "errorMessage": "invalid value for age", "value": 56},
		                    "email2": {"isEmail":"true", "errorMessage": "email2 does not exist", "value": "email@g.com"}
		                   }
		request({ gzip: true, method: 'POST', url: url, body: invalidBody, rejectUnhauthorized : false, json:true, headers:{"Connection": "keep-alive"}}, function(error, response, data) {
			assert.equal(data.errors.email, 'invalid email')
			if(error) done(error)
			else done()	
		})
  })  
  
})

//  curl http://localhost:3000/validate?key=key0 --data '{"inputs": {"email":{"isEmail": true, "errorMessage": "invalid email"},"email1":{"isEmail": true, "errorMessage": "invalid email"}, "email2":{"isExistingEmail": true, "errorMessage": "email2 does not exist"}}, "values":{"email": "ala@cc.com","email1":"hola@hh.com", "email2": "raxsdedexx012frhmani051122@gmailc.com"}}' --header "Content-Type: application/json" --request POST


