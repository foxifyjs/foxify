# Benchmarks: @foxify/router

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v16.18.1)

```shell
ℹ Benchmark: all
  8 tests completed.

  @foxify/router    x 2,094,175 ops/sec ±1.38% (95 runs sampled)
  @hapi/call        x    29,602 ops/sec ±1.57% (89 runs sampled)
  express           x   283,068 ops/sec ±0.21% (98 runs sampled)
  find-my-way       x 1,295,500 ops/sec ±0.15% (102 runs sampled)
  foxify (v0.10.20) x   798,539 ops/sec ±0.16% (96 runs sampled)
  koa-router        x    77,284 ops/sec ±1.32% (101 runs sampled)
  koa-tree-router   x 1,928,501 ops/sec ±0.13% (101 runs sampled)
  trek-router       x 1,355,730 ops/sec ±0.12% (101 runs sampled)

ℹ Benchmark: dynamic
  8 tests completed.

  @foxify/router    x 8,661,761 ops/sec ±0.17% (97 runs sampled)
  @hapi/call        x    80,963 ops/sec ±0.42% (99 runs sampled)
  express           x 1,732,694 ops/sec ±1.53% (98 runs sampled)
  find-my-way       x 5,313,683 ops/sec ±0.17% (98 runs sampled)
  foxify (v0.10.20) x 3,123,696 ops/sec ±0.13% (101 runs sampled)
  koa-router        x   436,815 ops/sec ±0.17% (100 runs sampled)
  koa-tree-router   x 7,011,714 ops/sec ±1.61% (98 runs sampled)
  trek-router       x 4,812,296 ops/sec ±0.11% (99 runs sampled)

ℹ Benchmark: long-static
  8 tests completed.

  @foxify/router    x 24,982,636 ops/sec ±0.48% (94 runs sampled)
  @hapi/call        x  6,974,647 ops/sec ±1.20% (99 runs sampled)
  express           x  1,590,617 ops/sec ±0.19% (97 runs sampled)
  find-my-way       x  7,261,639 ops/sec ±0.27% (99 runs sampled)
  foxify (v0.10.20) x  7,583,917 ops/sec ±0.21% (101 runs sampled)
  koa-router        x    451,456 ops/sec ±0.23% (99 runs sampled)
  koa-tree-router   x 16,653,176 ops/sec ±1.15% (98 runs sampled)
  trek-router       x 14,818,990 ops/sec ±0.47% (97 runs sampled)

ℹ Benchmark: mixed-static-dynamic
  8 tests completed.

  @foxify/router    x 10,429,457 ops/sec ±0.41% (98 runs sampled)
  @hapi/call        x     80,263 ops/sec ±0.43% (100 runs sampled)
  express           x  1,494,769 ops/sec ±0.19% (98 runs sampled)
  find-my-way       x  6,707,212 ops/sec ±0.26% (96 runs sampled)
  foxify (v0.10.20) x  3,600,248 ops/sec ±0.16% (99 runs sampled)
  koa-router        x    444,153 ops/sec ±0.20% (99 runs sampled)
  koa-tree-router   x  8,979,453 ops/sec ±1.37% (98 runs sampled)
  trek-router       x  5,439,834 ops/sec ±0.21% (101 runs sampled)

ℹ Benchmark: short-static
  8 tests completed.

  @foxify/router    x 38,541,754 ops/sec ±0.21% (96 runs sampled)
  @hapi/call        x  8,213,321 ops/sec ±1.17% (100 runs sampled)
  express           x  3,855,977 ops/sec ±0.18% (99 runs sampled)
  find-my-way       x 21,863,356 ops/sec ±0.21% (101 runs sampled)
  foxify (v0.10.20) x 12,047,827 ops/sec ±0.17% (102 runs sampled)
  koa-router        x    454,774 ops/sec ±1.30% (98 runs sampled)
  koa-tree-router   x 39,007,764 ops/sec ±0.24% (100 runs sampled)
  trek-router       x 25,026,169 ops/sec ±0.19% (100 runs sampled)

ℹ Benchmark: static-same-radix
  8 tests completed.

  @foxify/router    x 14,908,066 ops/sec ±0.19% (101 runs sampled)
  @hapi/call        x  7,819,902 ops/sec ±1.25% (96 runs sampled)
  express           x  3,214,901 ops/sec ±0.18% (97 runs sampled)
  find-my-way       x  9,866,692 ops/sec ±0.22% (100 runs sampled)
  foxify (v0.10.20) x  6,170,120 ops/sec ±0.35% (96 runs sampled)
  koa-router        x    450,060 ops/sec ±1.34% (98 runs sampled)
  koa-tree-router   x 14,450,346 ops/sec ±0.24% (100 runs sampled)
  trek-router       x 10,707,325 ops/sec ±0.21% (99 runs sampled)

ℹ Benchmark: wildcard
  8 tests completed.

  @foxify/router    x 9,340,441 ops/sec ±0.15% (100 runs sampled)
  @hapi/call        x    79,575 ops/sec ±0.59% (98 runs sampled)
  express           x 1,169,660 ops/sec ±0.19% (96 runs sampled)
  find-my-way       x 8,455,352 ops/sec ±0.31% (100 runs sampled)
  foxify (v0.10.20) x 4,956,228 ops/sec ±0.24% (96 runs sampled)
  koa-router        x   443,569 ops/sec ±0.18% (100 runs sampled)
  koa-tree-router   x 9,560,915 ops/sec ±1.51% (99 runs sampled)
  trek-router       x 8,116,725 ops/sec ±0.21% (100 runs sampled)
```
