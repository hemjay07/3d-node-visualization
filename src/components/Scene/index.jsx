// Scene/index.jsx
import { useRef } from 'react'
import NodeGroup from './NodeGroup'
import Background from './Background'
import { CameraController } from './CameraController'
import { UNIVERSE_DATA } from '../../data'
import { useSearchStore } from '../../stores/searchStore'
import * as THREE from 'three'


// Update the InterGroupConnection component
const InterGroupConnection = ({ sourceGroup, targetGroup, sourceNodeId, targetNodeId }) => {
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
};
export default function Scene() {
  const sceneRef = useRef()
  const { selectedNode } = useSearchStore()

  return (
    <group ref={sceneRef}>
      <CameraController />
      <Background />
      
      {/* Render inter-group connections first (below the groups) */}
      {UNIVERSE_DATA.interGroupConnections.map((connection, idx) => {
        const sourceGroup = UNIVERSE_DATA.nodeGroups.find(g => g.id === connection.sourceGroupId);
        const targetGroup = UNIVERSE_DATA.nodeGroups.find(g => g.id === connection.targetGroupId);
        
        return (
          <InterGroupConnection
            key={`inter-group-${idx}`}
            sourceGroup={sourceGroup}
            targetGroup={targetGroup}
            sourceNodeId={connection.sourceNodeId}
            targetNodeId={connection.targetNodeId}
          />
        );
      })}

      {/* Render node groups */}
      {UNIVERSE_DATA.nodeGroups.map((groupData) => (
        <NodeGroup 
          key={groupData.id}
          data={groupData}
          position={groupData.position}
          selectedNode={selectedNode}
        />
      ))}
    </group>
  )
}