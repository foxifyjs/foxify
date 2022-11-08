# Benchmarks: @foxify/fresh

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v16.14.0)

```shell
ℹ Benchmark: all
  8 tests completed.

  @foxify/router    x 1,950,200 ops/sec ±1.47% (95 runs sampled)
  @hapi/call        x    28,680 ops/sec ±1.13% (95 runs sampled)
  express           x   268,795 ops/sec ±0.34% (94 runs sampled)
  find-my-way       x 1,227,884 ops/sec ±0.13% (96 runs sampled)
  foxify (v0.10.20) x   755,563 ops/sec ±1.17% (98 runs sampled)
  koa-router        x    70,761 ops/sec ±0.68% (92 runs sampled)
  koa-tree-router   x 1,783,969 ops/sec ±0.95% (94 runs sampled)
  trek-router       x 1,280,772 ops/sec ±0.27% (100 runs sampled)

ℹ Benchmark: dynamic
  8 tests completed.

  @foxify/router    x 8,127,853 ops/sec ±0.62% (99 runs sampled)
  @hapi/call        x    73,263 ops/sec ±0.72% (96 runs sampled)
  express           x 1,574,286 ops/sec ±1.95% (90 runs sampled)
  find-my-way       x 5,018,009 ops/sec ±0.24% (98 runs sampled)
  foxify (v0.10.20) x 2,921,543 ops/sec ±0.54% (97 runs sampled)
  koa-router        x   421,499 ops/sec ±0.62% (91 runs sampled)
  koa-tree-router   x 6,390,167 ops/sec ±0.40% (97 runs sampled)
  trek-router       x 4,446,857 ops/sec ±1.42% (95 runs sampled)

ℹ Benchmark: long-static
  8 tests completed.

  @foxify/router    x 23,006,788 ops/sec ±0.51% (99 runs sampled)
  @hapi/call        x  6,770,120 ops/sec ±0.48% (95 runs sampled)
  express           x  1,422,545 ops/sec ±1.41% (96 runs sampled)
  find-my-way       x  6,904,620 ops/sec ±0.10% (98 runs sampled)
  foxify (v0.10.20) x  7,087,643 ops/sec ±0.23% (100 runs sampled)
  koa-router        x    426,161 ops/sec ±0.42% (94 runs sampled)
  koa-tree-router   x 15,707,509 ops/sec ±1.21% (98 runs sampled)
  trek-router       x 13,961,270 ops/sec ±0.37% (99 runs sampled)

ℹ Benchmark: mixed-static-dynamic
  8 tests completed.

  @foxify/router    x 9,680,897 ops/sec ±0.45% (98 runs sampled)
  @hapi/call        x    73,137 ops/sec ±0.51% (98 runs sampled)
  express           x 1,335,536 ops/sec ±0.94% (93 runs sampled)
  find-my-way       x 5,930,360 ops/sec ±1.93% (94 runs sampled)
  foxify (v0.10.20) x 3,403,936 ops/sec ±0.18% (98 runs sampled)
  koa-router        x   428,025 ops/sec ±0.27% (94 runs sampled)
  koa-tree-router   x 8,156,566 ops/sec ±0.17% (98 runs sampled)
  trek-router       x 4,974,644 ops/sec ±1.64% (96 runs sampled)

ℹ Benchmark: short-static
  8 tests completed.

  @foxify/router    x 31,316,683 ops/sec ±0.95% (90 runs sampled)
  @hapi/call        x  7,631,760 ops/sec ±0.22% (100 runs sampled)
  express           x  3,371,603 ops/sec ±2.23% (90 runs sampled)
  find-my-way       x 18,142,327 ops/sec ±0.64% (91 runs sampled)
  foxify (v0.10.20) x 10,688,875 ops/sec ±0.37% (95 runs sampled)
  koa-router        x    429,034 ops/sec ±0.81% (97 runs sampled)
  koa-tree-router   x 30,406,672 ops/sec ±0.71% (95 runs sampled)
  trek-router       x 20,882,810 ops/sec ±0.47% (96 runs sampled)

ℹ Benchmark: static-same-radix
  8 tests completed.

  @foxify/router    x 13,141,138 ops/sec ±0.30% (101 runs sampled)
  @hapi/call        x  7,057,598 ops/sec ±0.20% (97 runs sampled)
  express           x  2,794,889 ops/sec ±0.61% (91 runs sampled)
  find-my-way       x  8,731,622 ops/sec ±1.27% (100 runs sampled)
  foxify (v0.10.20) x  5,658,904 ops/sec ±0.20% (100 runs sampled)
  koa-router        x    422,826 ops/sec ±0.51% (93 runs sampled)
  koa-tree-router   x 12,644,381 ops/sec ±0.24% (101 runs sampled)
  trek-router       x  9,608,634 ops/sec ±1.25% (98 runs sampled)

ℹ Benchmark: wildcard
  8 tests completed.

  @foxify/router    x 7,903,971 ops/sec ±0.36% (96 runs sampled)
  @hapi/call        x    71,051 ops/sec ±0.36% (96 runs sampled)
  express           x 1,060,200 ops/sec ±0.23% (100 runs sampled)
  find-my-way       x 7,455,922 ops/sec ±1.21% (90 runs sampled)
  foxify (v0.10.20) x 4,471,981 ops/sec ±0.38% (99 runs sampled)
  koa-router        x   426,707 ops/sec ±0.39% (95 runs sampled)
  koa-tree-router   x 8,453,444 ops/sec ±0.46% (94 runs sampled)
  trek-router       x 6,987,457 ops/sec ±0.41% (96 runs sampled)
```
