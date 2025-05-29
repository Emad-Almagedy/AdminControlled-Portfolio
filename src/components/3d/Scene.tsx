import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

const InteractiveStars = () => {
  const starsRef = useRef<THREE.Points>(null);
  const { theme } = useTheme();

  useFrame(({ mouse, viewport }) => {
    if (starsRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      starsRef.current.rotation.x = THREE.MathUtils.lerp(starsRef.current.rotation.x, y * 0.1, 0.1);
      starsRef.current.rotation.y = THREE.MathUtils.lerp(starsRef.current.rotation.y, x * 0.1, 0.1);
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={50}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={2}
      color={theme === 'dark' ? '#6366F1' : '#800080'} // purple in light mode
    />
  );
};

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
        // Calculate offset for interactive gesture based on scrollY and dot index
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

const Scene = () => {
  const { theme } = useTheme();
  const { camera } = useThree();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    // Adjust camera position or rotation based on scrollY for parallax effect
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, scrollY * 0.01, 0.1);
  });

  return (
    <>
      {theme === 'light' && <LightModeBackground />}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          zIndex: 10,
          opacity: theme === 'dark' ? 0.6 : 0.9,
          backgroundColor: theme === 'dark' ? '#1a202c' : 'transparent',
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <InteractiveStars />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </>
  );
};

export default Scene;
