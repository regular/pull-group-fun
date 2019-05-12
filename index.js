module.exports = function (fun) {
  var ended, first = true
  var queue = []
  var oldKey
  return function (read) {
    return function (end, cb) {
      //this means that the upstream is sending an error.
      if(end) return read(ended = end, cb)
      //this means that we read an end before.
      if(ended) return cb(ended)

      read(null, function next(end, data) {
        if(ended = ended || end) {
          if(!queue.length)
            return cb(ended)

          var _queue = queue; queue = []
          return cb(null, _queue)
        }
        var key = fun(data)
        if(key == oldKey || first) {
          queue.push(data)
          oldKey = key
          first = false
          return read(null, next)
        }
        oldKey = key
       var  _queue = queue; queue = [data]
        cb(null, _queue)
      })
    }
  }
}

