import { Html } from '@react-three/drei';

export default function Node({ position, label }) {


  return (
    <group position={position}>
      <Html position={[0, 0.4, 0]} center transform>
        <div
          className={`px-3 py-1 text-[15px] text-white/80 bg-black/70 rounded-sm whitespace-nowrap transition-all duration-300
          `}
          style={{
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}