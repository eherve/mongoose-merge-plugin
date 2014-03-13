# mongoose-merge-plugin

Mongoose plugin for document merging

## Install npm install mongoose-merge-plugin

## Loading

  var merge = require('mongoose-merge-plugin');

## Inintialization

  var mongoose = require('mongoose');
  
  mongoose.plugin(merge);

## Usage

The method <i>merge</i> is added to all mongoose documents. It takes a source object as parameter and merge it in the target existing documents. It checks for existing values in the source object regarding the field path of the destination document.
It does not merge the <i>\_id</i> and <i>\_\_v</i> default fields and check for the schema field option <i>mergeable</i>. If the option is false, the merge skip the field as well.

The method <i>merge</i> accept a second parameter that is the merge options. this parameter allow to specify a filter on fields when calling the merge.

* <b>options.fields</b>

> It is a string with field names, separeted by one or more spaces. If the field path is present in this string, the merge check if the mongoose field is mergeable and if yes it allows the merge. If before the field path a + flag is added, then the field will be merged (overriding the schema field option). If the flag is '-' the field will not be merged as well as if the field name is not present.

* <b>options.virtuals</b>

> It is a boolean value that activates the merging of the virtuals fields

## Example

<pre>
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
</pre>

## Support

<a href="http://www.it-tweaks.com/" target="_blank">it-tweaks</a>
