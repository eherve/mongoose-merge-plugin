# mongoose-merge-plugin

Mongoose plugin for document merging

## Install
`npm install mongoose-merge-plugin`

## Loading

`var merge = require('mongoose-merge-plugin');`

## Initialize

```
var mongoose = require('mongoose');
  
mongoose.plugin(merge);
```

## Usage

The `merge` method is added to all mongoose documents. It takes a source object as the first parameter and merges it into the target documents. It compares the source object and destination document for paths that match.
It does not merge the `_id` and `__v` default fields. It checks for the schema field option `mergeable`; If the option is false, `merge` skips the field.

The `merge` method accepts a second parameter: merge options. This parameter allows you to specify a filter that will be applied when merging.

* **options.fields**

> A string of paths separated by one or more spaces. If a path is present in this string, the merge checks whether the Mongoose field is mergeable. If so, it allows the merge. Add a `+` or `-` flag before a path to override the schema option and force a field to merge or not merge, respectively.

* **options.virtuals**

> If `true`, virtual fields will also be merged.

## Example

```
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var schema = new Schema({
  name: String,
  description: String,
  notMergedField: { type: String, mergeable: false }
});

var Test = mongoose.model('Test', schema);

var test = new Test({ name: "test", description: "desc", notMergedField: "testNMF" });
console.log(test); // LOG: { i_id: ..., name: test, description: desc, notMergedField: testNMF ...}

test.merge({ name: "testChanged", description: "descChanged", notMergedField: "testNMFChanged" });
console.log(test); // LOG: { i_id: ..., name: testChanged, description: descChanged, notMergedField: testNMF ...}

test.merge({ name: "test", description: "desc" }, { fields: "-description" });
console.log(test); // LOG: { i_id: ..., name: test, description: descChanged, notMergedField: testNMF ...}
```

## Support

<a href="http://www.it-tweaks.com/" target="_blank">it-tweaks</a>
