# Benchmarks: @foxify/fresh

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v16.14.0)

```shell
ℹ Benchmark: etag-several
  2 tests completed.

  @foxify/fresh x 47,660,237 ops/sec ±0.18% (99 runs sampled)
  fresh         x  6,465,652 ops/sec ±0.80% (96 runs sampled)

ℹ Benchmark: etag-single
  2 tests completed.

  @foxify/fresh x 60,990,697 ops/sec ±0.50% (100 runs sampled)
  fresh         x 28,459,834 ops/sec ±0.33% (99 runs sampled)

ℹ Benchmark: etag-star
  2 tests completed.

  @foxify/fresh x 154,660,013 ops/sec ±0.11% (99 runs sampled)
  fresh         x 155,164,859 ops/sec ±0.11% (99 runs sampled)

ℹ Benchmark: modified
  2 tests completed.

  @foxify/fresh x 3,178,965 ops/sec ±0.19% (98 runs sampled)
  fresh         x 3,103,903 ops/sec ±0.19% (99 runs sampled)

ℹ Benchmark: not-modified
  2 tests completed.

  @foxify/fresh x 3,187,981 ops/sec ±0.24% (98 runs sampled)
  fresh         x 3,150,836 ops/sec ±0.22% (94 runs sampled)
```
