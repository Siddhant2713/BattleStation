import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface RoboticArmProps {
    position: [number, number, number];
    isScanning: boolean;
}

export const RoboticArm = ({ position, isScanning }: RoboticArmProps) => {
    const baseRef = useRef<THREE.Group>(null);
    const arm1Ref = useRef<THREE.Group>(null);
    const arm2Ref = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const laserRef = useRef<THREE.Mesh>(null);

    // Idle Animation
    useFrame((state) => {
        if (!isScanning && baseRef.current) {
            baseRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            if (arm1Ref.current) arm1Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + 0.5;
        }
    });

    // Scanning Logic
    useEffect(() => {
        if (isScanning) {
            // Move into scanning position
            gsap.to(baseRef.current!.rotation, { y: 0, duration: 1 });
            gsap.to(arm1Ref.current!.rotation, { z: 1.2, duration: 1 });
            gsap.to(arm2Ref.current!.rotation, { z: -1.5, duration: 1 });

            // Laser sweep
            if (headRef.current) {
                gsap.to(headRef.current.rotation, {
                    y: Math.PI / 4,
                    duration: 1,
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut"
                });
            }
        } else {
            // Return to idle
            if (headRef.current) {
                gsap.killTweensOf(headRef.current.rotation);
                gsap.to(headRef.current.rotation, { y: 0, duration: 1 });
            }
            if (arm2Ref.current) gsap.to(arm2Ref.current.rotation, { z: -0.5, duration: 1 });
        }
    }, [isScanning]);

    return (
        <group position={position}>
            {/* Ceiling Mount */}
            <Cylinder args={[0.5, 0.5, 0.5]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#222" metalness={0.8} />
            </Cylinder>

            {/* Base Joint */}
            <group ref={baseRef} position={[0, -0.5, 0]}>
                <Sphere args={[0.4]}>
                    <meshStandardMaterial color="#333" metalness={0.9} />
                </Sphere>

                {/* Arm Segment 1 */}
                <group ref={arm1Ref} position={[0, -0.4, 0]} rotation={[0, 0, 0.5]}>
                    <Box args={[0.3, 3, 0.3]} position={[0, -1.5, 0]}>
                        <meshStandardMaterial color="#1a1a1a" metalness={0.6} />
                    </Box>
                    {/* Detail: Hydraulics */}
                    <Cylinder args={[0.05, 0.05, 2]} position={[0.2, -1.5, 0]}>
                        <meshStandardMaterial color="#666" metalness={1} />
                    </Cylinder>

                    {/* Elbow Joint */}
                    <group ref={arm2Ref} position={[0, -3, 0]} rotation={[0, 0, -0.5]}>
                        <Sphere args={[0.35]}>
                            <meshStandardMaterial color="#333" metalness={0.9} />
                        </Sphere>

                        {/* Arm Segment 2 */}
                        <Box args={[0.25, 2.5, 0.25]} position={[0, -1.25, 0]}>
                            <meshStandardMaterial color="#1a1a1a" metalness={0.6} />
                        </Box>

                        {/* Head Joint */}
                        <group ref={headRef} position={[0, -2.5, 0]}>
                            <Box args={[0.4, 0.6, 0.4]}>
                                <meshStandardMaterial color="#222" />
                            </Box>
                            {/* Lens */}
                            <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                                <meshBasicMaterial color="#FF003C" />
                            </mesh>
                            {/* Laser Beam */}
                            {isScanning && (
                                <mesh ref={laserRef} position={[0, -5, 0]}>
                                    <cylinderGeometry args={[0.02, 0.02, 10]} />
                                    <meshBasicMaterial color="#FF003C" transparent opacity={0.6} />
                                </mesh>
                            )}
                        </group>
                    </group>
                </group>
            </group>
        </group>
    );
};
