import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, CameraControls, ContactShadows, Float, SpotLight } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from '@react-three/postprocessing';
import { LabEnvironment } from './LabEnvironment';

import { CorePedestal } from './CorePedestal';
import { HologramOverlay } from './HologramOverlay';
import * as THREE from 'three';

import { gsap } from 'gsap';

import { CabinetLoader } from './CabinetLoader';

export const DashboardScene = ({ cabinetId = 'ducati-monster' }: { cabinetId?: string }) => {
    const cameraControlsRef = useRef<CameraControls>(null);
    const pedestalRef = useRef<THREE.Group>(null);
    const spotLightRef = useRef<THREE.SpotLight>(null);
    const pcGroupRef = useRef<THREE.Group>(null); // Ref for rotation
    const [introFinished, setIntroFinished] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [temperature, setTemperature] = useState(45);

    // Cinematic Intro V2 (Clean & Smooth)
    useEffect(() => {
        if (cameraControlsRef.current && pedestalRef.current && spotLightRef.current) {
            // Initial State
            cameraControlsRef.current.setPosition(0, 5, 40, false);
            cameraControlsRef.current.setTarget(0, 0, 0, false);
            pedestalRef.current.position.y = -10;
            spotLightRef.current.intensity = 0;

            const tl = gsap.timeline({ onComplete: () => setIntroFinished(true) });

            tl.to({}, { duration: 0.5 })
                // 1. Pedestal Rises smoothly
                .to(pedestalRef.current.position, { y: 0, duration: 3, ease: "power3.out" })
                // 2. Lights On
                .to(spotLightRef.current, { intensity: 400, duration: 1, ease: "power2.out" }, "-=2")
                // 3. Spiral Camera Move (Zoom + Rotate)
                .to({}, {
                    duration: 4,
                    ease: "power2.inOut",
                    onUpdate: function () {
                        const progress = this.progress(); // 0 to 1
                        if (cameraControlsRef.current) {
                            // Interpolate values
                            const startRadius = 40;
                            const endRadius = 11;
                            const currentRadius = startRadius + (endRadius - startRadius) * progress;

                            const startY = 5;
                            const endY = 4; // Higher end position to look from above
                            const currentY = startY + (endY - startY) * progress;

                            const startTargetY = 0;
                            const endTargetY = 1.2;
                            const currentTargetY = startTargetY + (endTargetY - startTargetY) * progress;

                            // Calculate spiral position
                            // Start at angle 0 (Front) -> End at angle 2PI + PI/4 (45 deg angle)
                            const totalRotation = Math.PI * 2 + Math.PI / 4;
                            const angle = progress * totalRotation;

                            const x = Math.sin(angle) * currentRadius;
                            const z = Math.cos(angle) * currentRadius;

                            // Update Camera
                            cameraControlsRef.current.setLookAt(x, currentY, z, 0, currentTargetY, 0, false);
                        }
                    }
                }, "-=1");
        }
    }, []);

    // Slow Rotation Removed
    // useFrame((state, delta) => {
    //     if (pcGroupRef.current && !isInteracting) {
    //         pcGroupRef.current.rotation.y += delta * 0.05; // Very slow rotation (approx 0.5 RPM)
    //     }
    // });

    // Mock Temperature
    useEffect(() => {
        const interval = setInterval(() => {
            setTemperature(prev => Math.max(35, Math.min(95, prev + (Math.random() - 0.5) * 10)));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleFocus = (position: THREE.Vector3) => {
        setIsInteracting(true);
        if (cameraControlsRef.current) {
            cameraControlsRef.current.setLookAt(
                position.x + 2, position.y + 1, position.z + 4,
                position.x, position.y, position.z,
                true
            );
        }
    };

    const isCritical = temperature > 80;
    const isWarning = temperature > 60;
    // Accent color logic
    const accentColor = isCritical ? "#FF0000" : (isWarning ? "#FF4400" : "#00FFFF");

    return (
        <>
            <CameraControls
                ref={cameraControlsRef}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.9}
                minDistance={5}
                maxDistance={30}
                smoothTime={0.5}
                draggingSmoothTime={0.2}
            />

            {/* --- ENVIRONMENT & LIGHTING --- */}
            <Environment preset="studio" background={false} blur={1} />
            <color attach="background" args={['#050505']} />

            <LabEnvironment />

            {/* Soft Global Illumination */}
            <ambientLight intensity={0.5} color="#ffffff" />

            {/* Hero Spotlight (Optimized) */}
            <SpotLight
                ref={spotLightRef}
                position={[0, 15, 5]}
                angle={0.4}
                penumbra={0.2}
                intensity={200}
                color="#ffffff"
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.00005}
            />

            {/* Rim Lights for Definition */}
            <pointLight position={[-10, 5, -5]} intensity={5} color="#ffffff" distance={20} />
            <pointLight position={[10, 5, -5]} intensity={5} color="#ffffff" distance={20} />

            {/* --- ACTORS --- */}

            <group ref={pedestalRef}>
                <CorePedestal />
                {/* Reduced Levitation Height & Range */}
                <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[0.05, 0.1]}>
                    <group
                        ref={pcGroupRef}
                        position={[0, 1.5, 0]}
                        scale={0.7}
                        onClick={() => setIsInteracting(true)}
                    >
                        <CabinetLoader cabinetId={cabinetId} onLoaded={() => { }} />
                        <HologramOverlay
                            visible={isInteracting || isWarning}
                            label={isCritical ? "CRITICAL FAILURE" : "SYSTEM OPTIMAL"}
                            stats={[
                                { label: "CORE TEMP", value: `${temperature.toFixed(0)}°C` },
                                { label: "INTEGRITY", value: "100%" }
                            ]}
                            position={[0, 2, 0]}
                        />
                    </group>
                </Float>
            </group>

            {/* --- POST PROCESSING (Optimized) --- */}
            <EffectComposer enableNormalPass={false}>
                <Bloom luminanceThreshold={1.5} mipmapBlur intensity={0.3} radius={0.2} />
            </EffectComposer>
        </>
    );
};
