import type { MeasurementCache } from "./types";

export class VirtualCache {
  private heights: MeasurementCache = {}; // storing the height of messages
  private totalHeight: number = 0;
  private itemIds: (string | number)[] = []; // chronologically ordered set of item ids
  public itemOffsets: number[] = [];

  set(id: string | number, height: number) {
    const isNew = !(id in this.heights);
    const oldHeightOfItem = this.heights[id] || 0;

    this.heights[id] = height;

    if (isNew) {
      this.itemIds.push(id); // id of the list item
      this.totalHeight += height;
      this.itemOffsets.push(this.totalHeight - height); // adding the offset for the new item (it is whatever the total height was before adding the item)
    } else {
      this.totalHeight += height - oldHeightOfItem; // if the item is not new then add the new height of the item to the total height and remove the old height
    }
  }

  get(id: string | number): number | undefined {
    return this.heights[id];
  }

  getTotalHeight(): number {
    return this.totalHeight;
  }

  clear() {
    this.heights = {};
    this.totalHeight = 0;
    this.itemIds = [];
    this.itemOffsets = [];
  }
}
