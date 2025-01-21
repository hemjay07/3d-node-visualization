import { useRef } from 'react'
import NodeGroup from './NodeGroup'
import Background from './Background'
import { CameraController } from './CameraController'
import { UNIVERSE_DATA } from '../../data'
import { useSearchStore } from '../../stores/searchStore'
import InterGroupConnection from './InterGroupConnection'
// import PerformanceMonitor from './PerformanceMonitor'

export default function Scene() {
  // console.log("scene rendered")

  const sceneRef = useRef()
  const { selectedNode } = useSearchStore()

  return (
    <group ref={sceneRef}>
      {/* <PerformanceMonitor/> */}
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