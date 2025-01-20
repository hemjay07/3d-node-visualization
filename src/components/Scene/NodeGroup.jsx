// NodeGroup.jsx
import { useState, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSearchStore } from '../../stores/searchStore';
import { useNodePositionsStore } from '../../stores/nodePositionsStore';

const Node = ({ position, label, color, isSelected }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {isSelected && (
        <mesh>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 1 : hovered ? 0.9 : 0.7}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>
      <Html position={[0, 0.2, 0]} center transform>
        <div
          className={`px-1.5 py-0.5 text-[10px] text-white bg-black/60 rounded-sm whitespace-nowrap transition-all duration-300 ${
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
};

const GroupLabel = ({ label }) => (
  <Html position={[0, 0, -1]} center>
    <div className="px-3 py-1 text-sm text-black bg-white/50 rounded-sm whitespace-nowrap">
      {label}
    </div>
  </Html>
);

const Connection = ({ start, end, startColor, endColor }) => {
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

export default function NodeGroup({ data, position }) {
  const groupRef = useRef();
  const updateNodePosition = useNodePositionsStore(state => state.updateNodePosition);
  const [animatedNodes, setAnimatedNodes] = useState(
    data.nodes.map((node) => ({
      ...node,
      originalPosition: node.position,
      angle: Math.random() * Math.PI * 2,
    }))
  );

  useEffect(() => {
    const radius = 6.0;
    const speed = 0.01;

    const interval = setInterval(() => {
      setAnimatedNodes((prevNodes) =>
        prevNodes.map((node) => {
          const newAngle = node.angle + speed;
          const newX = node.originalPosition[0] + radius * Math.cos(newAngle);
          const newY = node.originalPosition[1] + radius * Math.sin(newAngle);
          const newPosition = [newX, newY, node.originalPosition[2]];
          
          // Update global position store with world position
          updateNodePosition(
            data.id, 
            node.id, 
            [
              position[0] + newX,
              position[1] + newY,
              position[2] + node.originalPosition[2]
            ]
          );
          
          return {
            ...node,
            angle: newAngle,
            position: newPosition,
          };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [data.id, position, updateNodePosition]);

  return (
    <group ref={groupRef} position={position}>
      <GroupLabel label={data.id} />
      
      {data.connections.map((connection, idx) => {
        const startNode = animatedNodes.find((n) => n.id === connection.source);
        const endNode = animatedNodes.find((n) => n.id === connection.target);

        return (
          <Connection
            key={`connection-${idx}`}
            start={startNode.position}
            end={endNode.position}
            startColor={startNode?.color || '#bf40ff'}
            endColor={endNode?.color || '#bf40ff'}
          />
        );
      })}
      
      {animatedNodes.map((node) => (
        <Node
          key={node.id}
          position={node.position}
          label={node.id}
          color={node.color}
          isSelected={data.selectedNode?.id === node.id}
        />
      ))}
    </group>
  );
}