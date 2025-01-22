import * as THREE from 'three';

export const geometries = {
  connectionSphere: new THREE.SphereGeometry(0.12, 16, 16),
};

// Line materials 
export const materials = {

  // For InterGroupConnection.jsx
  interGroupBase: new THREE.LineBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.015,
    depthWrite: false
  }),
  interGroupGlow: new THREE.LineBasicMaterial({
    color: "#4dffff",
    transparent: true,
    opacity: 0.01,
    depthWrite: false
  }),


  // For intragroup connection
  connectionBaseLines: [
    new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    }),
    new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    })
  ],
  connectionGlowLines: [
    new THREE.LineBasicMaterial({
      color: "#4dffff",
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    }),
    new THREE.LineBasicMaterial({
      color: "#4dffff",
      transparent: true,
      opacity: 0.15,
      depthWrite: false
    })
  ]
};

//Line geometry creation and update
export const createLineGeometry = () => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(2 * 3);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
};

export const updateLinePositions = (geometry, start, end) => {
  const positions = geometry.attributes.position.array;
  positions[0] = start[0];
  positions[1] = start[1];
  positions[2] = start[2];
  positions[3] = end[0];
  positions[4] = end[1];
  positions[5] = end[2];
  geometry.attributes.position.needsUpdate = true;
};