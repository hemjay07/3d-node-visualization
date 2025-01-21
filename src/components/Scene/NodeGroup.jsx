import { useState, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useNodePositionsStore } from '../../stores/nodePositionsStore';
import Node from './Node';
import Connection from './Connection';

const GroupLabel = ({ label }) => (
  <Html position={[0, 0, -1]} center>
    <div className="px-3 py-1 text-lg text-black bg-white/50 rounded-sm whitespace-nowrap">
      {label}
    </div>
  </Html>
);

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