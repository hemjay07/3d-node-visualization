import { useState, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';



export default function Node ({ position, label, color, isSelected }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {isSelected && (
        <mesh>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[0.06, 0.06]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 1 : hovered ? 0.9 : 0.7}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>
      <Html position={[0, 0.2, 0]} center transform>
        <div
          className={`px-1.5 py-0.5 text-[10px] text-white bg-black/60 rounded-sm whitespace-nowrap transition-all duration-300 ${
            isSelected ? 'scale-110' : ''
          }`}
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            transform: `scale(${isSelected ? 0.9 : 0.8})`,
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
};


