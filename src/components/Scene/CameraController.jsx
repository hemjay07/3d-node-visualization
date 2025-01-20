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

    // Calculate center position of the node group
    const center = selectedNodeGroup.nodes.reduce((acc, node) => {
      acc.x += selectedNodeGroup.position[0] + node.position[0];
      acc.y += selectedNodeGroup.position[1] + node.position[1];
      acc.z += selectedNodeGroup.position[2] + node.position[2];
      return acc;
    }, new THREE.Vector3(0, 0, 0))
      .divideScalar(selectedNodeGroup.nodes.length);

    // Calculate node group size for dynamic offset
    const bounds = selectedNodeGroup.nodes.reduce((acc, node) => {
      const worldPos = new THREE.Vector3(
        selectedNodeGroup.position[0] + node.position[0],
        selectedNodeGroup.position[1] + node.position[1],
        selectedNodeGroup.position[2] + node.position[2]
      );
      acc.min.min(worldPos);
      acc.max.max(worldPos);
      return acc;
    }, {
      min: new THREE.Vector3(Infinity, Infinity, Infinity),
      max: new THREE.Vector3(-Infinity, -Infinity, -Infinity),
    });

    const groupSize = new THREE.Vector3().subVectors(bounds.max, bounds.min);
    const maxDimension = Math.max(groupSize.x, groupSize.y, groupSize.z);
    // const viewOffset = Math.max(maxDimension * 2, 10); // Ensure a minimum offset

    // Define positions
    const spaceCenter = new THREE.Vector3(0, 0, 70); // Adjust z for perspective
    const endPos = new THREE.Vector3(
      center.x,
      center.y,
      center.z + 25
    );

    // Kill any existing animations
    gsap.killTweensOf([camera.position, controls?.target]);

    const tl = gsap.timeline({
      onStart: () => {
        if (controls) {
          controls.enabled = false; // Disable controls during animation
        }
      },
      onComplete: () => {
        if (controls) {
          controls.enabled = true; // Re-enable controls
        }
        setIsTransitioning(false);
      },
    });

    // Step 1: Move to the center of space
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

    // Step 2: Move to the target node's position
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

    // Step 3: Synchronize controls target
    tl.to(controls?.target, {
      x: center.x,
      y: center.y,
      z: center.z,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => controls?.update(),
    }, 0); // Synchronize with Step 1

    return () => {
      tl.kill(); // Clean up the animation
      if (controls) {
        controls.enabled = true; // Ensure controls are re-enabled
      }
    };
  }, [selectedNodeGroup, camera, controls, setIsTransitioning]);

  return null;
}
