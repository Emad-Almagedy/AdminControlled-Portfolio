import { useState, useEffect } from 'react';

const LightModeBackground = () => {
  const dotCount = 200;
  const [scrollY, setScrollY] = useState(0);
  const [dots] = useState(() =>
    Array.from({ length: dotCount }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 2 + Math.random() * 3,
    }))
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        zIndex: 5,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {dots.map((dot, index) => {
        const offsetX = (scrollY * 0.1 * (index % 5)) % 20;
        const offsetY = (scrollY * 0.1 * (index % 3)) % 20;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `calc(${dot.top}% + ${offsetY}px)`,
              left: `calc(${dot.left}% + ${offsetX}px)`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              backgroundColor: '#800080',
              borderRadius: '50%',
              opacity: 0.7,
              transition: 'top 0.2s ease, left 0.2s ease',
            }}
          />
        );
      })}
    </div>
  );
};

export default LightModeBackground;
