var MERGE_FIELD_FILTER = [ '_id', '__v' ];

module.exports = function(schema, options) {
  schema.method('merge', function (obj) {
    var self = this;
    self.schema.eachPath(function(path) {
      if (isMergeable(schema, path)) {
        var value = getValue(obj, path);
        if (value !== undefined) self.set(path, value);
      }
    });
    return this;
  });
};

function getValue(obj, path) {
  if (MERGE_FIELD_FILTER.indexOf(path) != -1) return undefined;
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

function isMergeable(schema, path) {
  var field = schema.path(path);
  if (field && field.options.mergeable === false) return false;
  return true;
}
