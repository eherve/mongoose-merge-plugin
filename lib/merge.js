'use strict';

var util = require('util');
var MERGE_FIELD_FILTER = [ '_id', '__v' ];

module.exports = function(schema, options) {
  schema.method('merge', function (obj, opts) {
    var self = this;
    opts = opts || {};
    var restriction = opts.fields && !(/(^| |\+)[^ +-]+/g.test(opts.fields));
    self.schema.eachPath(function(path) {
      if (MERGE_FIELD_FILTER.indexOf(path) == -1 &&
      isMergeable(schema, path, opts, restriction)) {
        var str_key = path.split('.');
        var first_key = str_key[0];
        var first_value = obj[first_key];
        if(first_value === null ||  JSON.stringify(first_value) === '{}') {
          return self.set(first_key,  first_value);
        }
        var value = getValue(obj, path);
        if (value !== undefined) { self.set(path, value); }
      }
    });
    if (opts.virtuals) {
      Object.keys(self.schema.virtuals).forEach(function (path) {
        var value = getValue(obj, path);
        if (value !== undefined) { self.set(path, value); }
      });
    }
    return this;
  });
};

function getValue(obj, path) {
  if (obj[path] !== undefined) { return obj[path]; }
  var index = path.indexOf('.');
  var base = index != -1 ? path.substring(0, index) : '';
  var field = path.substring(base.length + 1);
  var value = null;
  while (base && base.length > 0) {
    if (obj[base]) {
      value = getValue(obj[base], field);
      if (value !== undefined) { return value; }
    }
    index = field.indexOf('.');
    base = index != -1 ? base + field.substring(0, index) : '';
    field = field.substring(base.length + 1);
  }
  return undefined;
}

function isMergeable(schema, path, opts, restriction) {
  var field = schema.path(path);
  if ('string' == typeof opts.fields) {
    var np = path; var index;
    while (np.length > 0) {
      index = opts.fields.search(new RegExp(util.format(
        '(^| |\\-|\\+)%s( |$)', np.replace('\.', '\\.'))));
      var match = RegExp.$1;
      if (index != -1) {
        if (match == '+') { return true; } if (match == '-') { return false; }
        return !field || field.options.mergeable !== false;
      }
      np = np.substring(0, np.lastIndexOf('.'));
    }
    if (restriction && field.options.mergeable !== false) { return true; }
    return false;
  }
  if (field && field.options.mergeable === false) { return false; }
  return true;
}
