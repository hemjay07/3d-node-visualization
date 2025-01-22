import { useMemo } from 'react'
import * as THREE from 'three'

const particleMaterial = new THREE.PointsMaterial({
  size: 1.5,
  sizeAttenuation: true,
  color: new THREE.Color(1, 1, 1),
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

export default function Background() {
  const particlesCount = 1500
  
  // Position the particles randomly in the 3d universe
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 800   
      pos[i * 3 + 1] = (Math.random() - 0.5) * 800
      pos[i * 3 + 2] = (Math.random() - 0.5) * 800
    }
    return pos
  }, [])


  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    // Add bounding sphere for frustum culling
    geo.computeBoundingSphere()
    return geo
  }, [positions])

  return (
    <points geometry={geometry} material={particleMaterial} frustumCulled={true} />
  )
}