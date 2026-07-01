import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAnimationFrame, useReducedMotion } from "motion/react";

const DEFAULT_PX_PER_SECOND = 40;
const DEFAULT_DRAG_THRESHOLD_PX = 6;

function wrapMarqueeOffset(offset: number, groupWidth: number): number {
  if (groupWidth <= 0) return offset;
  let wrapped = offset % groupWidth;
  if (wrapped > 0) wrapped -= groupWidth;
  return wrapped;
}

interface UseMarqueeDragOptions {
  pxPerSecond?: number;
  dragThresholdPx?: number;
  /** Pause auto-scroll while the page is scrolling. */
  scrollPauseMs?: number;
  /** When false, logos stay draggable but do not auto-scroll. */
  autoScroll?: boolean;
}

export function useMarqueeDrag({
  pxPerSecond = DEFAULT_PX_PER_SECOND,
  dragThresholdPx = DEFAULT_DRAG_THRESHOLD_PX,
  scrollPauseMs = 120,
  autoScroll = true,
}: UseMarqueeDragOptions = {}) {
  const prefersReducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureGroupRef = useRef<HTMLDivElement>(null);
  const [groupWidth, setGroupWidth] = useState(0);
  const [copies, setCopies] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const isScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef<number | null>(null);
  const dragSessionRef = useRef({
    active: false,
    startX: 0,
    startOffset: 0,
    moved: false,
  });

  const applyTrackOffset = useCallback((offset: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const group = measureGroupRef.current;
    if (!viewport || !group) return;

    const measure = () => {
      const vw = viewport.clientWidth;
      const gw = group.offsetWidth;
      if (gw <= 0 || vw <= 0) return;

      setGroupWidth(gw);
      setCopies(Math.max(2, Math.ceil(vw / gw) + 1));
      offsetRef.current = wrapMarqueeOffset(offsetRef.current, gw);
      applyTrackOffset(offsetRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(group);
    return () => ro.disconnect();
  }, [applyTrackOffset]);

  useEffect(() => {
    const onScroll = () => {
      isScrollingRef.current = true;
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        lastFrameRef.current = null;
        scrollEndTimerRef.current = null;
      }, scrollPauseMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollEndTimerRef.current !== null) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [scrollPauseMs]);

  useAnimationFrame((time) => {
    if (
      !autoScroll ||
      prefersReducedMotion ||
      dragSessionRef.current.active ||
      isHoveredRef.current ||
      isScrollingRef.current ||
      groupWidth <= 0
    ) {
      return;
    }

    if (lastFrameRef.current === null) {
      lastFrameRef.current = time;
      return;
    }

    const dt = (time - lastFrameRef.current) / 1000;
    lastFrameRef.current = time;
    offsetRef.current = wrapMarqueeOffset(
      offsetRef.current - pxPerSecond * dt,
      groupWidth,
    );
    applyTrackOffset(offsetRef.current);
  });

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as Element).closest("a[href]")) return;
    dragSessionRef.current = {
      active: true,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
    };
    setIsDragging(true);
    lastFrameRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragSessionRef.current.active || groupWidth <= 0) return;

      const deltaX = event.clientX - dragSessionRef.current.startX;
      if (Math.abs(deltaX) > dragThresholdPx) {
        dragSessionRef.current.moved = true;
      }

      offsetRef.current = wrapMarqueeOffset(
        dragSessionRef.current.startOffset + deltaX,
        groupWidth,
      );
      applyTrackOffset(offsetRef.current);
    },
    [applyTrackOffset, dragThresholdPx, groupWidth],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragSessionRef.current.active) return;
    dragSessionRef.current.active = false;
    setIsDragging(false);
    lastFrameRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (dragSessionRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragSessionRef.current.moved = false;
    }
  }, []);

  const handleViewportPointerEnter = useCallback(() => {
    isHoveredRef.current = true;
    lastFrameRef.current = null;
  }, []);

  const handleViewportPointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    lastFrameRef.current = null;
  }, []);

  return {
    viewportRef,
    trackRef,
    measureGroupRef,
    copies,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    endDrag,
    handleClickCapture,
    handleViewportPointerEnter,
    handleViewportPointerLeave,
  };
}
