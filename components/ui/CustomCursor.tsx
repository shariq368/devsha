import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const position = useRef({ x: 0, y: 0 });
  const followerPosition = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only show custom cursor on devices that support hover (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsVisible(true);
      // Hide the default system cursor globally
      document.documentElement.style.cursor = 'none';
      document.body.style.cursor = 'none';
      // Add a style tag for all elements
      const style = document.createElement('style');
      style.id = 'custom-cursor-style';
      style.textContent = '*, *::before, *::after { cursor: none !important; }';
      document.head.appendChild(style);
    } else {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };

      // Move dot instantly
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for interactive elements
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(!!isInteractive);
    };

    let animationFrameId: number;
    const animate = () => {
      // Linear interpolation for smooth follower movement
      const ease = 0.15;
      followerPosition.current.x += (position.current.x - followerPosition.current.x) * ease;
      followerPosition.current.y += (position.current.y - followerPosition.current.y) * ease;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPosition.current.x}px, ${followerPosition.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animationFrameId);
      // Restore default cursor on cleanup
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      const style = document.getElementById('custom-cursor-style');
      if (style) style.remove();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-brand-primary rounded-full pointer-events-none z-[100] shadow-[0_0_10px_rgba(34,197,94,0.5)]"
        style={{ willChange: 'transform' }}
      />
      {/* Follower Ring */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 border border-brand-primary/50 rounded-full pointer-events-none z-[99] transition-all duration-300 ease-out ${isHovering ? 'w-12 h-12 bg-brand-primary/10 border-brand-primary' : 'w-8 h-8 opacity-60'
          }`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;