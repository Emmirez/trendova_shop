import { useEffect, useRef } from 'react';

const useCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let fx = 0, fy = 0;
    let animId;

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      fx += (e.clientX - fx) * 0.18;
      fy += (e.clientY - fy) * 0.18;
    };

    const animate = () => {
      if (follower) {
        const x = parseFloat(cursor.style.left) || 0;
        const y = parseFloat(cursor.style.top) || 0;
        fx += (x - fx) * 0.15;
        fy += (y - fy) * 0.15;
        follower.style.left = `${fx}px`;
        follower.style.top = `${fy}px`;
      }
      animId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', moveCursor);
    animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(animId);
    };
  }, []);

  return { cursorRef, followerRef };
};

export default useCursor;
