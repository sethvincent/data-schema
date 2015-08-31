var validator = require('is-my-json-valid')
var isarray = require('isarray')
var extend = require('extend')
var type = require('type-of')
var isCuid = require('is-cuid')
var cuid = require('cuid')

module.exports = DataSchema

function DataSchema (options) {
  if (!(this instanceof DataSchema)) return new DataSchema(options)
  options = options || { static: false }

  var defaultSchema = {
    title: 'Tabular data properties',
    type: 'array',
    items: {
      type: 'object',
      properties: {}
    }
  }

  this.staticProperties = options.static
  this.schema = options.schema || defaultSchema
  if (options.properties) this.addProperties(options.properties)
}

DataSchema.prototype.create = function create (property) {
  if (this.staticProperties) return error()
  var key = (property.key = property.key || cuid())
  if (!property.type) property.type = 'string'
  if (!property.default) property.default = null
  this.schema.items.properties[key] = property
  return property
}

DataSchema.prototype.get = function get (key) {
  if (!key) return new Error('key required')
  if (!this.schema.items.properties[key]) return new Error('property not found')
  return this.schema.items.properties[key]
}

DataSchema.prototype.update = function update (property) {
  if (this.staticProperties) return error()
  if (!property.key) return new Error('key required')
  if (!this.schema.items.properties[property.key]) return new Error('property not found')
  property = extend(this.schema.items.properties[property.key], property)
  return property
}

DataSchema.prototype.delete = function deleteProperty (key) {
  if (this.staticProperties) return error()
  if (!key) return new Error('key required')
  if (typeof key === 'object') key = key.key
  delete this.schema.items.properties[key]
}

DataSchema.prototype.all = function list () {
  return this.schema.items.properties
}

DataSchema.prototype.validateProperty = function (key, data) {
  if (!key) return new Error('key required')
  if (!data) return new Error('object of data required')
  var validate = validator(this.schema.items.properties[key])
  return validate(data)
}

DataSchema.prototype.validate = function (data) {
  if (!data) return new Error('array or object of data required')
  if (!(isarray(data))) data = [data]
  var validate = validator(this.schema)
  return validate(data)
}

DataSchema.prototype.addProperties = function (properties) {
  if (isarray(properties)) {
    var l = properties.length
    var i = 0

    for (i; i < l; i++) {
      this.addProperty(properties[i])
    }
  } else if (typeof properties === 'object') {
    for (var property in properties) {
      this.addProperty(properties[property])
    }
  }
}

DataSchema.prototype.addProperty = function (property) {
  var existing = this.find(property)
  if (existing) return this.update(property)
  return this.create(property)
}

DataSchema.prototype.row =
DataSchema.prototype.newRow = function newRow () {
  var row = {}
  var properties = this.all()

  for (var property in properties) {
    row[property] = properties[property].default
  }

  return row
}

DataSchema.prototype.find = function (id) {
  var all = this.all()
  var name = id.name ? id.name : id
  var propkey = id.key ? id.key : id

  for (var key in all) {
    var nameMatch = all[key].name === name
    var keyMatch = all[key].key === propkey
    if (nameMatch || keyMatch) return all[key]
  }
}

DataSchema.prototype.map = function (id, data) {
  var self = this
  var mapped = {}

  var keys = Object.keys(data)
  keys.forEach(function (key) {
    var prop = self.find(key)

    if (id === 'key') {
      if (!isCuid(key)) {
        mapped[prop['key']] = data[key]
      }
    }

    if (id === 'name') {
      if (isCuid(key)) {
        mapped[prop['name']] = data[key]
      }
    }
  })

  return mapped
}

DataSchema.prototype.format = function (data) {
  var formatted = {}
  var self = this

  var keys = Object.keys(data)
  keys.forEach(function (key) {
    var prop = self.find(key)

    if (!isCuid(key)) {
      if (!prop) {
        prop = self.inferType(key, data[key])
        self.addProperty(prop)
      }

      data[prop.key] = data[key]
      delete data[key]
    }
  })

  return extend(this.row(), data, formatted)
}

DataSchema.prototype.inferType = function (key, value) {
  var datatype = type(value)

  return {
    key: cuid(),
    name: key,
    type: [datatype, 'null'],
    default: null
  }
}

function error () {
  return new Error('properties can not be changed when static option is true')
}
