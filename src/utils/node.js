export const NodeUtils = {
    generateSphericalPosition: (radius) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = (radius * 0.4) + (Math.random() * radius * 0.6);
  
      return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ];
    },
  
    createNodeId: (action, nodeType) => 
      `${action}${nodeType}${Math.floor(Math.random() * 100)}`,
  };
  