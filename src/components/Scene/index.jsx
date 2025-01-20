// Scene/index.jsx
import { useRef } from 'react'
import NodeGroup from './NodeGroup'
import Background from './Background'
import { CameraController } from './CameraController'
import { UNIVERSE_DATA } from '../../data'
import { useSearchStore } from '../../stores/searchStore'
import { useNodePositionsStore } from '../../stores/nodePositionsStore'
import * as THREE from 'three'

const InterGroupConnection = ({ sourceGroup, targetGroup, sourceNodeId, targetNodeId }) => {
  const animatedPositions = useNodePositionsStore(state => state.animatedPositions);
  
  const sourceNode = sourceGroup.nodes.find(n => n.id === sourceNodeId);
  const targetNode = targetGroup.nodes.find(n => n.id === targetNodeId);

  if (!sourceNode || !targetNode) return null;

  // Get animated positions from store, fall back to static positions if not available
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
          depthWrite={false}
        />
      </line>

      {/* Minimal glow */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#4dffff" 
          transparent 
          opacity={0.01} 
          linewidth={1}
          depthWrite={false}
        />
      </line>

      {/* Subtle endpoints */}
      <mesh position={new THREE.Vector3(...sourcePos)}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial 
          color="#4dffff" 
          transparent 
          opacity={0.05}
          depthWrite={false}
        />
      </mesh>

      <mesh position={new THREE.Vector3(...targetPos)}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial 
          color="#4dffff" 
          transparent 
          opacity={0.05}
          depthWrite={false}
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
      
      {/* Scene content in nested groups for better organization */}
      <group>
        {/* Connections group */}
        <group>
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
        </group>

        {/* Node groups */}
        <group>
          {UNIVERSE_DATA.nodeGroups.map((groupData) => (
            <NodeGroup 
              key={groupData.id}
              data={groupData}
              position={groupData.position}
              selectedNode={selectedNode}
            />
          ))}
        </group>
      </group>
    </group>
  )
}