# Benchmarks: @foxify/fresh

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v16.14.0)

```shell
ℹ Benchmark: etag-several
  2 tests completed.

  @foxify/fresh x 46,643,956 ops/sec ±0.08% (99 runs sampled)
  fresh         x  6,464,804 ops/sec ±0.15% (99 runs sampled)

ℹ Benchmark: etag-single
  2 tests completed.

  @foxify/fresh x 59,921,046 ops/sec ±0.22% (97 runs sampled)
  fresh         x 26,579,845 ops/sec ±1.25% (95 runs sampled)

ℹ Benchmark: etag-star
  2 tests completed.

  @foxify/fresh x 149,770,865 ops/sec ±0.24% (100 runs sampled)
  fresh         x 149,440,474 ops/sec ±0.30% (98 runs sampled)

ℹ Benchmark: modified
  2 tests completed.

  @foxify/fresh x 3,101,171 ops/sec ±0.08% (97 runs sampled)
  fresh         x 3,029,379 ops/sec ±0.14% (99 runs sampled)

ℹ Benchmark: not-modified
  2 tests completed.

  @foxify/fresh x 3,125,705 ops/sec ±0.10% (100 runs sampled)
  fresh         x 3,058,272 ops/sec ±0.09% (99 runs sampled)
```
