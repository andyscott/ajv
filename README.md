# ajv - Another JSON Schema Validator

One of the fastest JSON Schema validators for node.js and browser.

It uses precompiled [doT templates](https://github.com/olado/doT) to generate super-fast validating functions.

[![Build Status](https://travis-ci.org/epoberezkin/ajv.svg?branch=master)](https://travis-ci.org/epoberezkin/ajv)
[![npm version](https://badge.fury.io/js/ajv.svg)](http://badge.fury.io/js/ajv)
[![Code Climate](https://codeclimate.com/github/epoberezkin/ajv/badges/gpa.svg)](https://codeclimate.com/github/epoberezkin/ajv)


## JSON Schema standard

ajv implements full [JSON Schema draft 4](http://json-schema.org/) standard:

- all validation keywords
- full support of remote refs (remote schemas have to be added with `addSchema` or compiled to be available)
- correct string lengths for strings with unicode pairs (can be turned off)
- formats defined by JSON Schema draft 4 standard and custom formats (can be turned off)

ajv passes all the tests from [JSON Schema Test Suite](https://github.com/json-schema/JSON-Schema-Test-Suite) (apart from the one that requires that `1.0` is not an integer).


## Benchmarks

Benchmark of the test suite - [json-schema-benchmark](https://github.com/ebdrup/json-schema-benchmark).

[Same benchmark](https://github.com/epoberezkin/json-schema-benchmark) run on faster CPU with node 0.12.

[Benchmark of individual test cases](https://rawgit.com/zaggino/z-schema/master/benchmark/results.html) by [z-schema](https://github.com/zaggino/z-schema).


## Install

```
npm install ajv
```


## Usage

```
var Ajv = require('ajv');
var ajv = Ajv(); // options can be passed
var validate = ajv.compile(schema);
var valid = validate(data);
if (!valid) console.log(validate.errors);
```

or

```
// ...
var valid = ajv.validate(schema, data);
if (!valid) console.log(ajv.errors);
// ...
```

or

```
// ...
ajv.addSchema(schema, 'mySchema');
var valid = ajv.validate('mySchema', data);
if (!valid) console.log(ajv.errorsText());
// ...
```

ajv compiles schemas to functions and caches them in all cases (using stringified schema as a key - using [json-stable-stringify](https://github.com/substack/json-stable-stringify)), so that the next time the same schema is used (not necessarily the same object instance) it won't be compiled again.


## Using in browser

You can require ajv directly from the code you browserify - in this case ajv will be a part of your bundle.

If you need to use ajv in several bundles you can create a separate browserified bundle using `bin/create-bundle` script (thanks to [siddo420](https://github.com/siddo420)).

Then you need to load ajv in the browser:
```
<script src="ajv.bundle.js"></script>
```

Now you can use it as shown above - `require` will be global and you can `require('ajv')`.

Ajv was tested with these browsers:

[![Sauce Test Status](https://saucelabs.com/browser-matrix/epoberezkin.svg)](https://saucelabs.com/u/epoberezkin)


## Formats

The following formats are supported for string validation with "format" keyword:

- _date_: full-date from http://tools.ietf.org/html/rfc3339#section-5.6
- _date-time_: date-time from the same source. Both `date` and `date-time` validate ranges in `full` mode and only regexp in `fast` mode (see [options](#options)).
- _uri_: full uri with optional protocol.
- _email_: email address.
- _hostname_: host name acording to http://tools.ietf.org/html/rfc1034#section-3.5
- _ipv4_: IP address v4.
- _ipv6_: IP address v6.
- _regex_: tests whether a string is a valid regular expression by passing it to RegExp constructor.

There are two modes of fomat validation: `fast` and `full` that affect all formats but `ipv4` and `ipv6`. See [Options](#options) for details.

You can add additional formats and replace any of the formats above using [addFormat](#api-addformat) method.

You can find patterns used for format validation and the sources that were used in [formats.js](https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js).


## API

##### Ajv(Object options) -&gt; Object

Create ajv instance.

All the instance methods below are bound to the instance, so they can be used without the instance.


##### .compile(Object schema) -&gt; Function&lt;Object data&gt;

Generate validating function and cache the compiled schema for future use.

Validating function returns boolean and has properties `errors` with the errors from the last validation (`null` if there were no errors) and `schema` with the reference to the original schema. 

Unless the option `validateSchema` is false, the schema will be validated against meta-schema and if schema is invalid the error will be thrown. See [options](#options).


##### .validate(Object schema|String key|String ref, data) -&gt; Boolean

Validate data using passed schema (it will be compiled and cached).

Instead of the schema you can use the key that was previously passed to `addSchema`, the schema id if it was present in the schema or any previously resolved reference.

Validation errors will be available in the `errors` property of ajv instance (`null` if there were no errors).


##### .addSchema(Array&lt;Object&gt;|Object schema [, String key]) -&gt; Function|Array&lt;Function&gt;

Add and compile schema(s). It does the same as `.compile` with two differences:

- array of schemas can be passed (schemas should have ids), the second parameter will be ignored.

- key can be passed that can be used to reference the schema and will be used as the schema id if there is no id inside the schema. If the key is not passed, the schema id will be used as the key.


Once the schema added it and all the references inside it can be referenced in other schemas and used to validate data.

In the current version all the referenced schemas should be added before the schema that uses them is compiled, so the circular references are not supported.

Version [1.0](https://github.com/epoberezkin/ajv/tree/1.0.0) will only compile schemas when they are used the first time. The order of addition in this version is not important and it supports circular references. Try it from the branch if you need them and please report any issues.

By default schema is validated against meta-schema before it is compiled and if the schema does not pass validation the exception is thrown. This behaviour is controlled by `validateSchema` option.


##### .validateSchema(Object schema) -&gt; Boolean

Validates schema. This method should be used to validate schemas rather than `validate` due to the inconsistency of `uri` format in JSON-Schema standart.

By default this method is called automatically when the schema is added, so you rarely need to use it directly.

If schema doesn't have `$schema` property it is validated against draft 4 meta-schema (option `meta` should not be false).

If schema has `$schema` property then the schema with this id (should be previously added) is used to validate passed schema.

Errors will be available at `ajv.errors`.


##### .getSchema(String key) -&gt; Function&lt;Object data&gt;

Retrieve compiled schema previously added with `addSchema` by the key passed to `addSchema` or by its full reference (id). Returned validating function has `schema` property with the reference to the original schema.


##### .removeSchema(Object schema|String key|String ref)

Remove added/cached schema. Even if schema is referenced by other schemas it can be safely removed as dependent schemas have local references.

Schema can be removed using key passed to `addSchema`, it's full reference (id) or using actual schema object that will be stable-stringified to remove schema from cache.


##### <a name="api-addformat"></a>.addFormat(String name, String|RegExp|Function format)

Add custom format to validate strings. It can also be used to replace pre-defined formats for ajv instance.

Strings are converted to RegExp.

Function should return validation result as `true` or `false`.

Custom formats can be also added via `formats` option.


##### .errorsText([Array&lt;Object&gt; errors [, Object options]]) -&gt; String

Returns the text with all errors in a String.

Options can have properties `separator` (string used to separate errors, ", " by default) and `dataVar` (the variable name that dataPaths are prefixed with, "data" by default).


## Options

- _allErrors_: check all rules collecting all errors. Default is to return after the first error.
- _verbose_: include the reference to the part of the schema and validated data in errors (false by default).
- _format_: formats validation mode ('fast' by default). Pass 'full' for more correct and slow validation or `false` not to validate formats at all. E.g., 25:00:00 and 2015/14/33 will be invalid time and date in 'full' mode but it will be valid in 'fast' mode.
- _formats_: an object with custom formats. Keys and values will be passed to `addFormat` method.
- _schemas_: an array or object of schemas that will be added to the instance. If the order is important, pass array. In this case schemas must have IDs in them. Otherwise the object can be passed - `addSchema(value, key)` will be called for each schema in this object.
- _meta_: add [meta-schema](http://json-schema.org/documentation.html) so it can be used by other schemas (true by default).
- _validateSchema_: validate added/compiled schemas against meta-schema (true by default). `$schema` property in the schema can either be absent (draft-4 meta-schema will be used) or can be a reference to any previously added schema. If the validation fails, the exception is thrown. Pass "log" in this option to log error instead of throwing exception. Pass `false` to skip schema validation.
- _missingRefs_: by default if the reference cannot be resolved during compilation the exception is thrown. Pass 'ignore' to log error during compilation and pass validation. Pass 'fail' to log error and successfully compile schema but fail validation if this rule is checked.
- _uniqueItems_: validate `uniqueItems` keyword (true by default).
- _unicode_: calculate correct length of strings with unicode pairs (true by default). Pass `false` to use `.length` of strings that is faster, but gives "incorrect" lengths of strings with unicode pairs - each unicode pair is counted as two characters.
- _beautify_: format the generated function with [js-beautify](https://github.com/beautify-web/js-beautify) (the validating function is generated without line-breaks). `npm install js-beautify` to use this option. `true` or js-beautify options can be passed.
- _cache_: an optional instance of cache to store compiled schemas using stable-stringified schema as a key. For example, set-associative cache [sacjs](https://github.com/epoberezkin/sacjs) can be used. If not passed then a simple hash is used which is good enough for the common use case (a limited number of statically defined schemas). Cache should have methods `put(key, value)` and `get(key)`. 


## Tests

```
npm install
git submodule update --init
npm test
```


## Contributing

All validation functions are generated using doT templates in dot folder. Templates are precompiled so doT is not a run-time dependency.

`bin/compile-dots` to compile templates to dotjs folder

`bin/watch-dots` to automatically compile templates when files in dot folder change

`bin/git-hook` to install symbolic link to pre-commit hook that will compile templates and run tests.


## Changes history


##### 0.6.1

Errors for "required" keyword validation include missing properties

Better references resolution in schemas without IDs


##### 0.5.9

`cache` option and `removeSchema` method


##### 0.5.2

doT is no longer a run-time dependency

ajv can be used in the browser (with browserify)


##### 0.5.0

Schemas are validated against meta-schema before compilation


##### 0.4.1

Custom formats support.


##### 0.4.0

Errors are set to `null` if there are no errors (previously empty array).


## License

[MIT](https://github.com/epoberezkin/ajv/blob/master/LICENSE)
