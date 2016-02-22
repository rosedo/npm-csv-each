'use strict';

var assert = require('assert');
var _ = require('lodash');
var csvModule = require('../csv');
var csv = csvModule({

  // if promise isn't defined globally
  // Promise: require('bluebird'),

  filename: __dirname + '/test-data.csv',
  raiseOnEmptyLines: false,
  raiseOnMissingColumns: false,
  raiseOnExtraColumns: false,
  skipEmptyLines: false,
});

var testDataExpectedRecordCount = 8;

describe('module csv', function() {
  describe('managing instances', function() {
    it('module should be a default instance', function() {
      assert.strictEqual(typeof csvModule.eachEntry, 'function');
    });
    it('module can create a new instance', function() {
      assert.strictEqual(typeof csvModule, 'function');
      assert.strictEqual(typeof csv, 'function');
      assert.strictEqual(typeof csv.eachEntry, 'function');
    });
  });
  describe('eachEntry', function() {
    it('should call `iterator` for each record of `filename` and resolve and the end', function(done) {
      var iteratorTimesCalled = 0;
      csv.eachEntry({
        iterator: function(record) {
          return new Promise(function(resolve, reject) {
            iteratorTimesCalled++;
            return resolve();
          });
        },
      }).then(function() {
        return new Promise(function(resolve, reject) {
          assert.strictEqual(iteratorTimesCalled, testDataExpectedRecordCount);
          return resolve();
        });
      }).then(done, done);
    });
    describe('option trimLine', function() {
      it('if true: should remove whitespace on left and right side of the lines', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          trimLine: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 1) {
                assert.strictEqual(record.Column2, 'value2');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
      it('if false: should NOT remove whitespace on left and right side of the lines', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          trimLine: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 1) {
                assert.strictEqual(record.Column2, 'value2\t');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option trimColumns', function() {
      it('if true: should remove whitespace on left and right side of each column', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          trimColumns: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 1) {
                assert.strictEqual(record.Column2, 'value2');
              } else if (iteratorTimesCalled == 2) {
                assert.strictEqual(record.Column1, 'value3');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
      it('if false: should NOT remove whitespace on left or right of any column', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          trimColumns: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 1) {
                assert.strictEqual(record.Column2, 'value2\t');
              } else if (iteratorTimesCalled == 2) {
                assert.strictEqual(record.Column1, ' value3\t');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option raiseOnEmptyLines', function() {
      it('if true: should reject if there is at least one empty line (after line processing options)', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          raiseOnEmptyLines: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              return resolve();
            });
          },
        }).then(function() {
          done(new Error('missing expected error'));
        }, function() {
          done();
        });
      });
      it('if false: should NOT reject', function(done) {
        csv.eachEntry({
          raiseOnEmptyLines: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option raiseOnMissingColumns', function() {
      it('if true: should reject if there is at least one line with missing columns', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          raiseOnMissingColumns: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              return resolve();
            });
          },
        }).then(function() {
          done(new Error('missing expected error'));
        }, function() {
          done();
        });
      });
      it('if false: should NOT reject', function(done) {
        csv.eachEntry({
          raiseOnMissingColumns: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option raiseOnExtraColumns', function() {
      it('if true: should reject if there is at least one line with extra columns', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          raiseOnExtraColumns: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              return resolve();
            });
          },
        }).then(function() {
          done(new Error('missing expected error'));
        }, function() {
          done();
        });
      });
      it('if false: should NOT reject', function(done) {
        csv.eachEntry({
          raiseOnExtraColumns: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option returnLines', function() {
      it('if true: should call the iterator with strings', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          returnLines: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              assert.strictEqual(typeof record, 'string');
              return resolve();
            });
          },
        }).then(done, done);
      });
      it('if false: should NOT call the iterator with strings', function(done) {
        csv.eachEntry({
          returnLines: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              assert.notStrictEqual(typeof record, 'string');
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option returnArrays', function() {
      it('if true: should call the iterator with arrays', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          returnArrays: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              assert(_.isArray(record));
              return resolve();
            });
          },
        }).then(done, done);
      });
      it('if false: should NOT call the iterator with arrays', function(done) {
        csv.eachEntry({
          returnArrays: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              assert(!_.isArray(record));
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option handleQuotes', function() {
      it('if true: should read double-quoted values including the ones containing the delimiter, and allow use of double quotes to escape double quotes', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          handleQuotes: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 3) {
                assert.strictEqual(record.Column1, '"val"ue5');
                assert.strictEqual(record.Column2, 'val"ue,6');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
      it('if false: should NOT remove whitespace on left and right side of the lines', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          handleQuotes: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 3) {
                assert.strictEqual(record.Column2, '"val""ue');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option defaultValueOnEmptyColumn', function() {
      it('should be set as the value of empty columns', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          defaultValueOnEmptyColumn: 1111,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 4) {
                assert.strictEqual(record.Column1, 1111);
                assert.strictEqual(record.Column2, 1111);
              }
              if (iteratorTimesCalled == 5) {
                assert.strictEqual(record.Column1, 1111);
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option defaultValueOnMissingColumn', function() {
      it('should be set as the value of missing columns', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          defaultValueOnMissingColumn: 1111,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 5) {
                assert.strictEqual(record.Column2, 1111);
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option columnNames', function() {
      it('should define the columnNames and make use of the first csv line as a record', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          columnNames: ['myColumn1', 'myColumn2'],
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 1) {
                assert.strictEqual(typeof record.Column1, 'undefined');
                assert.strictEqual(typeof record.Column2, 'undefined');
                assert.strictEqual(record.myColumn1, 'Column1');
                assert.strictEqual(record.myColumn2, 'Column2');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option skipFirstLine', function() {
      it('should not iterate on the first line if columnNames are defined', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          columnNames: ['myColumn1', 'myColumn2'],
          skipFirstLine: true,
          trimColumns: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 1) {
                assert.strictEqual(typeof record.Column1, 'undefined');
                assert.strictEqual(typeof record.Column2, 'undefined');
                assert.strictEqual(record.myColumn1, 'value1');
                assert.strictEqual(record.myColumn2, 'value2');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
    describe('option skipEmptyLines', function() {
      it('if true: should use the record from the next non-empty line if it exists', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          skipEmptyLines: true,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 5) {
                assert.strictEqual(record.Column1, 'value8');
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
      it('if false: should return a record with values corresponding to the options "defaultValueOnEmptyColumn" and "defaultValueOnMissingColumn"', function(done) {
        var iteratorTimesCalled = 0;
        csv.eachEntry({
          skipEmptyLines: false,
          iterator: function(record) {
            return new Promise(function(resolve, reject) {
              iteratorTimesCalled++;
              if (iteratorTimesCalled == 5) {
                assert.strictEqual(record.Column1, '');
                assert.strictEqual(record.Column2, null);
              }
              return resolve();
            });
          },
        }).then(done, done);
      });
    });
  });
});