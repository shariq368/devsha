import React, { useEffect, useRef, useState } from 'react';

// Elements that need the real system caret/cursor to stay usable.
const NATIVE_CURSOR_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const position = useRef({ x: 0, y: 0 });
  const followerPosition = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // Hidden while the pointer is outside the window or over a text field, where
  // the native caret is shown instead.
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    // Only take over the cursor on devices with a real pointer.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setIsEnabled(true);

    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    /*
     * The blanket rule used to cover form fields too, which made the text caret
     * invisible in the contact form. Text-entry elements are opted back out.
     */
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
      ${NATIVE_CURSOR_SELECTOR} { cursor: auto !important; }
    `;
    document.head.appendChild(style);

    const onMouseMove = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };

      if (!hasMoved.current) {
        hasMoved.current = true;
        // Start the follower at the same spot so it doesn't fly in from 0,0.
        followerPosition.current = { x: e.clientX, y: e.clientY };
        setIsHidden(false);
      }

      // Move the dot instantly; the ring eases towards it in the rAF loop.
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') return;

      // Over a text field the native caret is visible, so hide the custom one.
      if (target.closest(NATIVE_CURSOR_SELECTOR)) {
        setIsHidden(true);
        setIsHovering(false);
        return;
      }

      if (hasMoved.current) setIsHidden(false);

      /*
       * The old implementation also tested getComputedStyle(target).cursor for
       * 'pointer', but the injected `cursor: none !important` rule makes that
       * always report 'none'. Structural checks are what actually work here.
       */
      setIsHovering(
        Boolean(target.closest('button, a, [role="button"], .cursor-pointer, label, summary'))
      );
    };

    const onWindowLeave = () => setIsHidden(true);
    const onWindowEnter = () => {
      if (hasMoved.current) setIsHidden(false);
    };

    let animationFrameId = 0;
    const animate = () => {
      const ease = 0.15;
      followerPosition.current.x += (position.current.x - followerPosition.current.x) * ease;
      followerPosition.current.y += (position.current.y - followerPosition.current.y) * ease;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPosition.current.x}px, ${followerPosition.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onWindowLeave);
    document.addEventListener('mouseenter', onWindowEnter);
    window.addEventListener('blur', onWindowLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onWindowLeave);
      document.removeEventListener('mouseenter', onWindowEnter);
      window.removeEventListener('blur', onWindowLeave);
      cancelAnimationFrame(animationFrameId);
      style.remove();
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-2.5 h-2.5 bg-brand-primary rounded-full pointer-events-none z-[100] shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-opacity duration-200 ${isHidden ? 'opacity-0' : 'opacity-100'
          }`}
        style={{ willChange: 'transform' }}
      />
      {/* Follower Ring */}
      <div
        ref={followerRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 border border-brand-primary/50 rounded-full pointer-events-none z-[99] transition-all duration-300 ease-out ${isHidden ? 'opacity-0' : isHovering ? 'opacity-100' : 'opacity-60'
          } ${isHovering ? 'w-12 h-12 bg-brand-primary/10 border-brand-primary' : 'w-8 h-8'}`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;
