/**
 * (The MIT License)
 *
 * Copyright (c) 2012-2014 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright (c) 2015-2016 Douglas Christopher Wilson <doug@somethingdoug.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * This module is modified and optimized for Foxify specifically
 */

/**
 * Combine overlapping & adjacent ranges.
 * @private
 */
const combineRanges = (ranges: RangeParser.Ranges) => {
  const ordered = ranges.map(mapWithIndex).sort(sortByRangeStart);

  let j = 0;
  for (let i = 1; i < ordered.length; i++) {
    const range = ordered[i];
    const current = ordered[j];

    // next range
    if (range.start > current.end + 1) ordered[++j] = range;
    else if (range.end > current.end) {
      // extend range
      current.end = range.end;
      current.index = Math.min(current.index, range.index);
    }
  }

  // trim ordered array
  ordered.length = j + 1;

  // generate combined range
  const combined: RangeParser.Ranges = ordered.sort(sortByRangeIndex).map(mapWithoutIndex) as any;

  // copy ranges type
  combined.type = ranges.type;

  return combined;
};

/**
 * Map function to add index value to ranges.
 * @private
 */
const mapWithIndex = (range: RangeParser.Range, index: number) => ({
  start: range.start,
  end: range.end,
  index,
});

/**
 * Map function to remove index value from ranges.
 * @private
 */
const mapWithoutIndex = (range: RangeParser.Range) => ({
  start: range.start,
  end: range.end,
});

/**
 * Sort function to sort ranges by index.
 * @private
 */
const sortByRangeIndex = (a: any, b: any) => a.index - b.index;

/**
 * Sort function to sort ranges by start position.
 * @private
 */
const sortByRangeStart = (a: RangeParser.Range, b: RangeParser.Range) => a.start - b.start;

/**
 * Parse "Range" header `str` relative to the given file `size`.
 *
 * @public
 */
const rangeParser = (
  size: number,
  str: string,
  combine: boolean = false
): RangeParser.Result | RangeParser.Ranges => {
  const index = str.indexOf("=");

  if (index === -1) return -2;

  // split the range string
  const arr = str.slice(index + 1).split(",");
  const ranges: RangeParser.Ranges = [] as any;

  // add ranges type
  ranges.type = str.slice(0, index);

  // parse all ranges
  for (let i = 0; i < arr.length; i++) {
    const range = arr[i].split("-");
    let start = parseInt(range[0], 10);
    let end = parseInt(range[1], 10);

    // -nnn
    if (isNaN(start)) {
      start = size - end;
      end = size - 1;
      // nnn-
    } else if (isNaN(end)) end = size - 1;

    // limit last-byte-pos to current length
    if (end > size - 1) end = size - 1;

    // invalid or unsatisifiable
    if (isNaN(start) || isNaN(end) || start > end || start < 0) continue;

    // add range
    ranges.push({ start, end });
  }

  // unsatisifiable
  if (ranges.length < 1) return -1;

  return combine
    ? combineRanges(ranges)
    : ranges;
};

export default rangeParser;

export namespace RangeParser {
  export interface Ranges extends Array<Range> {
    type: string;
  }

  export interface Range {
    start: number;
    end: number;
  }

  export const enum Result {
    invaild = -2,
    unsatisifiable = -1,
  }
}
