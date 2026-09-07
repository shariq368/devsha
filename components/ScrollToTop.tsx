import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll position on navigation.
 *  - `/#services` style links scroll (smoothly) to the matching section.
 *  - Any other route change jumps instantly to the top, so a new page never
 *    starts halfway down.
 */
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const targetId = hash.startsWith('#') ? hash.slice(1) : hash;

    if (targetId) {
      // Wait one frame so the newly routed page has been committed to the DOM.
      const frame = requestAnimationFrame(() => {
        // getElementById avoids querySelector throwing on ids that are not
        // valid CSS selectors (e.g. ones starting with a digit).
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
