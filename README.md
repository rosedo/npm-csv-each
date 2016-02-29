# CSV reading library

## Installation
```sh
$ npm install --save csv-ew
```

## Usage
```js
const csv = require('csv-ew');

// customizing options up-front
const csv = require('csv-ew')({ trimColumns: true });

// making an instance available to other files
const csv = require('csv-ew');
csv.myCustomReader = csv({ trimColumns: true });
// freeing memory: delete csv.myCustomReader

// if Promise isn't defined
global.Promise = require('promise-module');
var csv = require('csv-ew');
```

### Iterating through records of a CSV file
```js
csv.eachEntry({

  // MANDATORY FIELDS

  filename: __dirname + '/mydata.csv',

  // iterator: must return a promise with sync or async behavior
  // called for each record in the csv file
  iterator: record => new Promise((resolve, reject) => {
    console.log(record);
    setTimeout(resolve, 1000);
  }),

  // OPTIONAL FIELDS and their default values

  delimiter: ',',

  // if true: " line " => "line"
  trimLine: false,

  // if true: use the CSV line (string) instead of turning it into an object
  returnLines: false,

  // if true: "value1, value2" => "value1,value2"
  trimColumns: false,

  // reject the promise when these cases occur
  raiseOnEmptyLines: true,
  raiseOnMissingColumns: true,
  raiseOnExtraColumns: true,

  // if false: the record will have values defined by the options "defaultValueOnEmptyColumn" "defaultValueOnMissingColumn"
  skipEmptyLines: true,

  // if true: use the CSV values (array) instead of turning it into an object
  returnArrays: false,

  // parse double-quoted values which can contain the delimiter and escaped double-quotes: ""
  // i.e. "value1,"""value2"", containing the delimiter",value3"
  handleQuotes: true,

  // replace empty columns by this value
  defaultValueOnEmptyColumn: '',

  // replace missing columns by this value
  defaultValueOnMissingColumn: null,

  // use the first csv line, or specify an array
  columnNames: 'auto',

  // set this to true if columnNames is an array but the first CSV line is a header
  skipFirstLine: false,

})
.then(() => console.log('last iteration completed.'))
.catch(console.error);
```

## Running tests
```sh
$ npm install
$ npm test
```