# data-schema

Defines & manages the properties – the columns – of tabular data using json-schema

## install

```
npm i --save data-schema
```

## properties format

Properties are stored in this format:

```
{
  'unique key': {
    type: 'type of the property. string, integer, etc.'
    properties: {
      key: 'unique key',
      name: 'Human identifier, renamable',
      default: 'a default value'
    }
  }
}
```

You end up with a json-schema that looks something like this:

```
{ 
  title: 'Tabular data properties',
  type: 'array',
  items: { 
    type: 'object',
    properties: {
      cia8qzipj0000bawmt4s9hm30: [Object],
      cia8qzipl0001bawmf0b2cqv2: [Object],
      cia8qzipl0002bawmhhnpmh4j: [Object],
      cia8qzipm0004bawmvc0bgl8v: [Object] 
    } 
  } 
}
```

## Validating

Internally this module uses [is-my-json-valid](http://npmjs.org/is-my-json-valid) to validate data.

## Usage & API

## `var dataSchema = require('data-schema')`

### `var schema = dataSchema(options)`

**options:**  
  - schema: the full json schema object for the tabular data
  - static: default is false. if true, properties can't be added, removed, or updated

## Methods

## `schema.create(property)`

Example:

```
schema.create({
  name: 'example'
  type: 'string'
})
```

## `schema.get(key)`

Example:

```
var property = schema.get(key)
```

## `schema.update(property)`

Example:

```
var property = schema.update({
  key: 'the key',
  name: 'new name'
})
```

key is required for updating a property

## `schema.delete(key)`

Example:

```
schema.delete(key)
```

## `schema.validate(data)`

Example:

```
var property = schema.create({
  name: 'validatethis',
  type: 'string'
})

var validated = schema.validateProperty(property.key, 'this is a string')

validated // -> true
```

## `schema.validateProperty(key, value)`

```
var data = [
  {
    'test': 'string',
    'validatethis': 'string'
  }
]

var validated = schema.validate({
  test: 'cool',
  validatethis: 'ok'
})

validated // -> true
```

## `schema.all()`

Returns object of all properties

## `schema.newRow()`

Returns object with keys for all properties in the schema and default values

## Properties

## `schema.schema`

The json schema representation of your tabular data.

## License

MIT