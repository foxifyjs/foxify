# Benchmarks: @foxify/router

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v18.16.0)

```shell
ℹ Benchmark: all
  8 tests completed.

  @foxify/router    x 1,917,505 ops/sec ±0.72% (98 runs sampled)
  @hapi/call        x    27,513 ops/sec ±0.99% (96 runs sampled)
  express           x   302,821 ops/sec ±0.48% (98 runs sampled)
  find-my-way       x 1,256,531 ops/sec ±0.38% (97 runs sampled)
  foxify (v0.10.20) x   834,247 ops/sec ±0.14% (100 runs sampled)
  koa-router        x    85,133 ops/sec ±0.11% (99 runs sampled)
  koa-tree-router   x 2,029,298 ops/sec ±0.17% (93 runs sampled)
  trek-router       x 1,382,912 ops/sec ±0.16% (101 runs sampled)

ℹ Benchmark: dynamic
  8 tests completed.

  @foxify/router    x 8,680,564 ops/sec ±0.17% (101 runs sampled)
  @hapi/call        x    73,879 ops/sec ±0.70% (100 runs sampled)
  express           x 1,947,992 ops/sec ±0.13% (99 runs sampled)
  find-my-way       x 5,439,993 ops/sec ±0.21% (102 runs sampled)
  foxify (v0.10.20) x 3,191,389 ops/sec ±1.02% (98 runs sampled)
  koa-router        x   515,879 ops/sec ±0.17% (98 runs sampled)
  koa-tree-router   x 7,685,229 ops/sec ±0.11% (102 runs sampled)
  trek-router       x 4,990,972 ops/sec ±0.16% (101 runs sampled)

ℹ Benchmark: long-static
  8 tests completed.

  @foxify/router    x 25,687,503 ops/sec ±0.18% (101 runs sampled)
  @hapi/call        x  7,702,767 ops/sec ±0.13% (101 runs sampled)
  express           x  1,717,867 ops/sec ±1.13% (101 runs sampled)
  find-my-way       x  7,122,610 ops/sec ±0.07% (97 runs sampled)
  foxify (v0.10.20) x  7,724,358 ops/sec ±0.10% (101 runs sampled)
  koa-router        x    518,445 ops/sec ±0.08% (101 runs sampled)
  koa-tree-router   x 16,653,656 ops/sec ±0.98% (97 runs sampled)
  trek-router       x 14,710,307 ops/sec ±0.14% (101 runs sampled)

ℹ Benchmark: mixed-static-dynamic
  8 tests completed.

  @foxify/router    x 10,613,762 ops/sec ±0.10% (98 runs sampled)
  @hapi/call        x     71,785 ops/sec ±0.42% (99 runs sampled)
  express           x  1,573,792 ops/sec ±1.13% (99 runs sampled)
  find-my-way       x  6,669,980 ops/sec ±0.13% (100 runs sampled)
  foxify (v0.10.20) x  3,688,441 ops/sec ±0.10% (98 runs sampled)
  koa-router        x    510,452 ops/sec ±0.14% (98 runs sampled)
  koa-tree-router   x  9,869,396 ops/sec ±1.18% (99 runs sampled)
  trek-router       x  5,633,035 ops/sec ±0.32% (96 runs sampled)

ℹ Benchmark: short-static
  8 tests completed.

  @foxify/router    x 37,727,416 ops/sec ±0.90% (97 runs sampled)
  @hapi/call        x  8,682,625 ops/sec ±0.20% (98 runs sampled)
  express           x  4,041,365 ops/sec ±1.28% (101 runs sampled)
  find-my-way       x 21,244,359 ops/sec ±0.11% (97 runs sampled)
  foxify (v0.10.20) x 12,771,033 ops/sec ±0.12% (102 runs sampled)
  koa-router        x    519,810 ops/sec ±0.10% (101 runs sampled)
  koa-tree-router   x 40,063,841 ops/sec ±1.03% (99 runs sampled)
  trek-router       x 25,204,485 ops/sec ±0.12% (99 runs sampled)

ℹ Benchmark: static-same-radix
  8 tests completed.

  @foxify/router    x 14,837,342 ops/sec ±0.12% (101 runs sampled)
  @hapi/call        x  7,422,208 ops/sec ±1.03% (96 runs sampled)
  express           x  3,444,326 ops/sec ±0.11% (100 runs sampled)
  find-my-way       x  9,828,109 ops/sec ±0.12% (95 runs sampled)
  foxify (v0.10.20) x  6,404,150 ops/sec ±0.21% (101 runs sampled)
  koa-router        x    515,794 ops/sec ±1.08% (100 runs sampled)
  koa-tree-router   x 14,985,944 ops/sec ±0.13% (96 runs sampled)
  trek-router       x 10,780,324 ops/sec ±0.38% (98 runs sampled)

ℹ Benchmark: wildcard
  8 tests completed.

  @foxify/router    x  9,086,332 ops/sec ±0.28% (91 runs sampled)
  @hapi/call        x     75,390 ops/sec ±0.36% (101 runs sampled)
  express           x  1,201,229 ops/sec ±1.15% (98 runs sampled)
  find-my-way       x  8,262,315 ops/sec ±0.22% (100 runs sampled)
  foxify (v0.10.20) x  5,085,574 ops/sec ±0.14% (101 runs sampled)
  koa-router        x    517,188 ops/sec ±0.20% (99 runs sampled)
  koa-tree-router   x 10,086,690 ops/sec ±1.32% (97 runs sampled)
  trek-router       x  8,214,141 ops/sec ±0.28% (99 runs sampled)
```
