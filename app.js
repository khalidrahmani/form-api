"use strict";
/*
sudo mkdir -p /var/run/redis/
sudo chown -R redis:redis /var/run/redis
sudo systemctl restart redis
http://edwilliams.org/gccalc.htm // distance between geo coordinates lat & lon
*/
const  worldCountries     =  {"AF": "Afghanistan","AL": "Albania","DZ": "Algeria","AS":"American Samoa", "AD": "Andorra","AO": "Angola","AI": "Anguilla","AQ": "Antarctica","AG": "Antigua And Barbuda","AR": "Argentina","AM": "Armenia","AW": "Aruba","AU": "Australia","AT": "Austria","AZ": "Azerbaijan","BS": "Bahamas","BH": "Bahrain","BD": "Bangladesh","BB": "Barbados","BY": "Belarus","BE": "Belgium","BZ": "Belize","BJ": "Benin","BM": "Bermuda","BT": "Bhutan","BO": "Bolivia","BA": "Bosnia and Herzegovina","BW": "Botswana","BV": "Bouvet Island","BR": "Brazil","IO": "British Indian Ocean Territory","BN": "Brunei","BG": "Bulgaria","BF": "Burkina Faso","BI": "Burundi","KH": "Cambodia","CM": "Cameroon","CA": "Canada","CV": "Cape Verde","KY": "Cayman Islands","CF": "Central African Republic","TD": "Chad","CL": "Chile","CN": "China","CX": "Christmas Island","CC": "Cocos Islands","CO": "Colombia","KM": "Comoros","CW": "Curacao","CG": "Republic Of The Congo","CD": "Democratic Republic Of The Congo","CK": "Cook Islands","CR": "Costa Rica","CI": "Ivory Coast","HR": "Croatia","CU": "Cuba","CY": "Cyprus","CZ": "Czech Republic","DK": "Denmark","DJ": "Djibouti","DM": "Dominica","DO": "Dominican Republic","TP": "East Timor","EC": "Ecuador","EG": "Egypt","SV": "El Salvador","GQ": "Equatorial Guinea","ER": "Eritrea","EE": "Estonia","ET": "Ethiopia","XA": "External Territories of Australia","FK": "Falkland Islands","FO": "Faroe Islands","FJ": "Fiji","FI": "Finland","FR": "France","GF": "French Guiana","PF": "French Polynesia","TF": "French Southern Territories","GA": "Gabon","GM": "Gambia","GE": "Georgia","DE": "Germany","GH": "Ghana","GI": "Gibraltar","GR": "Greece","GL": "Greenland","GD": "Grenada","GP": "Guadeloupe","GU": "Guam","GT": "Guatemala","XU": "Guernsey and Alderney","GN": "Guinea","GW": "Guinea-Bissau","GY": "Guyana","HT": "Haiti","HM": "Heard and McDonald Islands","HN": "Honduras","HK": "Hong Kong","HU": "Hungary","IS": "Iceland","IN": "India","ID": "Indonesia","IR": "Iran","IQ": "Iraq","IE": "Ireland","IT": "Italy","JM": "Jamaica","JP": "Japan","XJ": "Jersey","JO": "Jordan","KZ": "Kazakhstan","KE": "Kenya","KI": "Kiribati","KP": "North Korea","KR": "South Korea",  "XK": "Kosovo", "KW": "Kuwait","KG": "Kyrgyzstan","LA": "Laos","LV": "Latvia","LB": "Lebanon","LS": "Lesotho","LR": "Liberia","LY": "Libya","LI": "Liechtenstein","LT": "Lithuania","LU": "Luxembourg","MO": "Macao","MK": "Macedonia","MG": "Madagascar","MW": "Malawi","MY": "Malaysia","MV": "Maldives","ML": "Mali","MT": "Malta","XM": "Isle of Man","MH": "Marshall Islands","MQ": "Martinique","MR": "Mauritania","MU": "Mauritius","YT": "Mayotte","MX": "Mexico","FM": "Micronesia","MD": "Moldova","MC": "Monaco","MN": "Mongolia","ME": "Montenegro" ,  "MS": "Montserrat","MA": "Morocco","MZ": "Mozambique","MM": "Myanmar","NA": "Namibia","NR": "Nauru","NP": "Nepal","NL": "Netherlands","NC": "New Caledonia","NZ": "New Zealand","NI": "Nicaragua","NE": "Niger","NG": "Nigeria","NU": "Niue","NF": "Norfolk Island","MP": "Northern Mariana Islands","NO": "Norway","OM": "Oman","PK": "Pakistan","PW": "Palau","PS": "Palestinian Territory","PA": "Panama","PG": "Papua new Guinea","PY": "Paraguay","PE": "Peru","PH": "Philippines","PN": "Pitcairn","PL": "Poland","PT": "Portugal","PR": "Puerto Rico","QA": "Qatar","RE": "Reunion","RO": "Romania","RU": "Russia","RW": "Rwanda","SH": "Saint Helena","KN": "Saint Kitts And Nevis","LC": "Saint Lucia","PM": "Saint Pierre and Miquelon","VC": "Saint Vincent And The Grenadines","WS": "Samoa",     "BL": "Saint Barthelemy",  "MF": "Saint Martin",  "SM": "San Marino","ST": "Sao Tome and Principe","SA": "Saudi Arabia","SN": "Senegal","RS": "Serbia","SC": "Seychelles","SL": "Sierra Leone","SG": "Singapore","SK": "Slovakia","SI": "Slovenia","XG": "Smaller Territories of the UK","SB": "Solomon Islands","SO": "Somalia","ZA": "South Africa","GS": "South Georgia","SS": "South Sudan","ES": "Spain","LK": "Sri Lanka","SD": "Sudan","SR": "Suriname","SJ": "Svalbard and Jan Mayen","SZ": "Swaziland","SE": "Sweden","CH": "Switzerland","SY": "Syria","TW": "Taiwan","TJ": "Tajikistan","TZ": "Tanzania","TH": "Thailand","TG": "Togo","TK": "Tokelau","TO": "Tonga","TT": "Trinidad And Tobago","TN": "Tunisia","TR": "Turkey","TM": "Turkmenistan","TC": "Turks And Caicos Islands","TV": "Tuvalu","UG": "Uganda","UA": "Ukraine","AE": "United Arab Emirates","GB": "United Kingdom","US": "United States","UM": "United States Minor Outlying Islands","UY": "Uruguay","UZ": "Uzbekistan","VU": "Vanuatu","VA": "Vatican","VE": "Venezuela","VN": "Vietnam","VG": "British Virgin Islands","VI": "U.S. Virgin Islands","WF": "Wallis And Futuna","EH": "Western Sahara","YE": "Yemen","YU": "Yugoslavia","ZM": "Zambia","ZW": "Zimbabwe"}
      ,ADMIN_KEY          = "ew5XjmBTOCiOf6uzF0rcBZ7mDQ84CEmQkEg"
      ,ONE_DAY            = 60*60*24
      ,ONE_MONTH          = ONE_DAY*30 // 60*60*24*5 = 5 days 
      ,plansRates         = [1000, 500000, 2000000, 8000000]
      ,plans              = [
          {index: 0, price: 0,   keyValRate: 5,    rate: plansRates[0],  designation: "Free",      description: plansRates[0]+" Credits per month."},
          {index: 1, price: 6.9, keyValRate: 500,  rate: plansRates[1],  designation: "Basic",     description: plansRates[1]+" Credits per month."},
          {index: 2, price: 25,  keyValRate: 2000, rate: plansRates[2],  designation: "Premium",   description: plansRates[2]+" Credits per month."},
          {index: 3, price: 75,  keyValRate: 2000, rate: plansRates[3],  designation: "Xtra",      description: plansRates[3]+" Credits per month."}
      ]
      ,restify              = require('restify')
      ,restifyErrors        = require('restify-errors')
      ,myValidator          = require('./modules/myValidator.js')
      ,availableValidations = myValidator.getAvailableValidations
      ,fs                   = require('fs')
      ,parseFullName        = require('parse-full-name').parseFullName
      ,titleize             = require('titleize')
      ,slugify              = require('slugify')
      ,getGender            = fs.readFileSync('./lua/getGender.lua')
      ,FastRedis            = require('redis-fast-driver') // sudo systemctl start redis
      ,FastClient           = new FastRedis({
                                    //host: '127.0.0.1',    
                                    host: '/var/run/redis/redis-server.sock', 
                                    maxRetries:   10, 
                                    autoConnect:  true
                                  })
      ,server               = restify.createServer({name: 'formApi', version: '1.0.0'})
      ,THROTTLE_RATE        = (process.env.NODE_ENV == "production") ? 5 : 20     

// REDIS keys : g:x => gender, k:x => key, r:x => ratelimit


slugify.extend({';': ADMIN_KEY})

const arabic = /[\u0600-\u06FF]/;

function _slugify(str) {
  if(arabic.test(str)) {
    var res  = []
    var str = str.split(";")
    for (var i = 0; i < str.length; i++) {
      var s = str[i]
      if (arabic.test(s)) res.push(s.replace(/[^\ابتثجحخدذرزسشصضطظعغفقكلمنهويءةأإآٱىئؤ\s]/gi, ''))
      else                res.push(slugify(s))
    }
    return res.join(ADMIN_KEY)
  }     
  else return slugify(str)  
}
function redisHashToJsonObject(hash) {
  var obj    = {}
  for (var i = 0; i < hash.length; i+=2) {
    obj[hash[i]] = hash[i+1]
  }  
  return obj
}

function redisHashToJsonObjectLevel2(hash) {
  var obj    = []
  for (var i = 0; i < hash.length; i+=2) {
    obj.push({level2area: hash[i], cities: hash[i+1].split(',')}) //obj[hash[i]] = hash[i+1].split()
  }  
  return obj
}

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())
server.use(restify.plugins.throttle({burst: THROTTLE_RATE, rate: THROTTLE_RATE, ip: true})) // burst: max concurent requests; rate: number of req/sec -- tokensTable with redis for multiple clusters implementation

server.pre((req, res, next) => { 
  if(req.headers.origin) { res.header("Access-Control-Allow-Origin", "*") }
  next()
})

server.use((req, res, next) => {
  var key = req.query.key
  if(!key){
    return next(new restifyErrors.UnauthorizedError("API key missing"))
  } else {
    if(key == ADMIN_KEY){
      return next()
    } else {
      FastClient.rawCall(['GET', 'k:'+key], (err, planIndex) => {
        if(planIndex){  
          res.planIndex = planIndex;                  req.apiType = 'validate'
          if(req.url.includes('/credits?'))           req.apiType = 'credits'
          else if(req.url.includes('/geo/'))          req.apiType = 'geo'
          else if(req.url.includes('/gender/'))       req.apiType = 'gender'
            else if(req.url.includes('/key-val/'))    req.apiType = 'key-val'
          if(req.apiType == 'key-val' || req.apiType == 'credits' ||(planIndex != 0 && req.apiType == 'validate')){    // validation is free for paying plans
            res.freecall = true
            return next()
          }else{
            rateLimit(key, planIndex, (err) => {
              if (err == true) {
                return next(new restifyErrors.UnauthorizedError('Reached API Limit!'))
              }
              else {
                return next()
              }
            })            
          }            
        }
        else {return next(new restifyErrors.UnauthorizedError('Invalid Key!'))}
      })
    }
  }
})

function rateLimit(key, planIndex, cb) {
  FastClient.rawCall(['INCR', 'r:' + key], function(err, count) {
    if(count == 1){
      FastClient.rawCall(['TTL', 'k:'+key], function(err, ttl) { 
        ttl = ttl - parseInt(ttl/ONE_MONTH) * ONE_MONTH
        FastClient.rawCall(['EXPIRE', 'r:'+key, ttl], function(err, time) { 
          cb(count > plansRates[planIndex])
        })
      })
    } else cb(count > plansRates[planIndex])
  })
}
// COMODO confirmation
server.get('/.well-known/pki-validation/66A8FEA5D697F6AA36B258E06EFFD65A.txt', function(req, res, next) {
  res.setHeader('content-type', 'text/plain');
  res.send('A1E78AA2A02CBC9BC69487AD1C621AEDA1EB0233CA7FF5B1410E82F73E97FB93\ncomodoca.com');
  return next();
});


server.get('/credits', (req, res, next) => {
  FastClient.rawCall(['GET', 'r:' + req.query.key], function(err, count) {
    var c = plansRates[res.planIndex] - count
    if(c<0) c = 0
    res.send(200, {remaining_credits: c})
    next()  
  })
})
// http://127.0.0.1:3000/admin/extendkeyexpiration?key=ew5XjmBTOCiOf6uzF0rcBZ7mDQ84CEmQkEg&apiKey=0VTkr879A5HIHLF9jeA&plan=4
server.get('/admin/extendkeyexpiration', (req, res, next) => {  
  if(req.query.key == ADMIN_KEY) {
    FastClient.rawCall(['TTL', 'r:'+req.query.apiKey], function(err, rateTTL) { 
      if(rateTTL == -2) FastClient.rawCall(['SETEX', 'r:'+req.query.apiKey, ONE_MONTH, 0])
      FastClient.rawCall(['TTL', 'k:'+req.query.apiKey], function(err, keyTTL) { 
        if (keyTTL == -2) keyTTL = 0
        var ttl
        if(req.query.plan == 0) ttl = ONE_MONTH * 3                + keyTTL // expires in 3 months for free plan, need to generate new one after that.
        else                    ttl = ONE_MONTH * req.query.months + keyTTL
        FastClient.rawCall(['SETEX', 'k:'+req.query.apiKey, ttl, req.query.plan], function(err, result) {
          res.send(200, {timeToextendInseconds: ttl, status: 'updated'})
          return next()
        })
      })
    })  
  } else {
    return next(new restifyErrors.UnauthorizedError('Invalid Key!'))
  }
})

server.get('/admin/updateplan', (req, res, next) => {
  if(req.query.key == ADMIN_KEY) {
    FastClient.rawCall(['GET', 'k:'+req.query.apiKey], function(err, oldPlan) {
      if(!oldPlan || oldPlan == 0) {
        FastClient.rawCall(['SETEX', 'r:' + req.query.apiKey, ONE_MONTH, 0], function(err, count) {
          FastClient.rawCall(['SETEX', 'k:'+ req.query.apiKey, ONE_MONTH, req.query.plan], function(err, result) {
            res.send(200, {timeToextendInseconds: ONE_MONTH, status: 'updated'})
            return next()
          })
        })
      } else {
      FastClient.rawCall(['TTL', 'r:'+req.query.apiKey], function(err, rateTTL) {
        if(rateTTL == -2) FastClient.rawCall(['SETEX', 'r:'+req.query.apiKey, ONE_MONTH, 0])
        FastClient.rawCall(['TTL', 'k:'+req.query.apiKey], function(err, keyTTL) {
          if(keyTTL == -2) keyTTL = 0 
          var remainingSecondsForNewPlan = keyTTL*plans[oldPlan].rate/plans[req.query.plan].rate
          var timeToextendInseconds      = parseInt(ONE_MONTH+remainingSecondsForNewPlan)
          FastClient.rawCall(['SETEX', 'k:'+req.query.apiKey, timeToextendInseconds, req.query.plan], function(err, result) {
            res.send(200, {timeToextendInseconds: timeToextendInseconds, status: 'updated'})
            return next()
          })
          })
        })
      }
    })
  } else {
    return next(new restifyErrors.UnauthorizedError('Get out!'))
  }
})

server.post('/admin/resetkey', (req, res, next) => {
  if(req.query.key == ADMIN_KEY){
    FastClient.rawCall(['GET', 'k:'+req.body.oldKey], function(err, key) {
      if(key){
        FastClient.rawCall(['RENAME', req.body.oldKey+':validate', req.body.newKey+':validate'], function(err, result) {  // store historic api calls
          FastClient.rawCall(['RENAME', req.body.oldKey+':geo', req.body.newKey+':geo'], function(err, result) {  // store historic api calls
            FastClient.rawCall(['RENAME', req.body.oldKey+':gender', req.body.newKey+':gender'], function(err, result) {  // store historic api calls
              FastClient.rawCall(['RENAME', 'r:'+req.body.oldKey, 'r:'+req.body.newKey], function(err, result) {  
                FastClient.rawCall(['RENAME', 'k:'+req.body.oldKey, 'k:'+req.body.newKey], function(err, result) {
                  FastClient.rawCall(['RENAME', 'kv:'+req.body.oldKey, 'kv:'+req.body.newKey], function(err, result) {
                    res.send(200, result)  
                    return next() 
                  })
                })
              })
            })
          })
        })
      } else {
        res.send(200, {status: 'ok'}) 
        return next()
      }
    })
  } else {
    return next(new restifyErrors.UnauthorizedError('Invalid Key!'))
  }
})

server.post('/admin/setgender', (req, res, next) => {  
  FastClient.rawCall(['SET', req.body.name.toLowerCase()+":g", req.body.gender], function(err, unknownNames) {  
    res.send(200, {status: 'Ok'})  
    return next()
  })
})

server.get('/admin/getunknownnames', (req, res, next) => {  
  FastClient.rawCall(['SPOP', 'unknownNames', 10], function(err, unknownNames) {  
    res.send(200, unknownNames)  
    return next()     
  })
})

server.get('/admin/getremainingcreditsandkeysexpirationdates', (req, res, next) => {  
  if(req.query.key == ADMIN_KEY){
    console.log(req.query)
    getKeysTTL(req.query, function (err, ratelimit_ttl, key_ttl) {
      if (!err) {
        FastClient.rawCall(['GET', 'r:'+req.query.apiKey], function(err, consumedCredits) {  
          res.send(200, {consumedCredits: consumedCredits, planCredits: plans[req.query.plan].rate, ratelimit_ttl: ratelimit_ttl, key_ttl: key_ttl})  
          return next() 
        })
      }else {
        return next(new restifyErrors.UnauthorizedError('Invalid Key!'))
      }
    })
  } else {
    return next(new restifyErrors.UnauthorizedError('Invalid Key!'))
  }
})

function getKeysTTL(q, cb) {
  FastClient.rawCall(['TTL', 'k:'+q.apiKey], function(err, key_ttl) { 
    if(key_ttl == -2) {
      if(q.plan == 0){
        FastClient.rawCall(['SETEX', 'r:' + q.apiKey, 3*ONE_MONTH, 0], function(err, count) {
          FastClient.rawCall(['SETEX', 'k:'+ q.apiKey, 3*ONE_MONTH, 0], function(err, result) {
            cb(null, 3*ONE_MONTH, 3*ONE_MONTH) 
          })
        })
      }else{
        cb("not found")  
      }    
    }
    else{
      FastClient.rawCall(['TTL', 'r:'+q.apiKey], function(err, ratelimit_ttl) { 
        if (ratelimit_ttl == -2) {
          var new_ratelimit_ttl = key_ttl - parseInt(key_ttl/ONE_MONTH) * ONE_MONTH
          FastClient.rawCall(['SETEX', 'r:'+q.apiKey, new_ratelimit_ttl, 0], function(err, result) {
            cb(null, new_ratelimit_ttl, key_ttl)  
          })
        }else{
          cb(null, ratelimit_ttl, key_ttl)  
        }
      })
    }
  })
}

server.on('after', function (req, res, route, error) {
  if(req.query.key != ADMIN_KEY && res.freecall != true && res.credits_used && res.credits_used != 1 ){
    //console.log("on after, credits used: ", res.credits_used -1)
    FastClient.rawCall(['INCRBY', 'r:'+req.query.key, res.credits_used - 1])
  }
  if(req.apiType){
    var today  = req.date().getFullYear()+'-'+(req.date().getMonth()+1)//+'-'+req._date.getDate() // 2018-10-26T09:36:11.415Z
    FastClient.rawCall(['HINCRBY', req.query.key+':'+req.apiType, today, 1])
  }
})

// curl http://localhost:3000/validate?key=soa2dzh50pxdwy8936d --data '{"inputs": {"email":{"isEmail": true, "errorMessage": "invalid email"}, "email2":{"isEmail": true, "errorMessage": "invalid email2"}}, "values":{"email": "ala@cc.com", "email2": "alacc.com"}}' --header "Content-Type: application/json" --request POST
server.on('restifyError', function (req, res, err, cb) {
  err.toJSON = function toJSON() {return {message:  err.body.message, error: err.body.code, status: "Error "+err.statusCode}}
  return cb()
})

server.post('/validate', (req, res, next) => {
  var errors = {}
  var inputs = req.body
  if(! inputs){
    return next(new restifyErrors.MissingParameterError('missing validation object'))
  }else{
    for (var input in inputs) {
      for (var key in inputs[input]) {
        if(!availableValidations.includes(key))  errors[input] = 'unknown validator '+ key
      }
      if(!inputs[input].hasOwnProperty('value')){
        errors[input] = "missing value for input"
      }else{
        if(inputs[input].required != "false" || (inputs[input].required == "false" && !myValidator.isEmpty(inputs[input].value)) ){   
          for (var validationName in inputs[input]) {
            var validationParam = inputs[input][validationName]
            if (!["errorMessage", "required", "value", "format"].includes(validationName) && !errors[input]) {                     
              res.credits_used = res.credits_used || 0
              res.credits_used++
              if(validationParam == "true") var valid = myValidator[validationName](inputs[input])
              else{
                if(validationParam.constructor == Object && validationParam.ref){                  
                  var valid = myValidator[validationName](inputs[input], inputs[validationParam.ref])
                }
                else {                  
                  var valid = myValidator[validationName](inputs[input])
                } 
              }        
              if(valid == false){
                errors[input] = inputs[input].errorMessage || "invalid value for "+input
              }else if(valid != true){
                errors[input] = valid // error message
              }
            }
          }
        }
      }
    }
    if(!Object.keys(errors).length) {res.send(200, {status: 'Ok', valid: true, body: inputs}) }
    else                            {res.send(200, {status: 'Ok', valid: false, errors: errors, body: inputs}) }
    return next()      
  }
})

function getFirstLast(name) {
  var nameParts = name.split(" ")
  if(nameParts.length > 1){
    if (name.includes('bd ')) {
      name    = name.replace('bd ', 'bdx')
      var v   = parseFullName(name)
      v.first = v.first.replace('bdx', 'bd ')
      return v
    }
    else return parseFullName(name)
  }else{
    return {first: name, last: ""}
  }
}
// curl http://localhost:3000/key-val/set?key=soa2dzh50pxdwy8936d --data '{"key": "name", "value": "khalid"}' --header "Content-Type: application/json" --request POST
server.post('/key-val/set', (req, res, next) => {  // Key Value Storage 
  var key    = req.query.key
  var _key   = req.body.stored_key
  var _val   = req.body.value
  if(!_key || ! _val){
    return next(new restifyErrors.MissingParameterError('stored_key or value is missing'))
  }else{    
    if(_key.length>20 || _val.length>100) return next(new restifyErrors.RequestEntityTooLargeError('maximum key size is 20 characters, and maximum value size is 100 characters'))
    else {
      FastClient.rawCall(['HLEN', 'kv:'+key], (err, length) => {  
        console.log(length)
        if(length >= plans[res.planIndex].keyValRate)  return next(new restifyErrors.InsufficientStorageError('maximum keys allowed is: '+ plans[res.planIndex].keyValRate)) 
        else{
          FastClient.rawCall(['HSET', 'kv:'+key, _key, _val], (err, results) => {  
            res.send(200, {status: 'Ok Saved'}) 
            return next()                        
          })          
        }
      })
    }
  }
})
// curl "http://localhost:3000/key-val/get?key=soa2dzh50pxdwy8936d&stored_key=name"
server.get('/key-val/get', (req, res, next) => {  
  var key          = req.query.key
  var stored_key   = req.query.stored_key
  if(!stored_key){
    return next(new restifyErrors.MissingParameterError('stored_key param is missing'))
  }else{     
    FastClient.rawCall(['HGET', 'kv:'+key, stored_key], (err, value) => {  
      res.send(200, {status: 'Ok', stored_key: stored_key, value: value}) 
      return next()                        
    })     
  }
})

server.get('/gender/get', (req, res, next) => {  // Masculin if contains "abd"
  if(!req.query.name){
    return next(new restifyErrors.MissingParameterError('name not set'))
  }else{
    var originalNamesArray = req.query.name.split(';')
    if(originalNamesArray.length > 100) {
      return next(new restifyErrors.RequestEntityTooLargeError('maximum list of names is 100'))
    }else{
      var sanitizedNames       = req.query.name.replace(/[0-9]/g, '').replace(/\s\s+/g, ' ').replace(/ +;/g, ';').replace(/; +/g, ';').trim()
      var sanitizedNamesArray  = sanitizedNames.split(';').map(x => titleize(x))
      if(req.query.type == "full_name"){ 
        var nameData              = sanitizedNames.split(';').map(x => getFirstLast(x))
        var queriedNamesArray     = nameData.map(x => _slugify(x.first).toLowerCase())        
      }else{       
        var queriedNamesArray     = _slugify(sanitizedNames.toLowerCase()).split(ADMIN_KEY)
      }
      console.log(queriedNamesArray)
      var command     = ['eval', getGender, queriedNamesArray.length].concat(queriedNamesArray).concat([req.query.key, queriedNamesArray.length]).concat(originalNamesArray).concat(sanitizedNamesArray) // type either full_name or first_name default first_name
      FastClient.rawCall(command, (err, results) => {  
        var r     = JSON.parse(results)  
        var _r    = {}
        var index = 0          
        Object.keys(r).forEach(function(key) {
          _r[r[key].name] = r[key].data
          if(req.query.type == "full_name" && r[key].name){
            if(_r[r[key].name].validated_name) delete _r[r[key].name].validated_name //_r[r[key].name].validated_name = titleize(nameData[index].first)
            if(nameData[index].title) _r[r[key].name].title                   = titleize(nameData[index].title)
            _r[r[key].name].first_name                                        = titleize(nameData[index].first)
            if(nameData[index].middle) _r[r[key].name].middle_name            = titleize(nameData[index].middle)
            if(nameData[index].last)   _r[r[key].name].last_name              = titleize(nameData[index].last)
            index++
          }
        })        
        res.send(200, {status: 'Ok', credits_used: r.credits_used, results: _r}) 
        return next()
      })            
    }
  }  
})

server.get('/geo/country/states', (req, res, next) => { // curl "http://127.0.0.1:3000/geo/country/states?key=soa2dzh50pxdwy8936d&country=us"
  if(!req.query.hasOwnProperty('country')){
    return next(new restifyErrors.MissingParameterError('country not set'))
  }else{
    var country    = req.query.country.toUpperCase()
    FastClient.rawCall(['GET', country+':states'], (err, value) => {
      if(value){ 
        var result = []
        value = JSON.parse(value)
        for (var key in value) {
          result.push({state_id: key, state: value[key]})
        }
        res.send(200, {status: 'Ok', country: country, states: result})
        return next()
      }
      else      return next(new restifyErrors.NotFoundError('states not found for country: '+ country))
    })    
  }  
})

server.get('/geo/country/state/cities', (req, res, next) => {   // curl "http://127.0.0.1:3000/geo/country/state/cities?key=soa2dzh50pxdwy8936d&country=us&state=NY"
  if(!req.query.hasOwnProperty('country') || !req.query.hasOwnProperty('state') ){
    return next(new restifyErrors.MissingParameterError('missing country or state'))
  }else{
    var country   = req.query.country.toUpperCase()
    var state     = req.query.state.toUpperCase()
    //console.log(country+':'+state)
    FastClient.rawCall(['GET', country+':'+state], (err, value) => {
      //console.log(value)
      if(value) {
        value = value.split(',')
        var result = []
        for (var i = 0; i < value.length; i++) {
          var d = {city_id: i+1, city: value[i]}
          result.push(d)
        }
        value = {status: 'Ok', country: country, state_code: state, cities: result}
        res.send(200, value)  
        return next()
      }else return next(new restifyErrors.NotFoundError('cities not found for country: '+ country+ ', state: ' +state))  
    })
  }
})

/*
  curl "http://127.0.0.1:3000/geo/country/state/city/zips?key=soa2dzh50pxdwy8936d&country=us&state=NY&city=New+York"
  params :
  country_code: string
  state_code:   string
  city_code:    string
*/

server.get('/geo/country/state/city/zips', (req, res, next) => {
  if(!req.query.hasOwnProperty('country') || !req.query.hasOwnProperty('state') || !req.query.hasOwnProperty('city') ){
    return next(new restifyErrors.MissingParameterError('missing country, state or zip'))
  }else{
    var country  = req.query.country.toUpperCase()
    var state    = req.query.state.toUpperCase()
    var city     = req.query.city
    FastClient.rawCall(['HMGET', country+':'+state+':z', city], (err, value) => {
      //console.log(value)
      if(value && value[0]) {
        value = {status: 'Ok', country: country, state: state, city: city, zip_codes: value[0].split(',').sort()}
        res.send(200, value)   
        return next()
      }else return next(new restifyErrors.NotFoundError('zip codes not found for country: '+ country+ ', state: ' +state+', city: '+city))       
    })
  }  
})

const zipIndexesLengths = {"FR": 2, "US": 2, "CA": 3, "IN": 2, "UK": 5, "DE": 2}
const zipDataStructures = {
                            "DE": ["state", "level2area", "city"], 
                            "FR": ["state", "level2area", "city"], 
                            "US": ["state", "level2area", "city"], 
                            "CA": ["state", "city"], 
                            "IN": ["state", "level2area", "city", "level4area"], 
                            "UK": ["level1area", "state", "city", "level4area"]
                          }
server.get('/geo/country/zip', (req, res, next) => { // curl "http://127.0.0.1:3000/geo/zipinfo?key=soa2dzh50pxdwy8936d&country=us&zipcode=99605"
  if(!req.query.hasOwnProperty('country') || !req.query.hasOwnProperty('zipcode')){
    return next(new restifyErrors.MissingParameterError('missing country or zipcode'))
  }else{
    var country           = req.query.country.toUpperCase()    
    var zipcode           = req.query.zipcode
    var zipIndexesLength  = zipIndexesLengths[country]
    var zipDataStructure  = zipDataStructures[country]
    FastClient.rawCall(['HMGET', country+':'+zipcode.substr(0, zipIndexesLength), zipcode.substr( zipIndexesLength)], (err, value) => {
      if(value && value[0] != null) {
        value = value[0].split(':')
        var result = {}
        for(var i in zipDataStructure){
          value[i] = value[i].includes(',') ? value[i].split(',') : value[i]
          result[zipDataStructure[i]] = value[i]
        }  
        result = {status: 'Ok', country: country, zip: zipcode, result: result}      
      }else var result = {error: 'DataNotFoundError', message: 'zip code '+zipcode+' not found for country '+country, status: 'Error 509'}       
      res.send(200, result)    
    })
  }
  return next()
})

// curl "http://127.0.0.1:3000/api/worldcountries?key=key1"
server.get('/geo/worldcountries', function (req, res, next) {    
  res.send(200, {status: 'Ok', countries: worldCountries})  
  return next()
})
server.get('/geo/supportedcountries', function (req, res, next) {
  res.send(200, {supportedcountries: ["US", "CA", "IN", "FR", "UK"]})
  return next()
})
server.listen(3000, function () {
  console.log('%s listening at %s', server.name, server.url)
})

/*
server.get('/geo/country/state/level2area', (req, res, next) => { // curl "http://127.0.0.1:3000/geo/country/state/level2area?key=soa2dzh50pxdwy8936d&country=us&state=NY"
  if(!req.query.hasOwnProperty('country') || !req.query.hasOwnProperty('state')){
    return next(new restifyErrors.MissingParameterError('missing country or state'))
  }else{
    var country    = req.query.country.toUpperCase()
    var state      = req.query.state.toUpperCase()
    FastClient.rawCall(['GET', country+':'+state+':l2'], (err, value) => {
      if(value) {
        value = value.split(',')
        var result = []
        for (var i = 0; i < value.length; i++) {
          var d = {id: i+1, level2area: value[i]}
          result.push(d)
        }
        value = {status: 'Ok', country: country, state_code: state, level2areas: result}
        res.send(200, value)  
        return next()
      }else return next(new restifyErrors.NotFoundError('level2area not found for country: '+ country+ ' and state: ' +state))  
    })
  }
})
*/
/*
server.get('/geo/country/state/level2area/cities', (req, res, next) => { // curl "http://127.0.0.1:3000/geo/country/state/level2area?key=soa2dzh50pxdwy8936d&country=us&state=NY"
  if(!req.query.hasOwnProperty('country') || !req.query.hasOwnProperty('state')){
    return next(new restifyErrors.MissingParameterError('missing country or state'))
  }else{
    var country    = req.query.country.toUpperCase()
    var state      = req.query.state.toUpperCase()
    var lvl2       = req.query.level2area.toUpperCase()
    FastClient.rawCall(['HMGET', country+':'+state+':l2c', lvl2], (err, value) => {
      if(value && value[0]) {
        value = {status: 'Ok', country: country, state_code: state, level2area: lvl2, cities: value[0].split(',')}
        res.send(200, value)  
        return next()
      }else return next(new restifyErrors.NotFoundError('cities not found for country: '+ country+ ' and state: ' +state+' and level2area: '+lvl2))  
    })
  }
})
server.get('/geo/country/state/city/level4area', (req, res, next) => { // curl "http://127.0.0.1:3000/geo/country/state/level2area?key=soa2dzh50pxdwy8936d&country=us&state=NY"
  if(!req.query.hasOwnProperty('country')){
    return next(new restifyErrors.MissingParameterError('Missing country'))
  }else{
    var country    = req.query.country.toUpperCase()
    var state      = req.query.state.toUpperCase()
    var city       = req.query.city
    FastClient.rawCall(['HMGET', country+':'+state+':lvl4', city], (err, value) => {
      if(value && value[0]) value = {country: country, state: state, city: city, level4area: value[0].split(',')}
      else      value = {err: 'ressource not found.'}
      res.send(200, value)
    })
  }
  return next()
})
*/
/*
server.get('/geo/country/state/zips', (req, res, next) => { // curl "http://127.0.0.1:3000/geo/country/state/zips?key=soa2dzh50pxdwy8936d&country=us&state=NY"
  if(!req.query.hasOwnProperty('country') || !req.query.hasOwnProperty('state') ){
    return next(new restifyErrors.MissingParameterError('missing country or state'))
  }else{
    var country  = req.query.country.toUpperCase()
    var state    = req.query.state.toUpperCase()    
    FastClient.rawCall(['HGETALL', country+':'+state], (err, value) => {
      if(value && value.length>0) {
        var zips = []
        for (var i = 0; i < value.length; i+=2) {
          zips = zips.concat(value[i+1].split(','))
        }
        value = {status: 'Ok', country: country, state: state, zips: zips.sort()}
      }else value = {message: 'zip codes not found for country: '+ country+ ' and state: ' +state, error: 'DataNotFoundError', status: 'Error 509' } 
      res.send(200, value)
    })
  }
  return next()
})
*/

/*
server.get('/admin/addwebsite', (req, res, next) => {  
  if(req.query.key == ADMIN_KEY){  
    console.log(req.query)
    FastClient.rawCall(['SET', 'origin:'+req.query.websiteandwebKey, req.query.userKey], function(err, planIndex) {        
      res.send(200, {result: planIndex})  
      return next()     
    })
  } else {
    return next(new restifyErrors.UnauthorizedError('Invalid Key!'))
  }
})

server.post('/admin/deletewebsite', (req, res, next) => {  
  if(req.query.key == ADMIN_KEY){  
    FastClient.rawCall(['DEL', 'origin:'+req.body.websiteandwebKey], function(err, planIndex) {        
      res.send(200, {result: planIndex})  
      return next()     
    })
  } else {
    return next(new restifyErrors.UnauthorizedError('Invalid Key!'))
  }
})
*/

/*


server.use((req, res, next) => {
  if(req.query.key == ADMIN_KEY){
    return next()
  } else {
    getKeyFromRequest(req, (err, key) => {
      if(!key){
        return next(new restifyErrors.UnauthorizedError(err))
      } else {
        FastClient.rawCall(['GET', 'k:'+key], (err, planIndex) => {
          if(planIndex){  
            res.planIndex = planIndex;                  req.apiType = 'validate'
            if(req.url.includes('/credits?'))           req.apiType = 'credits'
            else if(req.url.includes('/geo/'))          req.apiType = 'geo'
            else if(req.url.includes('/gender/'))       req.apiType = 'gender'
            if(req.apiType == 'credits' ||(planIndex != 0 && req.apiType == 'validate')){    // validation is free for paying plans
              res.freecall = true
              return next()
            }else{
              rateLimit(key, planIndex, (err) => {
                if (err == true) {
                  return next(new restifyErrors.UnauthorizedError('Reached API Limit!'))
                }
                else {
                  return next()
                }
              })            
            }            
          }
          else {return next(new restifyErrors.UnauthorizedError('Invalid Key!'))}
        })
      }
    })
  }
})

function getKeyFromRequest(req, cb) {
  if(req.query.key) cb(null, req.query.key)
  else              cb('No API key supplied!', null)
}


function getKeyFromRequest(req, cb) {
  if(req.query.key){
    if(req.headers.origin){
      console.log('origin:'+req.headers.origin+'::'+req.query.key)
      FastClient.rawCall(['GET', 'origin:'+req.headers.origin+'::'+req.query.key], (err, key) => { // key here is webkey linked to the origin website
        
        if (!key) cb('You need to add website and put key param in query', null)
        else      cb(null, key)
      })
    }else cb(null, req.query.key)
  }else cb('No API key supplied!', null)
}
*/