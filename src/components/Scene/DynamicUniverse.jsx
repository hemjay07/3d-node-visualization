// components/Scene/DynamicUniverse.jsx
import { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import NodeGroup from './NodeGroup';
import { generateGroupsForArea, createInterGroupConnections } from '../../data';
import { InterGroupConnection } from './InterGroupConnection';
import { useSearchStore } from '../../stores/searchStore';

export function DynamicUniverse() {
  const [visibleGroups, setVisibleGroups] = useState([]);
  const [interGroupConnections, setInterGroupConnections] = useState([]);
  const { camera } = useThree();
  const lastUpdatePos = useRef(new THREE.Vector3());
  const { selectedNode } = useSearchStore();
  
  // Adjusted parameters for denser universe
  const updateThreshold = 30;        // How far camera needs to move for update
  const updateAreaSize = 100;        // Size of area to generate new groups in
  const visibilityRange = 150;       // How far groups remain visible
  const minGroupCount = 8;           // Minimum groups to maintain
  const maxGroupCount = 15;          // Maximum groups to have at once

  // Initial generation
  useEffect(() => {
    const initialGroups = generateGroupsForArea(
      [camera.position.x, camera.position.y, camera.position.z],
      updateAreaSize
    );
    const connections = createInterGroupConnections(initialGroups);
    
    setVisibleGroups(initialGroups);
    setInterGroupConnections(connections);
    lastUpdatePos.current.copy(camera.position);
  }, []);

  // Dynamic update based on camera movement
  useFrame(() => {
    if (camera.position.distanceTo(lastUpdatePos.current) > updateThreshold) {
      const cameraPos = new THREE.Vector3().copy(camera.position);

      // Keep groups within visibility range
      const remainingGroups = visibleGroups.filter(group => {
        const groupPos = new THREE.Vector3(...group.position);
        return groupPos.distanceTo(cameraPos) < visibilityRange;
      });

      // Generate new groups if needed
      if (remainingGroups.length < minGroupCount) {
        const newGroups = generateGroupsForArea(
          [camera.position.x, camera.position.y, camera.position.z],
          updateAreaSize
        );
        
        // Merge groups and ensure no duplicates
        const updatedGroups = [...remainingGroups];
        newGroups.forEach(newGroup => {
          if (updatedGroups.length < maxGroupCount) {
            const exists = remainingGroups.some(g => g.id === newGroup.id);
            if (!exists) {
              updatedGroups.push(newGroup);
            }
          }
        });

        // Create new connections between groups
        const newConnections = createInterGroupConnections(updatedGroups);
        
        setVisibleGroups(updatedGroups);
        setInterGroupConnections(newConnections);
      }

      lastUpdatePos.current.copy(camera.position);
    }
  });

  return (
    <group>
      {/* Render inter-group connections */}
      {interGroupConnections.map((connection, idx) => {
        const sourceGroup = visibleGroups.find(g => g.id === connection.sourceGroupId);
        const targetGroup = visibleGroups.find(g => g.id === connection.targetGroupId);
        
        if (!sourceGroup || !targetGroup) return null;

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
      {visibleGroups.map((groupData) => (
        <NodeGroup
          key={groupData.id}
          data={groupData}
          position={groupData.position}
          selectedNode={selectedNode}
        />
      ))}
    </group>
  );
}