# Benchmarks

```shell
Starting benchmark not-modified.js

fresh x 3,296,968 ops/sec ±0.06% (98 runs sampled)
@foxify/fresh x 3,315,035 ops/sec ±0.13% (101 runs sampled)
Fastest is [ '@foxify/fresh' ]

Starting benchmark modified.js

fresh x 3,271,500 ops/sec ±0.09% (94 runs sampled)
@foxify/fresh x 3,281,954 ops/sec ±0.09% (102 runs sampled)
Fastest is [ '@foxify/fresh' ]

Starting benchmark etag-star.js

fresh x 155,299,832 ops/sec ±0.09% (102 runs sampled)
@foxify/fresh x 155,346,938 ops/sec ±0.04% (96 runs sampled)
Fastest is [ '@foxify/fresh', 'fresh' ]

Starting benchmark etag-single.js

fresh x 41,086,973 ops/sec ±0.35% (96 runs sampled)
@foxify/fresh x 90,263,424 ops/sec ±0.65% (98 runs sampled)
Fastest is [ '@foxify/fresh' ]

Starting benchmark etag-several.js

fresh x 6,864,653 ops/sec ±0.21% (96 runs sampled)
@foxify/fresh x 47,419,315 ops/sec ±0.45% (99 runs sampled)
Fastest is [ '@foxify/fresh' ]
```
