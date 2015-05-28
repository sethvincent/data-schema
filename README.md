# data-schema-tabular

> Defines & manages the properties – the columns – of tabular data using json-schema

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

## var schema = require('data-schema-tabular')(options)

**options:**  
  - schema: the full json schema object for the tabular data
  - static: default is false. if true, properties can't be added, removed, or updated

## schema.create(property)

Example:

```
schema.create({
  name: 'example'
  type: 'string'
})
```

## schema.get(key)

Example:

```
var property = schema.get(key)
```

## schema.update(property)

Example:

```
var property = schema.update({
  key: 'the key',
  name: 'new name'
})
```

key is required for updating a property

## schema.delete(key)

## schema.validate(data)

## schema.validateProperty(key, value)

## schema.all()

## License
MIT