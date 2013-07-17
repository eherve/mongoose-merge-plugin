# mongoose-merge-plugin

Mongoose plugin for document merging

## Install npm install mongoose-merge-plugin

## Loading

  var merge = require('mongoose-merge-plugin');

## Inintialization

  var mongoose = require('mongoose');
  mongoose.plugin(merge);

## Usage

The method <i>merge</i> is added to all mongoose documents. It takes a source object as paramter and merge it in the target existing documents. It checks for existing values in the source object regarding the field path of the destination document.
It does not merge the <i>\_id</i> and <i>\_\_v</i> default fields and check for the schema field option <i>mergeable</i>, if the option is false, the merge skip the field as well.

## Example

<pre>
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var schema = new Schema({
  name: String,
  notMergedField: { type: String, mergeable: false }
});
var model = mongoose.model('Test', schema);
var test = new Test({name: test, notMergedField: testNMF });
console.log(test); // LOG: { i_id: ..., name: test, notMergedField: testNMF ...}
test.merge({ name: testChanged, notMergedField: testNMFChanged });
console.log(test); // LOG: { i_id: ..., name: testChanged, notMergedField: testNMF ...}
</pre>

## Support

<a href="http://www.it-tweaks.com/" target="_blank">it-tweaks</a>
