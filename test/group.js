var pull = require('pull-stream')
var test = require('tape')
var group = require('../')
process.on('uncaughtException', function (err) {
  console.error(err.stack)
})

test('group', function (t) {
  var count=0
  pull(
    pull.values(['foo', 'bar', 'baz', 'scuttlebutt', 'baz']),
    group(function(x) {return x.length}),
    group(function(x) {return x.length}),
    function (read) {
      return function (end, cb) {
        read(null, function (end, data) {
          if(!end) {
            t.deepEqual(data, [
              [['foo', 'bar', 'baz']],
              [['scuttlebutt'], ['baz']],
            ][count++])
            console.log(data)
          }
       
         process.nextTick(cb.bind(null, end, data))
        })
      }
    },
    pull.drain(null, function (err) {
      t.notOk(err)
      t.end()
    })
  )
})

test('flatten (ungroup)', function (t) {
  var values = ['foo', 'bar', 'baz', 'scuttlebutt', 'baz']
  pull(
    pull.values(values),
    group(function(x) {return x.length}),
    group(function(x) {return x.length}),
    pull.through(console.log),
    pull.flatten(),
    pull.through(console.log),
    pull.flatten(),
    pull.collect(function (err, ary) {
      t.notOk(err)
      console.log(ary)
      t.deepEqual(ary, values)
      t.end()
    })
  )
})

