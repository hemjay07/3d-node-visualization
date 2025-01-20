import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Background() {
  const particlesCount = 2000  // More particles for smoother effect
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount; i++) {
      // Spread particles more evenly and wider
      positions[i * 3] = (Math.random() - 0.5) * 200      // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100  // z
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
        
        // Calculate distance from center for fade effect
        vDistance = length(position.xyz) * 0.02;
        
        // Fade out based on distance from center
        vAlpha = smoothstep(1.0, 0.0, vDistance);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 1.2;
      }
    `,
    fragmentShader: `
      varying float vDistance;
      varying float vAlpha;
      
      void main() {
        // Create soft, circular particles
        float strength = 0.15 / (vDistance + 0.5);
        strength = smoothstep(0.0, 1.0, strength);
        
        // Combine with distance-based fade
        float alpha = strength * vAlpha * 0.05;
        
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }), [])
  
  useFrame((state) => {
    particlesMaterial.uniforms.time.value = state.clock.elapsedTime * 0.1
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