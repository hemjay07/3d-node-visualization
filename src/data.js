import { COLORS,DOMAINS } from './constants';
import { PositionUtils, NodeUtils, ConnectionUtils } from './utils';

function generateBaseNodeGroup(domain, index, position) {
  const nodeCount = Math.floor(Math.random() * 8) + 4;
  const radius = Math.max(4, Math.min(12, Math.cbrt(nodeCount)));
  
  const nodes = [];
  let connections = [];


// Build each node-------------------------
  for (let i = 0; i < nodeCount; i++) {
    const nodePosition = NodeUtils.generateSphericalPosition(radius);
    const nodeType = domain.nodeTypes[Math.floor(Math.random() * domain.nodeTypes.length)];
    const action = domain.actions[Math.floor(Math.random() * domain.actions.length)];
    
    const node = {
      id: NodeUtils.createNodeId(action, nodeType),
      position: nodePosition,
      color: Math.random() < 0.8 ? COLORS.primary : COLORS.secondary
    };
    
    nodes.push(node);
    connections = connections.concat(
      ConnectionUtils.generateIntraGroupConnections(node, nodes.slice(0, -1))
    );
  }

  return {
    id: `${domain.name}${index}`,
    position,
    nodes,
    connections: ConnectionUtils.removeDuplicateConnections(connections),
    // bounds: NodeUtils.calculateBounds(nodes),
    // radius
  };
}

function generateNodeGroups() {
  const groups = [];
  const existingPositions = [];

  // Generate groups with minimum spacing
  Array.from({ length: 20 }).forEach((_, index) => {
    const domainIndex = index % DOMAINS.length;
    const position = PositionUtils.generateValidPosition(existingPositions);
    existingPositions.push(position);

    const group = generateBaseNodeGroup(DOMAINS[domainIndex], index, position);
    groups.push(group);
  });

  // Add inter-group connections
  const interGroupConnections = groups.flatMap(group => 
    ConnectionUtils.generateInterGroupConnections(group, groups)
  );

  return {
    nodeGroups: groups,
    interGroupConnections
  };
}

export const UNIVERSE_DATA = generateNodeGroups();