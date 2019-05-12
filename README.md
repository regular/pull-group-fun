# pull-group-fun

Like [pull-group](https://github.com/dominictarr/pull-group), but instead of producing fixed-sized arrays, you provide a function that determines how items are grouped.

``` js
var Group = require('pull-group-fun')
pull(
  pull.values(['foo', bar', 'scuttlebutt', 'baz'']), 
  Group(x => x.length),
  pull.log() // ['foo', 'bar'], ['scuttlebutt'], ['baz']
)
```

## License

MIT
