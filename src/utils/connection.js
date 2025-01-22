export const ConnectionUtils = {
    generateIntraGroupConnections: (node, existingNodes) => {
      const connections = [];
      const connectionCount = Math.floor(Math.random() * 7) + 2;
      
      if (existingNodes.length > 0) {
        for (let i = 0; i < connectionCount; i++) {
          const targetNode = existingNodes[Math.floor(Math.random() * existingNodes.length)];
          connections.push({
            source: node.id,
            target: targetNode.id
          });
        }
      }
      return connections;
    },
  
    generateInterGroupConnections: (sourceGroup, otherGroups) => {
      const connections = [];
      const connectionCount = Math.floor(Math.random() * 7) + 3;
      
      for (let i = 0; i < connectionCount; i++) {
        const availableGroups = otherGroups.filter(g => g.id !== sourceGroup.id);
        const targetGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
        
        if (!targetGroup) continue;
  
        connections.push({
          sourceGroupId: sourceGroup.id,
          targetGroupId: targetGroup.id,
          sourceNodeId: sourceGroup.nodes[Math.floor(Math.random() * sourceGroup.nodes.length)].id,
          targetNodeId: targetGroup.nodes[Math.floor(Math.random() * targetGroup.nodes.length)].id
        });
      }
      return connections;
    },
  
    removeDuplicateConnections: (connections) => 
      Array.from(new Set(connections.map(c => JSON.stringify(c))))
        .map(c => JSON.parse(c))
  };
  