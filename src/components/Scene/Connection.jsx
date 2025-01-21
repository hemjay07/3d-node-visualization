import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Shared geometries and materials for all connections
const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);

// Multiple line materials for thickness effect
const baseLineMaterials = [
  new THREE.LineBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  }),
  new THREE.LineBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.3,
    depthWrite: false
  })
];

const glowLineMaterials = [
  new THREE.LineBasicMaterial({
    color: "#4dffff",
    transparent: true,
    opacity: 0.25,
    depthWrite: false
  }),
  new THREE.LineBasicMaterial({
    color: "#4dffff",
    transparent: true,
    opacity: 0.15,
    depthWrite: false
  })
];

export default function Connection({ start, end, startColor, endColor }) {
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(2 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Update positions
  useMemo(() => {
    const positions = lineGeometry.attributes.position.array;
    positions[0] = start[0];
    positions[1] = start[1];
    positions[2] = start[2];
    positions[3] = end[0];
    positions[4] = end[1];
    positions[5] = end[2];
    lineGeometry.attributes.position.needsUpdate = true;
  }, [start, end]);

  // Node materials
  const startMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: startColor,
    transparent: true,
    opacity: 0.7
  }), [startColor]);

  const endMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: endColor,
    transparent: true,
    opacity: 0.7
  }), [endColor]);

  return (
    <group>
      {/* Base white lines with offset for thickness */}
      {baseLineMaterials.map((material, i) => (
        <line 
          key={`base-${i}`}
          geometry={lineGeometry} 
          material={material}
          position={[0, 0, i * 0.01]}
        />
      ))}

      {/* Glow cyan lines */}
      {glowLineMaterials.map((material, i) => (
        <line 
          key={`glow-${i}`}
          geometry={lineGeometry} 
          material={material}
          position={[0, 0, -i * 0.01]}
        />
      ))}

      {/* Connection endpoints */}
      <mesh position={start} geometry={sphereGeometry} material={startMaterial} />
      <mesh position={end} geometry={sphereGeometry} material={endMaterial} />
    </group>
  );
}