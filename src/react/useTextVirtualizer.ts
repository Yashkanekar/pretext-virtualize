import { useRef, useEffect, useSyncExternalStore } from "react";
import { TextVirtualizer } from "../core/TextVirtualizer";
import type { VirtualizerConfig } from "../core/TextVirtualizer";

export type UseTextVirtualizerProps<T> = Omit<
  VirtualizerConfig<T>,
  "scrollContainer"
>;

export function useTextVirtualizer<T>(config: UseTextVirtualizerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualizerRef = useRef<TextVirtualizer<T> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    virtualizerRef.current = new TextVirtualizer({
      ...config,
      scrollContainer: containerRef.current,
    });

    virtualizerRef.current.updateItems(config.items);

    return () => {
      virtualizerRef.current?.destroy();
    };
  }, []);

  // updating the maths when list items change
  useEffect(() => {
    if (virtualizerRef.current) {
      virtualizerRef.current.updateItems(config.items);
    }
  }, [config.items]);

  const virtualItems = useSyncExternalStore(
    // callback is passed by react internally which triggers re render of the component
    (callback) => {
      if (!virtualizerRef.current) return () => {};
      return virtualizerRef.current.subscribe(callback);
    },
    // getting the current state snapshot
    () => virtualizerRef.current?.virtualItems || [],
  );

  return {
    containerRef,
    virtualItems,
    totalHeight: virtualizerRef.current?.totalHeight || 0, // The height of the inner scroll canvas
  };
}
