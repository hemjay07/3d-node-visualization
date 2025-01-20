import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSearchStore } from '../../stores/searchStore';

export function CameraController() {
  const { camera, controls } = useThree();
  const { selectedNodeGroup, setIsTransitioning } = useSearchStore();

  useEffect(() => {
    if (!selectedNodeGroup || !camera) return;
    
    setIsTransitioning(true);

    // Calculate target position
    const center = selectedNodeGroup.nodes.reduce((acc, node) => {
      acc.x += selectedNodeGroup.position[0] + node.position[0];
      acc.y += selectedNodeGroup.position[1] + node.position[1];
      acc.z += selectedNodeGroup.position[2] + node.position[2];
      return acc;
    }, new THREE.Vector3(0, 0, 0))
      .divideScalar(selectedNodeGroup.nodes.length);

    // Store exact starting values
    const startRot = camera.rotation.clone();
    const startPos = camera.position.clone();
    const startTarget = controls?.target.clone() || new THREE.Vector3();

    // Calculate end camera position with increased offset
    const endPos = new THREE.Vector3(
      center.x,
      center.y,
      center.z + 15 // Increased offset for better view
    );

    // Single timeline for all animations
    gsap.timeline()
      .to(startPos, {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration: 2.5, // Slightly longer duration for smoother movement
        ease: "power3.inOut",
        onUpdate: () => {
          camera.position.copy(startPos);
          camera.lookAt(center);
        }
      })
      .to(controls?.target, {
        x: center.x,
        y: center.y,
        z: center.z,
        duration: 2.5,
        ease: "power3.inOut",
        onUpdate: () => controls?.update(),
        onComplete: () => setIsTransitioning(false)
      }, 0);
  }, [selectedNodeGroup, camera, controls, setIsTransitioning]);

  return null;
}