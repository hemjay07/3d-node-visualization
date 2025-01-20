// src/data.js
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

function generateNodeGroups() {
  // First generate all groups
  const groups = Array.from({ length: 15 }, (_, index) => {
    const domainIndex = index % DOMAINS.length;
    return generateBaseNodeGroup(DOMAINS[domainIndex], index);
  });

  // Then add inter-group connections
  const interGroupConnections = [];
  
  groups.forEach((group, groupIndex) => {
    // Each group will connect to 1-3 other groups
    const connectionCount = Math.floor(Math.random() * 7) + 3;
    
    for (let i = 0; i < connectionCount; i++) {
      // Find a target group (not self)
      let targetGroupIndex;
      do {
        targetGroupIndex = Math.floor(Math.random() * groups.length);
      } while (targetGroupIndex === groupIndex);

      const targetGroup = groups[targetGroupIndex];

      // Select random nodes from each group for connection
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

function generateBaseNodeGroup(domain, index) {
  const position = [
    getRandomPosition(100),  // Reduced from 150
    getRandomPosition(100),  // Reduced from 150
    getRandomPosition(200)   // Reduced from 300
  ];

  const nodeCount = Math.floor(Math.random() * 10) + 5;
  const radius = Math.max(4, Math.min(12, Math.cbrt(nodeCount)));
  
  const nodes = [];
  const connections = [];

  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = (radius * 0.4) + (Math.random() * radius * 0.6);  // Ensures nodes aren't too close to center

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

    // Internal connections (2-8)
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

// Log stats
console.log(`Generated ${UNIVERSE_DATA.nodeGroups.length} node groups`);
console.log(`Total nodes: ${UNIVERSE_DATA.nodeGroups.reduce((acc, group) => acc + group.nodes.length, 0)}`);
console.log(`Total internal connections: ${UNIVERSE_DATA.nodeGroups.reduce((acc, group) => acc + group.connections.length, 0)}`);
console.log(`Total inter-group connections: ${UNIVERSE_DATA.interGroupConnections.length}`);