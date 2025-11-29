import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
    count?: number;
    color?: string;
    position?: [number, number, number];
    trigger?: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
    count = 50,
    color = "#FF003C",
    position = [0, 0, 0],
    trigger = false
}) => {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Initialize particles with random velocities
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            life: Math.random()
        }));
    }, [count]);

    useFrame(() => {
        if (!mesh.current || !trigger) return;

        particles.forEach((particle, i) => {
            // Update position
            particle.position.add(particle.velocity);
            particle.life -= 0.01;

            if (particle.life <= 0) {
                // Reset
                particle.position.set(0, 0, 0);
                particle.life = 1;
            }

            // Update instance matrix
            dummy.position.copy(particle.position);
            const scale = Math.max(0, particle.life);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();

            mesh.current!.setMatrixAt(i, dummy.matrix);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    if (!trigger) return null;

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={position}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
        </instancedMesh>
    );
};
