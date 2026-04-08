import type { MeasurementCache } from "./types";

export class VirtualCache {
  private heights: MeasurementCache = {}; // storing the height of messages
  private totalHeight: number = 0;
  private itemIds: (string | number)[] = []; // chronologically ordered set of item ids

  set(id: string | number, height: number) {
    const isNew = !(id in this.heights);
    const oldHeight = this.heights[id] || 0;

    this.heights[id] = height;

    if (isNew) {
      this.itemIds.push(id);
      this.totalHeight += height;
    } else {
      this.totalHeight += height - oldHeight;
    }
  }

  get(id: string | number): number | undefined {
    return this.heights[id];
  }

  getTotalHeight(): number {
    return this.totalHeight;
  }
}
