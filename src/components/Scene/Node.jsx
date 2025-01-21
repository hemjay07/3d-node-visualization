import { useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Create shared geometries outside component
const nodeGeometry = new THREE.PlaneGeometry(0.06, 0.06);
const selectionGeometry = new THREE.CircleGeometry(0.15, 32);

export default function Node({ position, label, color, isSelected }) {
  const [hovered, setHovered] = useState(false);

  // Create materials with useMemo
  const nodeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: isSelected ? 1 : hovered ? 0.9 : 0.7,
    depthWrite: false,
    depthTest: true
  }), [color, isSelected, hovered]);

  const selectionMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.2
  }), [color]);

  return (
    <group position={position}>
      {isSelected && (
        <mesh geometry={selectionGeometry} material={selectionMaterial} />
      )}
      
      <mesh
        geometry={nodeGeometry}
        material={nodeMaterial}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />

      <Html position={[0, 0.2, 0]} center transform>
        <div
          className={`px-3 py-1 text-[15px] text-white/80 bg-black/70 rounded-sm whitespace-nowrap transition-all duration-300 ${
            isSelected ? 'scale-110' : ''
          }`}
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            transform: `scale(${isSelected ? 0.9 : 0.8})`,
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}