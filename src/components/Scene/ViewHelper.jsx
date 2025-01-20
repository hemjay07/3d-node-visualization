// ViewHelper.jsx
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

export function ViewHelper() {
  const { camera, controls } = useThree();
  const lastGoodPosition = useRef(new THREE.Vector3());
  const isAdjusting = useRef(false);

  // Monitor and correct extreme camera positions
  useFrame(() => {
    if (!controls || isAdjusting.current) return;

    // Get current up vector
    const up = new THREE.Vector3(0, 1, 0);
    up.applyQuaternion(camera.quaternion);

    // Check if view is becoming too extreme
    const isTooVertical = Math.abs(up.y) < 0.1;  // Almost horizontal view
    const isTooFarOut = camera.position.length() > 800;
    const isTooClose = camera.position.length() < 0.5;

    if (isTooVertical || isTooFarOut || isTooClose) {
      isAdjusting.current = true;

      gsap.to(camera.position, {
        x: lastGoodPosition.current.x,
        y: lastGoodPosition.current.y,
        z: lastGoodPosition.current.z,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          isAdjusting.current = false;
        }
      });
    } else {
      lastGoodPosition.current.copy(camera.position);
    }
  });

  // Add reset view functionality
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        isAdjusting.current = true;

        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 200,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            isAdjusting.current = false;
          }
        });

        if (controls) {
          gsap.to(controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: "power2.inOut"
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, controls]);

  return null;
}