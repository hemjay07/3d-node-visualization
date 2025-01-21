import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useNodePositionsStore } from '../../stores/nodePositionsStore';

// Shared geometries and materials
const sphereGeometry = new THREE.SphereGeometry(0.02, 8, 8);

const baseLineMaterial = new THREE.LineBasicMaterial({
  color: "#ffffff",
  transparent: true,
  opacity: 0.015,
  depthWrite: false
});

const glowLineMaterial = new THREE.LineBasicMaterial({
  color: "#4dffff",
  transparent: true,
  opacity: 0.01,
  depthWrite: false
});

const endpointMaterial = new THREE.MeshBasicMaterial({
  color: "#4dffff",
  transparent: true,
  opacity: 0.03,
  depthWrite: false
});

export default function InterGroupConnection({ sourceGroup, targetGroup, sourceNodeId, targetNodeId }) {
  const animatedPositions = useNodePositionsStore(state => state.animatedPositions);
  
  const sourceNode = sourceGroup.nodes.find(n => n.id === sourceNodeId);
  const targetNode = targetGroup.nodes.find(n => n.id === targetNodeId);

  if (!sourceNode || !targetNode) return null;

  // Get animated positions or fall back to static positions
  const sourceAnimatedPos = animatedPositions.get(`${sourceGroup.id}-${sourceNodeId}`);
  const targetAnimatedPos = animatedPositions.get(`${targetGroup.id}-${targetNodeId}`);

  const sourcePos = sourceAnimatedPos || [
    sourceGroup.position[0] + sourceNode.position[0],
    sourceGroup.position[1] + sourceNode.position[1],
    sourceGroup.position[2] + sourceNode.position[2]
  ];
  
  const targetPos = targetAnimatedPos || [
    targetGroup.position[0] + targetNode.position[0],
    targetGroup.position[1] + targetNode.position[1],
    targetGroup.position[2] + targetNode.position[2]
  ];

  // Create and update geometry
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(2 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Update positions
  useMemo(() => {
    const positions = lineGeometry.attributes.position.array;
    positions[0] = sourcePos[0];
    positions[1] = sourcePos[1];
    positions[2] = sourcePos[2];
    positions[3] = targetPos[0];
    positions[4] = targetPos[1];
    positions[5] = targetPos[2];
    lineGeometry.attributes.position.needsUpdate = true;
  }, [sourcePos, targetPos]);

  return (
    <group>
      <line geometry={lineGeometry} material={baseLineMaterial} />
      <line geometry={lineGeometry} material={glowLineMaterial} />
      
      <mesh position={sourcePos} geometry={sphereGeometry} material={endpointMaterial} />
      <mesh position={targetPos} geometry={sphereGeometry} material={endpointMaterial} />
    </group>
  );
}