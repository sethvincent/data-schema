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

test('new row', function (t) {
  var row = schema.newRow()
  t.ok(row)
  t.end()
})

test('property has key, name, type, and default', function (t) {
  var property = schema.create({
    name: 'coolnumber',
    type: 'number',
    default: 3
  })

  t.ok(property)
  t.equals(property.name, 'coolnumber')
  t.equals(property.type, 'number')
  t.equals(property.default, 3)
  t.ok(property.key)
  t.end()
})

test('init schema with some properties', function (t) {
  var props = { 
    cib5i9b9n0000z7wmf1exfi7z: { 
      name: '1',
      type: 'string',
      key: 'cib5i9b9n0000z7wmf1exfi7z',
      default: null 
    },
    cib5i9b9p0001z7wme2n3kja5: { 
      name: '2',
      type: 'string',
      key: 'cib5i9b9p0001z7wme2n3kja5',
      default: 'wat'
    },
    cib5i9b9p0002z7wmqp6ttma6: { 
      name: 'test',
      type: 'string',
      key: 'cib5i9b9p0002z7wmqp6ttma6',
      default: null
    }
  }

  var newSchema = require('./index')({ properties: props })
  var savedProps = newSchema.all()
  t.equal(Object.keys(savedProps).length, 3)
  t.end()
})