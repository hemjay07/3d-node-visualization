// components/Scene/InterGroupConnection.jsx
import * as THREE from 'three';

export function InterGroupConnection({ sourceGroup, targetGroup, sourceNodeId, targetNodeId }) {
  const sourceNode = sourceGroup.nodes.find(n => n.id === sourceNodeId);
  const targetNode = targetGroup.nodes.find(n => n.id === targetNodeId);

  if (!sourceNode || !targetNode) return null;

  // Calculate world positions
  const sourcePos = [
    sourceGroup.position[0] + sourceNode.position[0],
    sourceGroup.position[1] + sourceNode.position[1],
    sourceGroup.position[2] + sourceNode.position[2]
  ];
  
  const targetPos = [
    targetGroup.position[0] + targetNode.position[0],
    targetGroup.position[1] + targetNode.position[1],
    targetGroup.position[2] + targetNode.position[2]
  ];

  const points = [
    new THREE.Vector3(...sourcePos),
    new THREE.Vector3(...targetPos)
  ];

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* Very faint base line */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.02} 
          linewidth={1}
        />
      </line>

      {/* Minimal glow */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#4dffff" 
          transparent 
          opacity={0.01} 
          linewidth={1}
        />
      </line>

      {/* Subtle endpoints */}
      <mesh position={new THREE.Vector3(...sourcePos)}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial 
          color="#4dffff" 
          transparent 
          opacity={0.05}
        />
      </mesh>

      <mesh position={new THREE.Vector3(...targetPos)}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial 
          color="#4dffff" 
          transparent 
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}