'use strict';
module.exports = function anonymous(it) {
  var out = ' ';
  var $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema['minimum'],
    $schemaPath = it.schemaPath + '.' + 'minimum',
    $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $errs = 'errs' + $lvl;
  if (it.opts._debug) {
    out += ' console.log(\'Keyword ' + ('minimum') + '\'); ';
  }
  var $exclusive = it.schema.exclusiveMinimum === true,
    $op = $exclusive ? '>' : '>=',
    $notOp = $exclusive ? '<=' : '<';
  out += 'if (' + ($data) + ' ' + ($notOp) + ' ' + ($schema) + ') {  ';
  if (it.wasTop && $breakOnError) {
    out += ' validate.errors = [ { keyword: \'' + ('minimum') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'should be ' + ($op) + ' ' + ($schema) + '\' ';
    if (it.opts.verbose) {
      out += ', schema: ' + ($schema) + ', data: ' + ($data);
    }
    out += ' }]; return false; ';
  } else {
    out += '  var err =   { keyword: \'' + ('minimum') + '\', dataPath: (dataPath || \'\') + ' + (it.errorPath) + ', message: \'should be ' + ($op) + ' ' + ($schema) + '\' ';
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
