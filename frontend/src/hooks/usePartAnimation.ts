import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const usePartAnimation = (
    objectRef: React.RefObject<THREE.Object3D>,
    isSelected: boolean,
    isHovered: boolean
) => {
    const { camera } = useThree();

    // Snap Effect on Selection/Placement
    useEffect(() => {
        if (isSelected && objectRef.current) {
            // Initial state (slightly offset)
            const originalScale = objectRef.current.scale.clone();

            // Animate "Snap"
            gsap.timeline()
                .from(objectRef.current.position, {
                    y: objectRef.current.position.y + 0.5,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                })
                .from(objectRef.current.scale, {
                    x: originalScale.x * 1.1,
                    y: originalScale.y * 1.1,
                    z: originalScale.z * 1.1,
                    duration: 0.2,
                    ease: "power2.out"
                }, 0);

            // Flash effect (if material supports emissive)
            objectRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    const originalEmissive = child.material.emissive.clone();
                    const originalEmissiveIntensity = child.material.emissiveIntensity;

                    gsap.to(child.material, {
                        emissiveIntensity: 2,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        onComplete: () => {
                            child.material.emissive = originalEmissive;
                            child.material.emissiveIntensity = originalEmissiveIntensity;
                        }
                    });
                }
            });
        }
    }, [isSelected]);

    // Hover Pulse Effect
    useEffect(() => {
        if (objectRef.current) {
            if (isHovered) {
                gsap.to(objectRef.current.scale, {
                    x: 1.05,
                    y: 1.05,
                    z: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            } else {
                gsap.to(objectRef.current.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        }
    }, [isHovered]);
};
