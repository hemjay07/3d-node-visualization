import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Background() {
  const particlesCount = 4000  // Increased particle count
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount; i++) {
      // Much wider spread to match your scene scale
      positions[i * 3] = (Math.random() - 0.5) * 500     // x: increased spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 500  // y: increased spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 500  // z: increased spread
    }
    
    return positions
  }, [])
  
  const particlesMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      uniform float time;
      varying float vDistance;
      varying float vAlpha;
      
      void main() {
        vec3 pos = position;
        
        // Adjusted distance calculation for larger scene
        vDistance = length(position.xyz) * 0.005;  // Reduced factor for larger scale
        
        // Smoother fade out
        vAlpha = smoothstep(1.0, 0.0, vDistance);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 1.5;  // Slightly larger particles
      }
    `,
    fragmentShader: `
      varying float vDistance;
      varying float vAlpha;
      
      void main() {
        // Softer particles
        float strength = 0.12 / (vDistance + 0.3);
        strength = smoothstep(0.0, 1.0, strength);
        
        // Slightly more visible particles
        float alpha = strength * vAlpha * 0.08;
        
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }), [])
  
  useFrame((state) => {
    particlesMaterial.uniforms.time.value = state.clock.elapsedTime * 0.05  // Slower animation
  })
  
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