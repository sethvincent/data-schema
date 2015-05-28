var validator = require('is-my-json-valid')
var isarray = require('isarray')
var extend = require('extend')
var cuid = require('cuid')

var defaultSchema = {
  title: "Tabular data properties",
  type: "array",
  items: {
    type: "object",
    properties: {}
  }
}

var propertySchema = {
  title: "Property",
  type: "object",
  properties: {}
}

module.exports = function (options) {
  options = options || { static: false }
  var staticProperties = options.static
  var schema = {
    schema: defaultSchema || options.schema
  }

  schema.create = function create (property) {
    if (staticProperties) return error()
    var key = property.key = cuid()
    if (!property.type) property.type = 'string'
    if (!property.default) property.default = null
    return this.schema.items.properties[key] = property
  }

  schema.get = function get (key) {
    if (!key) return new Error('key required')
    if (!this.schema.items.properties[key]) return new Error('property not found')
    return this.schema.items.properties[key]
  }

  schema.update = function update (property) {
    if (staticProperties) return error()
    if (!property.key) return new Error('key required')
    if (!this.schema.items.properties[property.key]) return new Error('property not found')
    var property = extend(this.schema.items.properties[property.key], property)
    return property
  }

  schema.delete = function deleteProperty (key) {
    if (!key) return new Error('key required')
    if (typeof key === 'object') key = key.key
    if (staticProperties) return error()
    delete this.schema.items.properties[key]
  }

  schema.all = function list () {
    return this.schema.items.properties
  }

  schema.validateProperty = function (key, data) {
    if (!key) return new Error('key required')
    if (!data) return new Error('object of data required')
    var validate = validator(this.schema.items.properties[key])
    return validate(data)
  }

  schema.validate = function (data) {
    if (!data) return new Error('array or object of data required')
    if (!(isarray(data))) data = [data]
    var validate = validator(schema.schema)
    return validate(data)
  }

  return schema
}

function error () {
  return new Error('properties can not be changed when static option is true')
}
