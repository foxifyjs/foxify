# Benchmarks: @foxify/fresh

> Machine: MacBook Pro 2021 (M1 Max, 32GB RAM, Node.js v16.14.0)

```shell
ℹ Benchmark: etag-several
  2 tests completed.

  @foxify/fresh x 48,316,492 ops/sec ±0.82% (97 runs sampled)
  fresh         x  6,563,885 ops/sec ±0.41% (100 runs sampled)

ℹ Benchmark: etag-single
  2 tests completed.

  @foxify/fresh x 73,500,837 ops/sec ±0.70% (94 runs sampled)
  fresh         x 28,929,002 ops/sec ±1.01% (98 runs sampled)

ℹ Benchmark: etag-star
  2 tests completed.

  @foxify/fresh x 155,464,271 ops/sec ±0.10% (102 runs sampled)
  fresh         x 155,992,396 ops/sec ±0.10% (97 runs sampled)

ℹ Benchmark: modified
  2 tests completed.

  @foxify/fresh x 3,204,772 ops/sec ±0.12% (101 runs sampled)
  fresh         x 3,137,808 ops/sec ±0.19% (96 runs sampled)

ℹ Benchmark: not-modified
  2 tests completed.

  @foxify/fresh x 3,226,916 ops/sec ±0.16% (99 runs sampled)
  fresh         x 3,164,220 ops/sec ±0.12% (99 runs sampled)
```
