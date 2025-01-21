import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Scene from './components/Scene/index'
import { Search } from './components/UI/Search'
import { UNIVERSE_DATA } from './data'
import { IntroAnimation } from './IntroAnimation'

function App() {
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSearch(true), 9000); 
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="w-screen h-screen" 
      style={{ 
        background: 'radial-gradient(circle at 70% 50%, rgba(59, 0, 105, 0.5) 0%, rgba(0, 0, 20, 1) 100%), radial-gradient(circle at 30% 50%, rgba(49, 0, 89, 0.5) 0%, rgba(0, 0, 20, 1) 100%)'
      }}>
      
      {/* Fade in search after intro */}
      <div 
        className={`absolute top-4 right-4 z-10 transition-opacity duration-1000 ${
          showSearch ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Search nodeGroups={UNIVERSE_DATA.nodeGroups} />
      </div>
      
      <Canvas
        className="w-full h-full"
        camera={{ 
          position: [0, 0, 1000], // Start far out, this is for the initial animation effect
          fov: 45,
          near: 0.1,
          far: 5000
        }}
      >
        <IntroAnimation />
        <Scene />
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
          
          minPolarAngle={Math.PI * 0.1}     
          maxPolarAngle={Math.PI * 0.85}    
          minAzimuthAngle={-Math.PI * 0.75}  
          maxAzimuthAngle={Math.PI * 0.75}
          
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.2}
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