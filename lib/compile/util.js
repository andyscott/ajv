'use strict';


module.exports = {
  copy: copy,
  checkDataType: checkDataType,
  checkDataTypes: checkDataTypes,
  toHash: toHash,
  getProperty: getProperty,
  escapeQuotes: escapeQuotes,
  escapeRegExp: escapeRegExp,
  ucs2length: ucs2length,
  varOccurences: varOccurences,
  varReplace: varReplace,
  cleanUpCode: cleanUpCode,
  cleanUpVarErrors: cleanUpVarErrors,
  schemaHasRules: schemaHasRules,
  stableStringify: require('json-stable-stringify')
};


function copy(o, to) {
  to = to || {};
  for (var key in o) to[key] = o[key];
  return to;
}


function checkDataType(dataType, data, negate) {
  var EQUAL = negate ? ' !== ' : ' === '
    , AND = negate ? ' || ' : ' && '
    , OK = negate ? '!' : ''
    , NOT = negate ? '' : '!';
  switch (dataType) {
    case 'null': return data + EQUAL + 'null';
    case 'array': return OK + 'Array.isArray(' + data + ')';
    case 'object': return '(' + OK + data + AND + 
                          'typeof ' + data + EQUAL + '"object"' + AND + 
                          NOT + 'Array.isArray(' + data + '))';
    case 'integer': return '(typeof ' + data + EQUAL + '"number"' + AND + 
                           NOT + '(' + data + ' % 1))'
    default: return 'typeof ' + data + EQUAL + '"' + dataType + '"';
  }
}


function checkDataTypes(dataTypes, data, negate) {
  var EQUAL = negate ? ' !== ' : ' === '
    , AND = negate ? ' || ' : ' && '
    , OR = negate ? ' && ' : ' || '
    , OK = negate ? '!' : '';
  switch (dataTypes.length) {
    case 0: return negate ? 'true' : 'false';
    case 1: return checkDataType(dataTypes[0], data, negate);
    default:
      var code = ''
      var types = toHash(dataTypes);
      if (types.array && types.object) {
        code = types.null ? '(': '(' + OK + data + AND
        code += 'typeof ' + data + EQUAL + '"object")';
        delete types.null;
        delete types.array;
        delete types.object;
      }
      if (types.number) delete types.integer;
      for (var t in types)
        code += (code ? OR : '' ) + checkDataType(t, data, negate);

      return code;
  }
}


function toHash(arr, func) {
  var hash = {};
  arr.forEach(function (item) {
    if (func) item = func(item);
    hash[item] = true;
  });
  return hash;
}


var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
var SINGLE_QUOTE = /('|\\)/g;
function getProperty(key) {
  return IDENTIFIER.test(key)
          ? '.' + key
          : "['" + key.replace(SINGLE_QUOTE, "\\$1") + "']";
}


function escapeQuotes(str) {
  return str.replace(SINGLE_QUOTE, "\\$1");
}


var ESCAPE_REGEXP = /[\/]/g
function escapeRegExp(str) {
  return str.replace(ESCAPE_REGEXP, '\\$&');
}


// https://mathiasbynens.be/notes/javascript-encoding
// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
function ucs2length(str) {
  var length = 0
    , len = str.length
    , pos = 0
    , value;
  while (pos < len) {
    length++;
    value = str.charCodeAt(pos++);
    if (value >= 0xD800 && value <= 0xDBFF && pos < len) {
      // high surrogate, and there is a next character
      value = str.charCodeAt(pos);
      if ((value & 0xFC00) == 0xDC00) pos++; // low surrogate
    }
  }
  return length;
}


function varOccurences(str, dataVar) {
  dataVar += '[^0-9]';
  var matches = str.match(new RegExp(dataVar, 'g'));
  return matches ? matches.length : 0;
}


function varReplace(str, dataVar, expr) {
  dataVar += '([^0-9])';
  return str.replace(new RegExp(dataVar, 'g'), expr + '$1')
}


var EMPTY_ELSE = /else\s*{\s*}/g
  , EMPTY_IF_NO_ELSE = /if\s*\([^)]+\)\s*\{\s*\}(?!\s*else)/g
  , EMPTY_IF_WITH_ELSE = /if\s*\(([^)]+)\)\s*\{\s*\}\s*else(?!\s*if)/g;
function cleanUpCode(out) {
  return out.replace(EMPTY_ELSE, '')
            .replace(EMPTY_IF_NO_ELSE, '')
            .replace(EMPTY_IF_WITH_ELSE, 'if (!($1))');
}


var ERRORS_REGEXP = /[^\.]errors/g
  , VAR_ERRORS = 'var errors = 0;'
  , INITIALIZE_ERRORS = 'validate.errors = null;'
  , RETURN_ERRORS = 'return errors === 0;'
function cleanUpVarErrors(out) {
  var matches = out.match(ERRORS_REGEXP);
  if (matches && matches.length === 2)
    return out.replace(VAR_ERRORS, '')
              .replace(INITIALIZE_ERRORS, '')
              .replace(RETURN_ERRORS, INITIALIZE_ERRORS + ' return true;');
  else
    return out;
}


function schemaHasRules(schema, rules) {
  for (var key in schema) if (rules[key]) return true;
}
