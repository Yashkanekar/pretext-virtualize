export interface VisibleRange {
  startIndex: number;
  endIndex: number;
}

/**
 * Finds the range of items that should be visible in the viewport.
 * Uses Binary Search because row offsets are always increasing.
 */
export function findVisibleRange(
  scrollTop: number,
  viewportHeight: number,
  itemOffsets: number[], // An array of cumulative offsets (pre-calculated)
  totalItems: number,
): VisibleRange {
  //finding the closest offset item value from the total scroll from top of the container
  let startIndex = findStartIndex(itemOffsets, scrollTop);

  // finding the end index by adding the viewport height to the total scroll from top of the container
  let endIndex = findStartIndex(itemOffsets, scrollTop + viewportHeight);

  return {
    startIndex: Math.max(0, startIndex - 2),
    endIndex: Math.min(totalItems - 1, endIndex + 2),
  };
}

function findStartIndex(offsets: number[], scrollTop: number): number {
  let low = 0;
  let high = offsets.length - 1;
  let ans = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (offsets[mid] <= scrollTop) {
      ans = mid;
      low = mid + 1; // check if a larger one that is still <= scrollTop
    } else {
      high = mid - 1; // Too far down, look higher up
    }
  }
  return ans;
}
