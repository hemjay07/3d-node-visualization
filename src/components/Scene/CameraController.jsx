import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSearchStore } from '../../stores/searchStore';

// Calculate center of nodes including group position
const calculateGroupCenter = (nodes, groupPosition) => {
  let sum = new THREE.Vector3(0, 0, 0);

  for(const node of nodes) {
    const worldX = groupPosition[0] + node.position[0];
    const worldY = groupPosition[1] + node.position[1];
    const worldZ = groupPosition[2] + node.position[2];
    
    sum.x += worldX;
    sum.y += worldY;
    sum.z += worldZ;
  }

  return sum.divideScalar(nodes.length);
};


export function CameraController() {
  const { camera, controls } = useThree();
  const { selectedNodeGroup, setIsTransitioning } = useSearchStore();

  useEffect(() => {
    if (!selectedNodeGroup || !camera) return;

    setIsTransitioning(true);

    const center = calculateGroupCenter(selectedNodeGroup.nodes, selectedNodeGroup.position);

    const spaceCenter = new THREE.Vector3(0, 0, 70);
    const endPos = new THREE.Vector3(
      center.x,
      center.y,
      center.z + 25
    );

    gsap.killTweensOf([camera.position, controls?.target]);

    const tl = gsap.timeline({
      onStart: () => {
        if (controls) controls.enabled = false;
      },
      onComplete: () => {
        if (controls) controls.enabled = true;
        setIsTransitioning(false);
      },
    });

    tl.to(camera.position, {
      x: spaceCenter.x,
      y: spaceCenter.y,
      z: spaceCenter.z,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(spaceCenter);
        controls?.update();
      },
    });

    tl.to(camera.position, {
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(center);
        controls?.update();
      },
    });

    tl.to(controls?.target, {
      x: center.x,
      y: center.y,
      z: center.z,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => controls?.update(),
    }, 0);

    return () => {
      tl.kill();
      if (controls) controls.enabled = true;
    };
  }, [selectedNodeGroup, camera, controls, setIsTransitioning]);

  return null;
}