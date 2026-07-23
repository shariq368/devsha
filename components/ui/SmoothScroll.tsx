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
    // Detect fine pointer (mouse/trackpad) vs touch
    isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice.current) {
      // On mobile touch devices, use native smooth scroll for native 120Hz gestures
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

      if (Math.abs(diff) > 0.3) {
        // High quality smooth lerp easing
        currentY.current += diff * 0.09;
        window.scrollTo(0, currentY.current);
        animFrameId.current = requestAnimationFrame(updateScroll);
      } else {
        currentY.current = targetY.current;
        window.scrollTo(0, currentY.current);
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

      e.preventDefault();

      const maxScroll = getMaxScroll();
      // Normalize wheel delta across browsers
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40; // line mode
      if (e.deltaMode === 2) delta *= window.innerHeight; // page mode

      targetY.current = Math.min(
        Math.max(0, targetY.current + delta),
        maxScroll
      );

      startAnimation();
    };

    const onNativeScroll = () => {
      // Keep target in sync if browser scrolls outside wheel event (e.g. scrollbar drag)
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
