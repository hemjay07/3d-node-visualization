const DOMAINS = [
  {
    name: 'analytics',
    nodeTypes: ['Dashboard', 'Report', 'Metric', 'Chart', 'Filter', 'Dataset', 'Query', 'Visualization', 'Alert', 'Export'],
    actions: ['View', 'Create', 'Update', 'Delete', 'Share', 'Schedule', 'Configure', 'Monitor', 'Analyze']
  },
  {
    name: 'commerce',
    nodeTypes: ['Product', 'Order', 'Cart', 'Payment', 'Shipping', 'Inventory', 'Customer', 'Promotion', 'Review', 'Wishlist'],
    actions: ['Purchase', 'Add', 'Remove', 'Checkout', 'Track', 'Return', 'Save', 'Apply', 'Rate']
  },
  {
    name: 'content',
    nodeTypes: ['Article', 'Media', 'Post', 'Comment', 'Category', 'Tag', 'Author', 'Editor', 'Version', 'Archive'],
    actions: ['Publish', 'Draft', 'Edit', 'Review', 'Approve', 'Archive', 'Restore', 'Format', 'Upload']
  },
  {
    name: 'user',
    nodeTypes: ['Profile', 'Account', 'Permission', 'Role', 'Group', 'Setting', 'Preference', 'Activity', 'Session', 'Authentication'],
    actions: ['Login', 'Register', 'Update', 'Verify', 'Reset', 'Grant', 'Revoke', 'Manage', 'Track']
  },
  {
    name: 'system',
    nodeTypes: ['Service', 'Config', 'Log', 'Cache', 'Queue', 'Job', 'Worker', 'Resource', 'Backup', 'Monitor'],
    actions: ['Start', 'Stop', 'Restart', 'Deploy', 'Scale', 'Optimize', 'Clean', 'Maintain', 'Recover']
  }
];

const COLORS = {
  primary: '#4dffff',    // Soft cyan/turquoise
  secondary: '#ff69b4',  // Softer pink
  connection: '#ffffff', // White for connections
  glow: '#4dffff'       // Cyan glow
};

function getRandomPosition(range) {
  return Math.random() * range - range / 2;
}


// Get a random position, check if its valid by comparing its distance with every other registered position.
function getRandomPositionWithPadding(existingPositions, minDistance = 50) {
  let position;
  let isValidPosition = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isValidPosition && attempts < maxAttempts) {
    position = [
      getRandomPosition(200),   // x range
      getRandomPosition(200),   // y range
      getRandomPosition(200)    // z range
    ];

    isValidPosition = true;
    for (const existingPos of existingPositions) {
      const distance = Math.sqrt(
        Math.pow(position[0] - existingPos[0], 2) +
        Math.pow(position[1] - existingPos[1], 2) +
        Math.pow(position[2] - existingPos[2], 2)
      );

      if (distance < minDistance) {
        isValidPosition = false;
        break;
      }
    }

    attempts++;
  }

  if (!isValidPosition) {
    console.warn('Could not find valid position after max attempts');
  }

  return position;
}

function generateNodeGroups() {
  const groups = [];
  const existingPositions = [];

  // Generate groups with minimum spacing
  Array.from({ length: 15 }).forEach((_, index) => {
    const domainIndex = index % DOMAINS.length;
    const position = getRandomPositionWithPadding(existingPositions, 50);
    existingPositions.push(position);

    const group = generateBaseNodeGroup(DOMAINS[domainIndex], index, position);
    groups.push(group);
  });

  // Add inter-group connections
  const interGroupConnections = [];
  
  groups.forEach((group, groupIndex) => {
    const connectionCount = Math.floor(Math.random() * 7) + 3;
    
    for (let i = 0; i < connectionCount; i++) {
      let targetGroupIndex;
      do {
        targetGroupIndex = Math.floor(Math.random() * groups.length);
      } while (targetGroupIndex === groupIndex);

      const targetGroup = groups[targetGroupIndex];

      const sourceNode = group.nodes[Math.floor(Math.random() * group.nodes.length)];
      const targetNode = targetGroup.nodes[Math.floor(Math.random() * targetGroup.nodes.length)];

      interGroupConnections.push({
        sourceGroupId: group.id,
        targetGroupId: targetGroup.id,
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id
      });
    }
  });

  return {
    nodeGroups: groups,
    interGroupConnections
  };
}

function generateBaseNodeGroup(domain, index, position) {
  const nodeCount = Math.floor(Math.random() * 10) + 5;
  const radius = Math.max(4, Math.min(12, Math.cbrt(nodeCount)));
  
  const nodes = [];
  const connections = [];

  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = (radius * 0.4) + (Math.random() * radius * 0.6);

    const nodePosition = [
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    ];

    const nodeType = domain.nodeTypes[Math.floor(Math.random() * domain.nodeTypes.length)];
    const action = domain.actions[Math.floor(Math.random() * domain.actions.length)];
    const id = `${action}${nodeType}${Math.floor(Math.random() * 100)}`;

    nodes.push({
      id,
      position: nodePosition,
      color: Math.random() < 0.8 ? COLORS.primary : COLORS.secondary
    });

    const connectionCount = Math.floor(Math.random() * 7) + 2;
    for (let j = 0; j < connectionCount; j++) {
      if (nodes.length > 1) {
        const targetIndex = Math.floor(Math.random() * (nodes.length - 1));
        connections.push({
          source: id,
          target: nodes[targetIndex].id
        });
      }
    }
  }

  const bounds = nodes.reduce((acc, node) => ({
    minX: Math.min(acc.minX, node.position[0]),
    maxX: Math.max(acc.maxX, node.position[0]),
    minY: Math.min(acc.minY, node.position[1]),
    maxY: Math.max(acc.maxY, node.position[1]),
    minZ: Math.min(acc.minZ, node.position[2]),
    maxZ: Math.max(acc.maxZ, node.position[2])
  }), {
    minX: Infinity, maxX: -Infinity,
    minY: Infinity, maxY: -Infinity,
    minZ: Infinity, maxZ: -Infinity
  });

  return {
    id: `${domain.name}${index}`,
    position,
    nodes,
    connections: Array.from(new Set(connections.map(c => JSON.stringify(c))))
      .map(c => JSON.parse(c)),
    bounds,
    radius
  };
}

export const UNIVERSE_DATA = generateNodeGroups();
