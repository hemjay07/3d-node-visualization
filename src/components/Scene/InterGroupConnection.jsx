import { useMemo } from 'react';
import { useNodePositionsStore } from '../../stores/nodePositionsStore';
import { materials, createLineGeometry, updateLinePositions } from '../../utils/three.utils';

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
  const lineGeometry = useMemo(() => createLineGeometry(), []);

  // Update positions
  useMemo(() => {
    updateLinePositions(lineGeometry, sourcePos, targetPos);
  }, [sourcePos, targetPos]);

  return (
    <group>
      <line geometry={lineGeometry} material={materials.interGroupBase} />
      <line geometry={lineGeometry} material={materials.interGroupGlow} />
    </group>
  );
}