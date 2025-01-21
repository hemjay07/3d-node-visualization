import React, { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stats, Html } from '@react-three/drei';

const PerformanceMonitor = () => {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState({
    geometries: 0,
    textures: 0,
    nodes: 0
  });
  const frameCount = React.useRef(0);
  const lastTime = React.useRef(performance.now());
  const frameInterval = React.useRef(1000); // Update every second

  useFrame((state) => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= frameInterval.current) {
      // Calculate FPS
      const currentFps = Math.round(
        (frameCount.current * 1000) / (currentTime - lastTime.current)
      );
      setFps(currentFps);
      
      // Get memory stats
      const renderer = state.gl;
      setMemory({
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        nodes: document.querySelectorAll('[data-testid^="node-"]').length
      });
      
      // Reset counters
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  return (
    <group>
      <Stats />
      <Html
        as='div'
        className="performance-monitor"
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          pointerEvents: 'none'
        }}
        transform={false}
      >
        <div className="bg-black/70 text-white p-4 rounded-lg text-sm">
          <div>FPS: {fps}</div>
          <div>Geometries: {memory.geometries}</div>
          <div>Textures: {memory.textures}</div>
          <div>Total Nodes: {memory.nodes}</div>
        </div>
      </Html>
    </group>
  );
};

export default PerformanceMonitor;