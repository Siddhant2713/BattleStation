import React, { useRef, useState, useMemo, useEffect } from 'react';
// Re-indexing trigger
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox, Tube, Extrude, Float, Cylinder, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import { Motherboard, GPU, CPUCooler, RAMSticks, Fan, PSU, Cables } from './PCComponents';

export const PCCase = ({ onFocus }: { onFocus?: (pos: THREE.Vector3) => void }) => {
    const [hovered, setHovered] = useState(false);

    // Simulation State
    const [temp, setTemp] = useState(40);
    const [load, setLoad] = useState(0);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        const newLoad = (Math.sin(time * 0.5) + 1) / 2;
        setLoad(newLoad);
        const targetTemp = 40 + newLoad * 40;
        setTemp(prev => THREE.MathUtils.lerp(prev, targetTemp, 0.01));
    });

    // --- Materials ---
    const frameMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#ff2a00',
        metalness: 0.6,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    }), []);

    const carbonMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#111',
        metalness: 0.5,
        roughness: 0.5,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        normalScale: new THREE.Vector2(1, 1),
    }), []);

    const radiatorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#050505',
        metalness: 0.8,
        roughness: 0.4,
    }), []);

    const coolantRef1 = useRef<any>(null);
    const coolantRef2 = useRef<any>(null);

    useFrame((state, delta) => {
        if (coolantRef1.current) {
            coolantRef1.current.time += delta;
            coolantRef1.current.speed = THREE.MathUtils.mapLinear(temp, 30, 80, 0.5, 2.0);
        }
        if (coolantRef2.current) {
            coolantRef2.current.time += delta;
            coolantRef2.current.speed = THREE.MathUtils.mapLinear(temp, 30, 80, 0.5, 2.0);
        }
    });

    // --- Geometry Definitions ---

    // Frame wraps AROUND the ATX components (approx 3x4 units)
    const framePath = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2.0, -3.0, 1.5), // Bottom Front Left
            new THREE.Vector3(-2.0, 3.0, 1.0),  // Top Front Left
            new THREE.Vector3(-1.5, 4.0, -1.0), // Top Back Left
            new THREE.Vector3(-1.5, -2.0, -1.5),// Bottom Back Left
            new THREE.Vector3(-2.0, -3.0, 1.5), // Loop back
        ]);
        curve.closed = true;
        return curve;
    }, []);

    const framePathRight = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.0, -3.0, 1.5), // Bottom Front Right
            new THREE.Vector3(2.0, 3.0, 1.0),  // Top Front Right
            new THREE.Vector3(1.5, 4.0, -1.0), // Top Back Right
            new THREE.Vector3(1.5, -2.0, -1.5),// Bottom Back Right
            new THREE.Vector3(2.0, -3.0, 1.5), // Loop back
        ]);
        curve.closed = true;
        return curve;
    }, []);

    // Crossbars
    const crossBar1 = useMemo(() => new THREE.LineCurve3(new THREE.Vector3(-2.0, 2.5, 1.1), new THREE.Vector3(2.0, 2.5, 1.1)), []);
    const crossBar2 = useMemo(() => new THREE.LineCurve3(new THREE.Vector3(-1.5, 3.8, -1.0), new THREE.Vector3(1.5, 3.8, -1.0)), []);
    const crossBar3 = useMemo(() => new THREE.LineCurve3(new THREE.Vector3(-2.0, -2.8, 1.4), new THREE.Vector3(2.0, -2.8, 1.4)), []);

    // Canopy Shape
    const canopyShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-2.1, 0);
        shape.lineTo(2.1, 0);
        shape.lineTo(1.6, -4);
        shape.lineTo(-1.6, -4);
        shape.lineTo(-2.1, 0);
        return shape;
    }, []);

    const handleDoubleClick = (e: any) => {
        e.stopPropagation();
        console.log("Focus on component");
    };

    return (
        <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onDoubleClick={handleDoubleClick}
            rotation={[0.1, -0.4, 0]}
            position={[0, 0.5, 0]}
        >
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                {/* --- FRAME STRUCTURE --- */}
                <group>
                    <Tube args={[framePath, 32, 0.08, 6, true]}>
                        <primitive object={frameMaterial} attach="material" />
                    </Tube>
                    <Tube args={[framePathRight, 32, 0.08, 6, true]}>
                        <primitive object={frameMaterial} attach="material" />
                    </Tube>
                    <Tube args={[crossBar1, 2, 0.06, 6, false]}>
                        <primitive object={frameMaterial} attach="material" />
                    </Tube>
                    <Tube args={[crossBar2, 2, 0.06, 6, false]}>
                        <primitive object={frameMaterial} attach="material" />
                    </Tube>
                    <Tube args={[crossBar3, 2, 0.06, 6, false]}>
                        <primitive object={frameMaterial} attach="material" />
                    </Tube>
                </group>

                {/* --- PANELS --- */}
                <group>
                    {/* Top Canopy */}
                    <group position={[0, 4.2, 1.2]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
                        <Extrude args={[canopyShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]}>
                            <primitive object={carbonMaterial} attach="material" />
                        </Extrude>
                    </group>
                    {/* Bottom Guard */}
                    <group position={[0, -3.2, 0]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
                        <Extrude args={[canopyShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }]}>
                            <primitive object={carbonMaterial} attach="material" />
                        </Extrude>
                    </group>
                </group>

                {/* --- CHASSIS SPINE (CENTRAL MOUNT) --- */}
                <group position={[0, 0.5, 0]}>
                    {/* Backplate */}
                    <RoundedBox args={[3.0, 4.0, 0.1]} position={[0, 0, -0.1]} radius={0.05}>
                        <primitive object={carbonMaterial} attach="material" />
                    </RoundedBox>

                    {/* --- MOTHERBOARD ASSEMBLY --- */}
                    <group position={[0, 0.2, 0.05]}>
                        <Motherboard onFocus={onFocus} temp={temp} load={load} />

                        {/* CPU Cooler on Socket */}
                        <group position={[0.2, 0.8, 0.1]}>
                            <CPUCooler onFocus={onFocus} temp={temp} />
                        </group>

                        {/* RAM in Slots */}
                        <group position={[0.8, 0.8, 0.1]}>
                            <RAMSticks onFocus={onFocus} />
                        </group>

                        {/* GPU in PCIe Slot 1 */}
                        <group position={[0, -0.6, 0.2]}>
                            <GPU onFocus={onFocus} temp={temp} load={load} />
                        </group>

                        {/* Cables */}
                        <Cables />
                    </group>
                </group>

                {/* --- PSU (Bottom Rear) --- */}
                <group position={[0, -2.5, -0.5]} rotation={[0, 0, 0]}>
                    <PSU onFocus={onFocus} />
                </group>

                {/* --- COOLING SYSTEM --- */}
                {/* Radiator + Fans (Front) */}
                <group position={[0, 0.5, 2.5]} rotation={[-0.1, 0, 0]}>
                    <RoundedBox args={[1.4, 4.2, 0.2]} position={[0, 0, -0.15]} radius={0.02}>
                        <primitive object={radiatorMaterial} attach="material" />
                    </RoundedBox>
                    <Fan position={[0, 1.3, 0.1]} rpm={1200} size={1.2} temp={temp} />
                    <Fan position={[0, 0, 0.1]} rpm={1200} size={1.2} temp={temp} />
                    <Fan position={[0, -1.3, 0.1]} rpm={1200} size={1.2} temp={temp} />
                </group>

                {/* Reservoir (Side Mounted) */}
                <group position={[-1.8, 0, 0.5]}>
                    <Cylinder args={[0.3, 0.3, 2.5, 16]}>
                        <meshPhysicalMaterial color="#ff3c00" transmission={0.9} thickness={0.2} roughness={0.1} />
                    </Cylinder>
                    <Cylinder args={[0.35, 0.35, 0.1, 16]} position={[0, 1.25, 0]}>
                        <primitive object={radiatorMaterial} attach="material" />
                    </Cylinder>
                    <Cylinder args={[0.35, 0.35, 0.1, 16]} position={[0, -1.25, 0]}>
                        <primitive object={radiatorMaterial} attach="material" />
                    </Cylinder>
                </group>

                {/* --- TUBING (Physics Correct) --- */}
                <group>
                    {/* CPU Out -> Radiator Top */}
                    <Tube args={[new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0.2, 1.3, 0.2), // CPU Block
                        new THREE.Vector3(0.2, 1.8, 0.5), // Up
                        new THREE.Vector3(0, 2.0, 2.3), // Rad Top
                    ]), 32, 0.04, 6, false]}>
                        {/* @ts-ignore */}
                        <coolantMaterial ref={coolantRef1} transparent />
                    </Tube>

                    {/* GPU Out -> Reservoir Bottom */}
                    <Tube args={[new THREE.CatmullRomCurve3([
                        new THREE.Vector3(0.5, -0.5, 0.5), // GPU Block
                        new THREE.Vector3(0.8, -1.0, 0.8), // Out
                        new THREE.Vector3(-1.0, -1.5, 0.8), // Across
                        new THREE.Vector3(-1.8, -1.2, 0.5), // Res Bottom
                    ]), 32, 0.04, 6, false]}>
                        {/* @ts-ignore */}
                        <coolantMaterial ref={coolantRef2} transparent />
                    </Tube>
                </group>

                {/* --- GLOBAL VFX --- */}
                <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#fff" />

                {temp > 50 && (
                    <mesh position={[0, 1.5, 0]}>
                        <sphereGeometry args={[1.5, 16, 16]} />
                        <MeshDistortMaterial color="#ffffff" transparent opacity={0.0} distort={0.3} speed={2} roughness={0} />
                    </mesh>
                )}
            </Float>
        </group>
    );
};
