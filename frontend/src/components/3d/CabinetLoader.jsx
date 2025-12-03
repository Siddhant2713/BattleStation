import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { getCabinetById } from '../../config/cabinets';
import { PCCase } from '../pc/PCCase';

const Model = ({ url, ...props }) => {
    const { scene } = useGLTF(url);
    const clonedScene = React.useMemo(() => scene.clone(), [scene]);
    return <primitive object={clonedScene} {...props} />;
};

export const CabinetLoader = ({ cabinetId, onLoaded }) => {
    const [activeCabinet, setActiveCabinet] = useState(null);
    const groupRef = useRef();

    useEffect(() => {
        const cabinetData = getCabinetById(cabinetId);

        // Transition Logic
        if (groupRef.current) {
            // 1. Fade Out / Scale Down
            gsap.to(groupRef.current.scale, {
                x: 0.9, y: 0.9, z: 0.9,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    // 2. Switch Cabinet
                    setActiveCabinet(cabinetData);
                    if (onLoaded) onLoaded();

                    // 3. Fade In / Scale Up
                    gsap.to(groupRef.current.scale, {
                        x: 1, y: 1, z: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            });
        } else {
            // Initial Load
            setActiveCabinet(cabinetData);
            if (onLoaded) onLoaded();
        }

    }, [cabinetId]);

    if (!activeCabinet) return null;

    return (
        <group ref={groupRef}>
            <Suspense fallback={null}>
                {activeCabinet.type === 'component' ? (
                    <PCCase {...activeCabinet.componentProps} />
                ) : (
                    <Model
                        url={activeCabinet.file}
                        scale={activeCabinet.scale}
                        position={activeCabinet.position}
                        rotation={activeCabinet.rotation}
                    />
                )}
            </Suspense>
        </group>
    );
};
