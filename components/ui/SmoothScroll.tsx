import React, { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const isTouchDevice = useRef(false);
  const targetY = useRef(0);
  const currentY = useRef(0);
  const animFrameId = useRef<number | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    // Detect mobile/touch devices
    isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice.current) {
      return;
    }

    currentY.current = window.scrollY;
    targetY.current = window.scrollY;

    const getMaxScroll = () =>
      Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

    const updateScroll = () => {
      const diff = targetY.current - currentY.current;

      if (Math.abs(diff) > 0.2) {
        // High quality smooth lerp easing (0.12 for fast responsive momentum)
        currentY.current += diff * 0.12;
        window.scrollTo({ top: currentY.current, behavior: 'instant' as ScrollBehavior });
        animFrameId.current = requestAnimationFrame(updateScroll);
      } else {
        currentY.current = targetY.current;
        window.scrollTo({ top: currentY.current, behavior: 'instant' as ScrollBehavior });
        isAnimating.current = false;
        animFrameId.current = null;
      }
    };

    const startAnimation = () => {
      if (!isAnimating.current) {
        isAnimating.current = true;
        animFrameId.current = requestAnimationFrame(updateScroll);
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Allow native scrolling inside elements with overflow scrollable content
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body && el !== document.documentElement) {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight
        ) {
          return;
        }
        el = el.parentElement;
      }

      // Trackpad detection: trackpads emit high-frequency small fractional deltas
      const isTrackpad = Math.abs(e.deltaY) < 50 && !Number.isInteger(e.deltaY);
      if (isTrackpad) {
        // Allow trackpad to scroll with native gesture momentum and 0 latency
        return;
      }

      e.preventDefault();

      const maxScroll = getMaxScroll();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 30; // line mode
      if (e.deltaMode === 2) delta *= window.innerHeight; // page mode

      targetY.current = Math.min(
        Math.max(0, targetY.current + delta),
        maxScroll
      );

      startAnimation();
    };

    const onNativeScroll = () => {
      if (!isAnimating.current) {
        currentY.current = window.scrollY;
        targetY.current = window.scrollY;
      }
    };

    const onResize = () => {
      const maxScroll = getMaxScroll();
      targetY.current = Math.min(targetY.current, maxScroll);
      currentY.current = Math.min(currentY.current, maxScroll);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('resize', onResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
