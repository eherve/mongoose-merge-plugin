var MERGE_FIELD_FILTER = [ '_id', '__v' ];

module.exports = function(schema, options) {
  schema.method('merge', function (obj, opts) {
    var self = this;
    opts = opts || {};
    self.schema.eachPath(function(path) {
      if (MERGE_FIELD_FILTER.indexOf(path) == -1 &&
        isMergeable(schema, path, opts)) {
          var value = getValue(obj, path);
          if (value !== undefined) self.set(path, value);
      }
    });
    return this;
  });
};

function getValue(obj, path) {
  if (obj[path] !== undefined) return obj[path];
  var index = path.indexOf('.');
  var base = index != -1 ? path.substring(0, index) : '';
  var field = path.substring(base.length + 1);
  var value = null;
  while (base && base.length > 0) {
    if (obj[base]) {
      value = getValue(obj[base], field);
      if (value !== undefined) return value;
    }
    index = field.indexOf('.');
    base = index != -1 ? base + field.substring(0, index) : '';
    field = field.substring(base.length + 1);
  }
  return undefined;
}

function isMergeable(schema, path, opts) {
  if (opts.fields != undefined) {
    if ('string' == typeof opts.fields) {
      var index = opts.fields.search(
          new RegExp("(^|[ -+])"+path.replace('.', '\.')+"( |$)"));
      var match = RegExp.$1;
      if (index != -1) {
        if (match == '+') return true;
        if (match == '-') return false;
        var field = schema.path(path);
        if (field && field.options.mergeable === false) return false;
        return true;
      }
      return false;
    }
  }
  var field = schema.path(path);
  if (field && field.options.mergeable === false) return false;
  return true;
}
