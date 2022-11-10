# Benchmarks: @foxify/fresh

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v16.18.1)

```shell
ℹ Benchmark: etag-several
  2 tests completed.

  @foxify/fresh x 47,103,707 ops/sec ±0.47% (98 runs sampled)
  fresh         x  6,423,142 ops/sec ±1.57% (96 runs sampled)

ℹ Benchmark: etag-single
  2 tests completed.

  @foxify/fresh x 73,215,219 ops/sec ±0.60% (95 runs sampled)
  fresh         x 27,515,583 ops/sec ±0.48% (97 runs sampled)

ℹ Benchmark: etag-star
  2 tests completed.

  @foxify/fresh x 152,887,040 ops/sec ±0.25% (98 runs sampled)
  fresh         x 152,544,290 ops/sec ±0.24% (99 runs sampled)

ℹ Benchmark: modified
  2 tests completed.

  @foxify/fresh x 3,150,865 ops/sec ±0.33% (97 runs sampled)
  fresh         x 3,111,177 ops/sec ±0.31% (100 runs sampled)

ℹ Benchmark: not-modified
  2 tests completed.

  @foxify/fresh x 3,179,671 ops/sec ±0.25% (98 runs sampled)
  fresh         x 3,143,671 ops/sec ±0.12% (97 runs sampled)
```
