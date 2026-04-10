import { VirtualCache } from "../cache";
import { calculateItemHeight } from "../engine";
import { findVisibleRange } from "../virtualization";
import type { BoxModelConfig } from "../types";

export interface VirtualizerConfig<T> {
  scrollContainer: HTMLElement | null;
  items: T[];
  getText: (item: T) => string;
  getId: (item: T) => string | number;
  font: string;
  lineHeight: number;
  boxModel?: BoxModelConfig;
}

export interface VirtualItem<T> {
  item: T;
  index: number;
  offsetTop: number;
  height: number;
}

export class TextVirtualizer<T> {
  private config: VirtualizerConfig<T>;
  private cache: VirtualCache;
  private listeners: Set<() => void> = new Set();

  // The state that UI frameworks will care about
  public virtualItems: VirtualItem<T>[] = [];
  public totalHeight: number = 0;

  constructor(config: VirtualizerConfig<T>) {
    this.config = config;
    this.cache = new VirtualCache();

    // Bind our scroll listener so 'this' context isn't lost when attaching onScroll event to the DOM and always refers to TextVirtualizer class
    this.onScroll = this.onScroll.bind(this);

    if (this.config.scrollContainer) {
      this.attachScrollListener();
    }
  }

  //`listener` here is the callback which will run when the data has changed.
  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  //calling the listeners (notifying them to re-render)
  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public updateItems(newItems: T[]) {
    this.config.items = newItems;
    this.measureNewItems();
    this.calculateVisibleItems();
  }

  private measureNewItems() {
    if (!this.config.scrollContainer) return;
    const containerWidth = this.config.scrollContainer.clientWidth;

    this.config.items.forEach((item) => {
      const id = this.config.getId(item);
      const text = this.config.getText(item);

      if (this.cache.get(id) === undefined) {
        const height = calculateItemHeight(
          text,
          this.config.font,
          containerWidth,
          this.config.lineHeight,
          this.config.boxModel,
        );
        this.cache.set(id, height);
      }
    });

    this.totalHeight = this.cache.getTotalHeight();
  }

  private calculateVisibleItems() {
    if (!this.config.scrollContainer) return;

    const scrollTop = this.config.scrollContainer.scrollTop;
    const viewportHeight = this.config.scrollContainer.clientHeight;

    const { startIndex, endIndex } = findVisibleRange(
      scrollTop,
      viewportHeight,
      this.cache.itemOffsets,
      this.config.items.length,
    );

    const visible: VirtualItem<T>[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = this.config.items[i];
      if (item) {
        visible.push({
          item,
          index: i,
          offsetTop: this.cache.itemOffsets[i],
          height: this.cache.get(this.config.getId(item)) || 0,
        });
      }
    }

    this.virtualItems = visible;
    this.notify(); // notifying the consumers that array has changed
  }

  private attachScrollListener() {
    this.config.scrollContainer?.addEventListener("scroll", this.onScroll, {
      passive: true,
    });
  }

  public destroy() {
    this.config.scrollContainer?.removeEventListener("scroll", this.onScroll);
    this.listeners.clear();
  }

  private onScroll() {
    this.calculateVisibleItems();
  }
}
