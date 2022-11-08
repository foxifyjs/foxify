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
 * Map function to add index value to ranges.
 * @private
 */
const mapWithIndex = (range: RangeI, index: number): { end: number; index: number; start: number } => ({
  index,
  end  : range.end,
  start: range.start,
});

/**
 * Map function to remove index value from ranges.
 * @private
 */
const mapWithoutIndex = (range: RangeI): { end: number; start: number } => ({
  end  : range.end,
  start: range.start,
});

/**
 * Sort function to sort ranges by index.
 * @private
 */
const sortByRangeIndex = (a: any, b: any): number => a.index - b.index;

/**
 * Sort function to sort ranges by start position.
 * @private
 */
const sortByRangeStart = (a: RangeI, b: RangeI): number => a.start - b.start;

/**
 * Combine overlapping & adjacent ranges.
 * @private
 */
const combineRanges = (ranges: RangesI): RangesI => {
  const ordered = ranges.map(mapWithIndex).sort(sortByRangeStart);

  let j = 0;
  for (let i = 1; i < ordered.length; i++) {
    const range = ordered[i];
    const current = ordered[j];

    // Next range
    if (range.start > current.end + 1) {
      ordered[++j] = range;
    } else if (range.end > current.end) {
      // Extend range
      current.end = range.end;
      current.index = Math.min(current.index, range.index);
    }
  }

  // Trim ordered array
  ordered.length = j + 1;

  // Generate combined range
  const combined: RangesI = ordered
    .sort(sortByRangeIndex)
    .map(mapWithoutIndex) as any;

  // Copy ranges type
  combined.type = ranges.type;

  return combined;
};

/**
 * Parse "Range" header `str` relative to the given file `size`.
 *
 * @public
 */
const rangeParser = (
  size: number,
  str: string,
  combine = false,
): RangesI | RESULT => {
  const index = str.indexOf("=");

  if (index === -1) return -2;

  // Split the range string
  const arr = str.slice(index + 1).split(",");
  const ranges: RangesI = [] as any;

  // Add ranges type
  ranges.type = str.slice(0, index);

  // Parse all ranges
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < arr.length; i++) {
    const range = arr[i].split("-");
    let start = parseInt(range[0]);
    let end = parseInt(range[1]);

    // -nnn
    if (isNaN(start)) {
      start = size - end;
      end = size - 1;

      // Nnn-
    } else if (isNaN(end)) {
      end = size - 1;
    }

    // Limit last-byte-pos to current length
    if (end > size - 1) end = size - 1;

    // Invalid or unsatisifiable
    if (isNaN(start) || isNaN(end) || start > end || start < 0) continue;

    // Add range
    ranges.push({
      start,
      end,
    });
  }

  // Unsatisifiable
  if (ranges.length < 1) return -1;

  return combine ? combineRanges(ranges) : ranges;
};

export default rangeParser;

export interface RangesI extends Array<RangeI> {
  type: string;
}

export interface RangeI {
  end: number;
  start: number;
}

export const enum RESULT {
  INVALID = -2,
  UNSATISIFIABLE = -1,
}
