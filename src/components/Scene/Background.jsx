import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Background() {
  //Particles for a dense star field
  const particlesCount = 5000
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    
    // Distribution of particles
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1000     
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1000 
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000 
    }
    
    return positions
  }, [])
  
  // material for star-like points
  const particlesMaterial = useMemo(() => new THREE.PointsMaterial({
    size: 1.5,                
    sizeAttenuation: true,      
    color: new THREE.Color(1, 1, 1),
    transparent: true,
    opacity: 0.6,               
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [])
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={particlesMaterial} attach="material" />
    </points>
  )
}