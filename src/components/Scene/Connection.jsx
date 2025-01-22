import { useMemo } from 'react';
import * as THREE from 'three';
import { geometries, materials, createLineGeometry, updateLinePositions } from '../../utils/three.utils';

export default function Connection({ start, end, startColor, endColor }) {
  const lineGeometry = useMemo(() => createLineGeometry(), []);

  // Update positions
  useMemo(() => {
    updateLinePositions(lineGeometry, start, end);
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
      {materials.connectionBaseLines.map((material, i) => (
        <line 
          key={`base-${i}`}
          geometry={lineGeometry} 
          material={material}
          position={[0, 0, i * 0.01]}
        />
      ))}

      {/* Glow cyan lines */}
      {materials.connectionGlowLines.map((material, i) => (
        <line 
          key={`glow-${i}`}
          geometry={lineGeometry} 
          material={material}
          position={[0, 0, -i * 0.01]}
        />
      ))}

      {/* Connection endpoints */}
      <mesh position={start} geometry={geometries.connectionSphere} material={startMaterial} />
      <mesh position={end} geometry={geometries.connectionSphere} material={endMaterial} />
    </group>
  );
}