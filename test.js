var test = require('tape')
var schema = require('./index')()

test('create a property', function (t) {
  var property = schema.create({
    name: '1',
    type: 'string'
  })
  
  t.ok(property.key)
  t.equals(property.default, null)
  t.end()
})

test('get property', function (t) {
  var property = schema.create({
    name: '2',
    type: 'string'
  })

  var retrieved = schema.get(property.key)
  t.deepEquals(retrieved, property)
  t.end()
})

test('update property', function (t) {
  var property = schema.create({
    name: '3',
    type: 'string'
  })

  property.name = 'test'
  var updated = schema.update(property)
  t.equals(updated.name, 'test')
  t.end()
})

test('delete property', function (t) {
  var property = schema.create({
    name: '4',
    type: 'string'
  })

  schema.delete(property)
  var error = schema.get(property.key)
  t.ok(error.message)
  t.equals(error.message, 'property not found')
  t.end()
})

test('all properties', function (t) {
  var properties = schema.all()
  t.ok(properties)
  var count = 0
  for (var property in properties) count++
  t.equals(count, 3)
  t.end()
})

test('validate property', function (t) {
  var property = schema.create({
    name: 'validatethis',
    type: 'string'
  })

  var validated = schema.validateProperty(property.key, 'this is a string')
  t.ok(validated)
  t.end()
})

test('validate array of data', function (t) {
  var data = [
    {
      1: 'string',
      2: 'string',
      'test': 'string',
      'validatethis': 'string'
    }
  ]

  var validated = schema.validate(data)
  t.ok(validated)
  t.end()
})