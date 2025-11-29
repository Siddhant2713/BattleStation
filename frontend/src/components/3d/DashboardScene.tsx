import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, CameraControls, ContactShadows, Float, SpotLight } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from '@react-three/postprocessing';
import { PCCase } from '../pc/PCCase';
import { LabEnvironment } from './LabEnvironment';
import { RoboticArm } from './RoboticArm';
import { CorePedestal } from './CorePedestal';
import { HologramOverlay } from './HologramOverlay';
import * as THREE from 'three';
import { gsap } from 'gsap';

export const DashboardScene = () => {
    const cameraControlsRef = useRef<CameraControls>(null);
    const pedestalRef = useRef<THREE.Group>(null);
    const spotLightRef = useRef<THREE.SpotLight>(null);
    const [introFinished, setIntroFinished] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [temperature, setTemperature] = useState(45);

    // Cinematic Intro V2
    useEffect(() => {
        if (cameraControlsRef.current && pedestalRef.current && spotLightRef.current) {
            // Initial State
            cameraControlsRef.current.setPosition(0, 5, 50, false); // Far back
            cameraControlsRef.current.setTarget(0, 0, 0, false);
            pedestalRef.current.position.y = -15; // Deep underground
            spotLightRef.current.intensity = 10; // Start DIM, not pitch black

            const tl = gsap.timeline({ onComplete: () => setIntroFinished(true) });

            tl.to({}, { duration: 1 }) // Silence
                // 1. Vault Door "Opens" (Simulated by light/fog shift)
                .to({}, { duration: 1 })
                // 2. Pedestal Rises with heavy mechanical ease
                .to(pedestalRef.current.position, { y: 0, duration: 4, ease: "power2.inOut" })
                // 3. Main Spotlights Ignite
                .to(spotLightRef.current, { intensity: 200, duration: 0.5, ease: "bounce.out" }, "-=1")
                // 4. Camera Swoop
                .call(() => {
                    cameraControlsRef.current?.setLookAt(0, 3, 14, 0, 1, 0, true);
                }, [], "-=0.5");
        }
    }, []);

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
    const baseColor = isCritical ? "#FF0000" : (isWarning ? "#FF4400" : "#00FFFF");

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

            <Environment preset="city" background={false} blur={0.8} />
            <LabEnvironment />

            {/* --- ATMOSPHERE --- */}
            {/* Layered Fog for Depth - REDUCED DENSITY for Clarity */}
            <fogExp2 attach="fog" args={[isCritical ? '#1a0000' : '#020202', 0.005]} />
            <ambientLight intensity={0.2} color={baseColor} />

            {/* --- CINEMATIC LIGHTING --- */}
            {/* Hero Spotlight (Volumetric feel) */}
            <SpotLight
                ref={spotLightRef}
                position={[0, 20, 5]}
                angle={0.3}
                penumbra={0.5}
                intensity={10} // Start DIM
                color={isCritical ? "#FF0000" : "#ffffff"}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
                distance={50}
                attenuation={5}
                anglePower={5}
            />

            {/* Rim Lights for Silhouette */}
            <pointLight position={[-10, 5, -5]} intensity={20} color={baseColor} distance={20} />
            <pointLight position={[10, 5, -5]} intensity={20} color="#0044ff" distance={20} />

            {/* Fill Light */}
            <rectAreaLight
                width={10}
                height={10}
                color="#ffffff"
                intensity={2}
                position={[0, 10, 10]}
                lookAt={() => new THREE.Vector3(0, 0, 0)}
            />

            {/* --- ACTORS --- */}
            <RoboticArm position={[-12, 0, -5]} isScanning={isCritical} />
            <RoboticArm position={[12, 0, -5]} isScanning={isCritical} />

            <group ref={pedestalRef}>
                <CorePedestal />
                <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[0.1, 0.3]}>
                    <group position={[0, 1.2, 0]} scale={0.7} onClick={() => setIsInteracting(true)}>
                        <PCCase onFocus={handleFocus} />
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

            {/* --- POST PROCESSING --- */}
            <EffectComposer>
                {/* Reduced Bloom for cleaner look */}
                <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} radius={0.4} />
                {/* Reduced Noise for clarity */}
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                {/* REMOVED DepthOfField for sharpness */}
            </EffectComposer>
        </>
    );
};
