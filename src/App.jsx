// App.jsx
import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Scene from './components/Scene/Index'
import { Search } from './components/UI/Search'
import { DebugInfo, DebugOverlay } from './components/Debug'
import { UNIVERSE_DATA } from './data'

function App() {
  const [debugInfo, setDebugInfo] = useState({
    cameraPos: { x: 0, y: 0, z: 0 },
    cameraRot: { x: 0, y: 0, z: 0 },
    controlsTarget: { x: 0, y: 0, z: 0 }
  });

  return (
    <div className="w-screen h-screen" 
      style={{ 
        background: 'radial-gradient(circle at 70% 50%, rgba(59, 0, 105, 0.5) 0%, rgba(0, 0, 20, 1) 100%), radial-gradient(circle at 30% 50%, rgba(49, 0, 89, 0.5) 0%, rgba(0, 0, 20, 1) 100%)'
      }}>
      <DebugOverlay debugInfo={debugInfo} />
      
      <div className="absolute top-4 right-4 z-10">
        <Search nodeGroups={UNIVERSE_DATA.nodeGroups} />
      </div>
      
      <Canvas
 className="w-full h-full"
 camera={{ 
   position: [0, 0, 200],
   fov: 45,
   near: 0.1,
   far: 5000
 }}
>
        <DebugInfo onDebugUpdate={setDebugInfo} />
        <Scene />
        // In App.jsx
<OrbitControls 
  makeDefault  
  enableDamping
  dampingFactor={0.05}
  rotateSpeed={0.5}
  zoomSpeed={1}
  panSpeed={1}
  screenSpacePanning={true}
  zoomToCursor={true}
  minDistance={0.1}
  maxDistance={1000}
  
  // Add rotation constraints
  minPolarAngle={Math.PI * 0.1}     // Prevent looking directly from below
  maxPolarAngle={Math.PI * 0.85}    // Prevent looking directly from above
  
  // Limit horizontal rotation range
  minAzimuthAngle={-Math.PI * 0.75}  // Limit left rotation
  maxAzimuthAngle={Math.PI * 0.75}   // Limit right rotation
  
  // Additional helpful settings
  enableRotate={true}

  
  // Auto-rotation when idle (optional)
  // autoRotate={true}
  // autoRotateSpeed={0.5}
  
  // Keep camera level with horizon
  enableRotatePolarFix={true}
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