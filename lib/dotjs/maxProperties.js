'use strict';
module.exports = function anonymous(it) {
  var out = ' ';
  var $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema['maxProperties'],
    $schemaPath = it.schemaPath + '.' + 'maxProperties',
    $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $errs = 'errs' + $lvl;
  if (it.opts._debug) {
    out += ' console.log(\'Keyword ' + ('maxProperties') + '\'); ';
  }
  out += 'if (Object.keys(' + ($data) + ').length > ' + ($schema) + ') {  ';
  if (it.wasTop && $breakOnError) {
    out += ' validate.errors = [ { keyword: \'' + ('maxProperties') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'should NOT have more than ' + ($schema) + ' properties\' ';
    if (it.opts.verbose) {
      out += ', schema: ' + ($schema) + ', data: ' + ($data);
    }
    out += ' }]; return false; ';
  } else {
    out += '  var err =   { keyword: \'' + ('maxProperties') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'should NOT have more than ' + ($schema) + ' properties\' ';
    if (it.opts.verbose) {
      out += ', schema: ' + ($schema) + ', data: ' + ($data);
    }
    out += ' }; if (validate.errors === null) validate.errors = [err]; else validate.errors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}
