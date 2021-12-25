"use strict";
const validator            = require('validator'),
      moment               = require('moment')

const validationKeywords = ['errorMessage', 
                            'required',     
                            'value',        
                            'format'        
                            ]
var myValidator = {
  isInt: function(value, params) {
    return validator.isInt(value.value.toString(), value.isInt)
  },  
  isEmail: function(value) {
    return validator.isEmail(value.value.toString())
  },
  isAlpha: function(value) {
    value = value.value.replace(/ +/, '').trim()
    return validator.isAlpha(value.toString())
  },
  isAlphanumeric: function(value) {
    return validator.isAlphanumeric(value.value.toString())
  },
  isLength: function(value) {
    return validator.isLength(value.value.toString())
  }, 
  match: function(value) {
    var regex = value.match
    if(regex.modifier) return RegExp(regex.pattern, regex.modifier).test(value.value)
    else               return RegExp(regex.pattern).test(value.value)
  },
  isEmpty: function(value) {
    if(!value.value) return true
    return validator.isEmpty(value.value.toString())
  },
  /*isNotEmpty: function(value) {
    if(!value.value) return false
    if(value.value) value.value = value.value.toString()
    else   value.value = ""
    return !validator.isEmpty(value.value)
  },*/
  includes: function(value, comparison) {
    return value.toString().includes(comparison.toString())
  },  
  isStrongPassword(value){
    //return RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})/).test(value.value)
    return RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])(?=.{8,})/).test(value.value)
  },
  isDate: function(value) {
    var format = value.format
    if(format)  return moment(value.value, format, true).isValid()
    else        return (new Date(value.value) != "Invalid Date")
  }, 
  isEqual: function(value, comparison) {
    return validator.equals(value.value.toString(), comparison.value.toString())
  },
  isGreaterThan: function(value, comparison) {
    if(value.isGreaterThan.ref){
      comparison = comparison.value
    }else{
      comparison = value.isGreaterThan
    }    
    return parseFloat(value.value) > parseFloat(comparison)
  },
  isLowerThan: function(value, comparison) {
    if(value.isLowerThan.ref){
      comparison = comparison.value
    }else{
      comparison = value.isLowerThan
    }
    return parseFloat(value.value) < parseFloat(comparison)
  },
  isAfter: function(value, comparison) {
    if(comparison){
      var valueformat       = value.format
      var comparisonformat  = comparison.format
      if(valueformat && comparisonformat){
        var a = moment(value.value, value.format, true)
        var b = moment(comparison.value, comparison.format, true)
        return a.diff(b) > 0
      }else return "missing date format"
    }else{
      var dateformat       = value.format
      if(dateformat){
        var a = moment(value.value, dateformat)
        var b = moment(value.isAfter, dateformat)
        return a.diff(b) > 0
      } return "missing date format"
    }
  },
  isBefore: function(value, comparison) {
    if(comparison){
      var valueformat       = value.format
      var comparisonformat  = comparison.format
      if(valueformat && comparisonformat){
        var a = moment(value.value, value.format)
        var b = moment(comparison.value, comparison.format)
        return a.diff(b) < 0
      }else  return "missing date format"
    }else{
      var dateformat       = value.format
      if(dateformat){
        var a = moment(value.value, dateformat)
        var b = moment(value.isBefore, dateformat)
        return a.diff(b) < 0
      } return "missing date format"
    }
  } 
}
myValidator.getAvailableValidations = Object.keys(myValidator).concat(validationKeywords)
module.exports = myValidator