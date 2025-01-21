import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

export function IntroAnimation() {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!camera || !controls) return;

    controls.enabled = false;

    // Set initial position
    camera.position.set(0, 0, 1300);
    
    const tl = gsap.timeline({
      onComplete: () => {
        controls.enabled = true;
      }
    });

    // Initial dramatic zoom in
    tl.to(camera.position, {
      z: 200,
      duration: 3,
      ease: "power2.inOut"
    })

    // Swing around
    .to(camera.position, {
      x: 60,
      y: 60,
      z: 50,
      duration: 2,
      ease: "power1.inOut"
    })
    
    // Another swing
    .to(camera.position, {
      x: -70,
      y: -50,
      z: 150,
      duration: 2,
      ease: "power1.inOut"
    })

    // Finally, settle to default position
    .to(camera.position, {
      x: 0,
      y: 0,
      z: 120,
      duration: 2,
      ease: "power2.out"
    });

    return () => tl.kill();
  }, [camera, controls]);

  return null;
}