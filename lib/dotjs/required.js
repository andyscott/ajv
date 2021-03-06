'use strict';
module.exports = function anonymous(it) {
  var out = ' ';
  var $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema['required'],
    $schemaPath = it.schemaPath + '.' + 'required',
    $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $errs = 'errs' + $lvl;
  if (it.opts._debug) {
    out += ' console.log(\'Keyword ' + ('required') + '\'); ';
  }
  var $currentErrorPath = it.errorPath;
  if ($breakOnError) {
    out += ' var missing' + ($lvl) + '; ';
    if ($schema.length <= 20) {
      out += ' if ( ';
      var arr1 = $schema;
      if (arr1) {
        var $property, $i = -1,
          l1 = arr1.length - 1;
        while ($i < l1) {
          $property = arr1[$i += 1];
          if ($i) {
            out += ' || ';
          }
          var $prop = it.util.getProperty($property);
          out += ' ( ' + ($data) + ($prop) + ' === undefined && (missing' + ($lvl) + ' = \'' + (it.util.escapeQuotes($prop)) + '\') ) ';
        }
      }
      out += ') { ';
      var $propertyPath = ' + missing' + $lvl,
        $missingProperty = '\'' + $propertyPath + ' + \'';
      it.errorPath = $currentErrorPath + $propertyPath;
      if (it.wasTop && $breakOnError) {
        out += ' validate.errors = [ { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
        if (it.opts.verbose) {
          out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
        }
        out += ' }]; return false; ';
      } else {
        out += '  var err =   { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
        if (it.opts.verbose) {
          out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
        }
        out += ' }; if (validate.errors === null) validate.errors = [err]; else validate.errors.push(err); errors++; ';
      }
      out += ' } else { ';
    } else {
      out += '  var schema' + ($lvl) + ' = validate.schema' + ($schemaPath) + '; ';
      var $i = 'i' + $lvl,
        $propertyPath = ' + schema' + $lvl + '[' + $i + '] + ',
        $missingProperty = '\' + "\'"' + $propertyPath + '"\'" + \'';
      it.errorPath = ($currentErrorPath + ' + "[\'"' + $propertyPath + '"\']"').replace('" + "', '');
      out += ' for (var ' + ($i) + ' = 0; ' + ($i) + ' < schema' + ($lvl) + '.length; ' + ($i) + '++) { var ' + ($valid) + ' = ' + ($data) + '[schema' + ($lvl) + '[' + ($i) + ']] !== undefined; if (!' + ($valid) + ') break; }  if (!' + ($valid) + ') {  ';
      if (it.wasTop && $breakOnError) {
        out += ' validate.errors = [ { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
        if (it.opts.verbose) {
          out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
        }
        out += ' }]; return false; ';
      } else {
        out += '  var err =   { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
        if (it.opts.verbose) {
          out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
        }
        out += ' }; if (validate.errors === null) validate.errors = [err]; else validate.errors.push(err); errors++; ';
      }
      out += ' } else { ';
    }
  } else {
    if ($schema.length <= 10) {
      var arr2 = $schema;
      if (arr2) {
        var $property, $i = -1,
          l2 = arr2.length - 1;
        while ($i < l2) {
          $property = arr2[$i += 1];
          var $prop = it.util.getProperty($property),
            $missingProperty = it.util.escapeQuotes($prop);
          it.errorPath = ($currentErrorPath + ' + \'' + $missingProperty + '\'').replace('" + "', '');
          out += ' if (' + ($data) + ($prop) + ' === undefined) {  ';
          if (it.wasTop && $breakOnError) {
            out += ' validate.errors = [ { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
            if (it.opts.verbose) {
              out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
            }
            out += ' }]; return false; ';
          } else {
            out += '  var err =   { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
            if (it.opts.verbose) {
              out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
            }
            out += ' }; if (validate.errors === null) validate.errors = [err]; else validate.errors.push(err); errors++; ';
          }
          out += ' } ';
        }
      }
    } else {
      out += '  var schema' + ($lvl) + ' = validate.schema' + ($schemaPath) + '; ';
      var $i = 'i' + $lvl,
        $propertyPath = ' + schema' + $lvl + '[' + $i + '] + ',
        $missingProperty = '\' + "\'"' + $propertyPath + '"\'" + \'';
      it.errorPath = ($currentErrorPath + ' + "[\'"' + $propertyPath + '"\']"').replace('" + "', '');
      out += ' for (var ' + ($i) + ' = 0; ' + ($i) + ' < schema' + ($lvl) + '.length; ' + ($i) + '++) { if (' + ($data) + '[schema' + ($lvl) + '[' + ($i) + ']] === undefined) {  ';
      if (it.wasTop && $breakOnError) {
        out += ' validate.errors = [ { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
        if (it.opts.verbose) {
          out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
        }
        out += ' }]; return false; ';
      } else {
        out += '  var err =   { keyword: \'' + ('required') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'property ' + ($missingProperty) + ' is required\' ';
        if (it.opts.verbose) {
          out += ', schema: validate.schema' + ($schemaPath) + ', data: ' + ($data);
        }
        out += ' }; if (validate.errors === null) validate.errors = [err]; else validate.errors.push(err); errors++; ';
      }
      out += ' } } ';
    }
  }
  it.errorPath = $currentErrorPath;
  return out;
}
