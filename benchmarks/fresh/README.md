# Benchmarks: @foxify/fresh

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v18.16.0)

```shell
ℹ Benchmark: etag-several
  2 tests completed.

  @foxify/fresh x 44,095,495 ops/sec ±0.28% (101 runs sampled)
  fresh         x  6,529,100 ops/sec ±0.22% (95 runs sampled)

ℹ Benchmark: etag-single
  2 tests completed.

  @foxify/fresh x 65,892,609 ops/sec ±0.23% (102 runs sampled)
  fresh         x 27,332,779 ops/sec ±2.37% (97 runs sampled)

ℹ Benchmark: etag-star
  2 tests completed.

  @foxify/fresh x 155,937,647 ops/sec ±0.08% (98 runs sampled)
  fresh         x 155,459,394 ops/sec ±0.09% (97 runs sampled)

ℹ Benchmark: modified
  2 tests completed.

  @foxify/fresh x 2,655,185 ops/sec ±0.28% (100 runs sampled)
  fresh         x 2,619,832 ops/sec ±0.12% (97 runs sampled)

ℹ Benchmark: not-modified
  2 tests completed.

  @foxify/fresh x 2,626,143 ops/sec ±0.12% (100 runs sampled)
  fresh         x 2,611,158 ops/sec ±0.17% (99 runs sampled)
```
