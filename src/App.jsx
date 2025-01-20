// App.jsx
import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Scene from './components/Scene/Index'
import { Search } from './components/UI/Search'
import { UNIVERSE_DATA } from './data'
import * as THREE from 'three';


function App() {

  return (
    <div className="w-screen h-screen" 
      style={{ 
        background: 'radial-gradient(circle at 70% 50%, rgba(59, 0, 105, 0.5) 0%, rgba(0, 0, 20, 1) 100%), radial-gradient(circle at 30% 50%, rgba(49, 0, 89, 0.5) 0%, rgba(0, 0, 20, 1) 100%)'
      }}>
      
      <div className="absolute top-4 right-4 z-10">
        <Search nodeGroups={UNIVERSE_DATA.nodeGroups} />
      </div>
      
      <Canvas
 className="w-full h-full"
 camera={{ 
  position: [50, 50, 200],  // Start further out and offset from center
  fov: 40,
  near: 0.1,
  far: 5000
}}
>
        <Scene />
        // In App.jsx
        <OrbitControls 
    makeDefault  
    enableDamping
    dampingFactor={0.05}
    rotateSpeed={0.5}
    zoomSpeed={1}
    panSpeed={1}
    screenSpacePanning={false}
    zoomToCursor={false}
    minDistance={0.1}
    maxDistance={1000}
    
    // Set initial target away from origin
    target={[50, 50, 0]}  // Offset target to match camera position
    
    minPolarAngle={Math.PI * 0.1}
    maxPolarAngle={Math.PI * 0.85}
    minAzimuthAngle={-Math.PI * 0.75}
    maxAzimuthAngle={Math.PI * 0.75}
    
    enableRotate={true}
    enableRotatePolarFix={true}

    mouseButtons={{
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.DOLLY
    }}
  />
        <EffectComposer>
          <Bloom 
            intensity={0.7}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={300}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default App