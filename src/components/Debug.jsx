// Debug.jsx
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

// This component goes inside Canvas and collects debug info
export function DebugInfo({ onDebugUpdate }) {
  const { camera, controls } = useThree()

  useEffect(() => {
    const updateDebugInfo = () => {
      if (camera && onDebugUpdate) {
        onDebugUpdate({
          cameraPos: {
            x: Number(camera.position.x.toFixed(2)),
            y: Number(camera.position.y.toFixed(2)),
            z: Number(camera.position.z.toFixed(2))
          },
          cameraRot: {
            x: Number(camera.rotation.x.toFixed(2)),
            y: Number(camera.rotation.y.toFixed(2)),
            z: Number(camera.rotation.z.toFixed(2))
          },
          controlsTarget: controls ? {
            x: Number(controls.target.x.toFixed(2)),
            y: Number(controls.target.y.toFixed(2)),
            z: Number(controls.target.z.toFixed(2))
          } : null
        });
      }
    };

    // Set up the animation frame loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      updateDebugInfo();
    };
    animate();

    // Cleanup
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [camera, controls, onDebugUpdate]);

  return null;
}

// This component stays outside Canvas and displays the data
export function DebugOverlay({ debugInfo }) {
  return (
    <div className="fixed top-4 left-4 bg-black/50 p-4 rounded text-white font-mono text-xs z-50">
      <div>Camera Position:</div>
      <div>X: {debugInfo.cameraPos.x}</div>
      <div>Y: {debugInfo.cameraPos.y}</div>
      <div>Z: {debugInfo.cameraPos.z}</div>
      <div className="mt-2">Camera Rotation:</div>
      <div>X: {debugInfo.cameraRot.x}</div>
      <div>Y: {debugInfo.cameraRot.y}</div>
      <div>Z: {debugInfo.cameraRot.z}</div>
      {debugInfo.controlsTarget && (
        <>
          <div className="mt-2">Controls Target:</div>
          <div>X: {debugInfo.controlsTarget.x}</div>
          <div>Y: {debugInfo.controlsTarget.y}</div>
          <div>Z: {debugInfo.controlsTarget.z}</div>
        </>
      )}
    </div>
  );
}