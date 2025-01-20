import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function  Connection ({ start, end, startColor, endColor }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.2} 
          linewidth={1}
          depthWrite={false}
        />
      </line>

      <line geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#4dffff" 
          transparent 
          opacity={0.1} 
          linewidth={1.5}
        />
      </line>

      <mesh position={start}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial 
          color={startColor} 
          transparent 
          opacity={0.7}
        />
      </mesh>

      <mesh position={end}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial 
          color={endColor} 
          transparent 
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};