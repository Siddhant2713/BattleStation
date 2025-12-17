import React, { useRef, useState, useMemo, useEffect } from 'react';
// Re-indexing trigger
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox, Tube, Extrude, Float, Cylinder, Sparkles, MeshDistortMaterial, Instances, Instance } from '@react-three/drei';
import { Motherboard, GPU, CPUCooler, RAMSticks, Fan, PSU, Cables } from './PCComponents.tsx';
import { clampDelta } from '../../utils/AnimationUtils';

export const PCCase = ({ onFocus, color = '#ff2a00' }: { onFocus?: (pos: THREE.Vector3) => void, color?: string }) => {
    const [hovered, setHovered] = useState(false);

    // Simulation State (Refs for performance - no re-renders)
    const simulationState = useRef({ temp: 40, load: 0 });

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Update simulation state without triggering React renders
        const newLoad = (Math.sin(time * 0.5) + 1) / 2;
        simulationState.current.load = newLoad;

        const targetTemp = 40 + newLoad * 40;
        simulationState.current.temp = THREE.MathUtils.lerp(simulationState.current.temp, targetTemp, 0.01);
    });

    // --- Materials ---
    const frameMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: color, // Dynamic Color
        emissive: '#330500',
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.0,
    }), [color]);

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
        const dt = clampDelta(delta);
        const temp = simulationState.current.temp;

        if (coolantRef1.current) {
            coolantRef1.current.time += dt;
            coolantRef1.current.speed = THREE.MathUtils.mapLinear(temp, 30, 80, 0.5, 2.0);
        }
        if (coolantRef2.current) {
            coolantRef2.current.time += dt;
            coolantRef2.current.speed = THREE.MathUtils.mapLinear(temp, 30, 80, 0.5, 2.0);
        }
    });

    // --- Geometry Definitions ---

    // Trellis Frame Construction
    // Normalized Scale: 1 unit = 10cm
    // Frame Length: ~60cm (6.0 units)
    // Frame Height: ~40cm (4.0 units)
    // Frame Width: ~25cm (2.5 units)

    const createTrellisSide = (offsetX: number) => {
        const tubes = [];

        // 1. Main Spar: Headstock -> Swingarm Pivot (Top Front -> Bottom Rear)
        tubes.push(new THREE.CatmullRomCurve3([
            new THREE.Vector3(offsetX, 2.0, 2.5),  // Headstock (Front Top)
            new THREE.Vector3(offsetX, 1.8, 1.5),
            new THREE.Vector3(offsetX * 0.8, -1.0, -1.5),
            new THREE.Vector3(offsetX, -2.0, -2.5) // Pivot (Rear Bottom)
        ]));

        // 2. Bottom Rail: Engine Cradle
        tubes.push(new THREE.CatmullRomCurve3([
            new THREE.Vector3(offsetX, -1.5, 2.5), // Front Engine Mount
            new THREE.Vector3(offsetX, -2.2, 0.0),
            new THREE.Vector3(offsetX, -2.0, -2.5) // Connect to Pivot
        ]));

        // 3. Top Rail: Tank Support
        tubes.push(new THREE.CatmullRomCurve3([
            new THREE.Vector3(offsetX, 2.0, 2.5), // Headstock
            new THREE.Vector3(offsetX, 2.2, 0.0),
            new THREE.Vector3(offsetX, 2.0, -2.5) // Seat Subframe start
        ]));

        // 4. Vertical/Diagonal Bracing
        tubes.push(new THREE.LineCurve3(new THREE.Vector3(offsetX, 2.0, 2.5), new THREE.Vector3(offsetX, -1.5, 2.5))); // Front Vert
        tubes.push(new THREE.LineCurve3(new THREE.Vector3(offsetX, 1.8, 1.5), new THREE.Vector3(offsetX, -2.2, 0.0))); // Mid Diag 1
        tubes.push(new THREE.LineCurve3(new THREE.Vector3(offsetX, 2.2, 0.0), new THREE.Vector3(offsetX * 0.8, -1.0, -1.5))); // Mid Diag 2
        tubes.push(new THREE.LineCurve3(new THREE.Vector3(offsetX * 0.8, -1.0, -1.5), new THREE.Vector3(offsetX, 2.0, -2.5))); // Rear Support

        return tubes;
    };

    const leftFrame = useMemo(() => createTrellisSide(-1.2), []); // Width ~24cm total
    const rightFrame = useMemo(() => createTrellisSide(1.2), []);

    // Crossbars
    const crossBars = useMemo(() => [
        new THREE.LineCurve3(new THREE.Vector3(-1.2, 2.0, 2.5), new THREE.Vector3(1.2, 2.0, 2.5)), // Headstock
        new THREE.LineCurve3(new THREE.Vector3(-1.2, -2.0, -2.5), new THREE.Vector3(1.2, -2.0, -2.5)), // Pivot
        new THREE.LineCurve3(new THREE.Vector3(-1.2, -1.5, 2.5), new THREE.Vector3(1.2, -1.5, 2.5)), // Bottom Front
        new THREE.LineCurve3(new THREE.Vector3(-1.2, 2.0, -2.5), new THREE.Vector3(1.2, 2.0, -2.5)), // Rear Seat
    ], []);

    // Canopy Shape (Tank)
    const canopyShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-1.4, 0);
        shape.bezierCurveTo(-1.4, 1.0, 1.4, 1.0, 1.4, 0); // Top curve
        shape.lineTo(1.2, -3.5);
        shape.lineTo(-1.2, -3.5);
        shape.lineTo(-1.4, 0);
        return shape;
    }, []);

    // Side Wing Shape
    const wingShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(1.0, 0.3);
        shape.lineTo(0.8, -1.5);
        shape.lineTo(0, -1.0);
        shape.lineTo(0, 0);
        return shape;
    }, []);

    // Belly Pan Shape
    const bellyShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(-1.0, 0);
        shape.lineTo(1.0, 0);
        shape.lineTo(0.8, -0.8);
        shape.lineTo(-0.8, -0.8);
        shape.lineTo(-1.0, 0);
        return shape;
    }, []);

    const handleDoubleClick = (e: any) => {
        e.stopPropagation();
        console.log("Focus on component");
    };

    return (
        <group name="DuciChassisAssembly"
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onDoubleClick={handleDoubleClick}
            position={[0, 0, 0]} // Root centered
        >
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1} floatingRange={[0.05, 0.1]}>

                {/* --- GROUP: FRAME --- */}
                <group name="Frame">
                    {/* Left Trellis */}
                    {leftFrame.map((path, i) => (
                        <Tube key={`L-${i}`} args={[path, 12, 0.05, 8, false]}>
                            <primitive object={frameMaterial} attach="material" />
                        </Tube>
                    ))}
                    {/* Right Trellis */}
                    {rightFrame.map((path, i) => (
                        <Tube key={`R-${i}`} args={[path, 12, 0.05, 8, false]}>
                            <primitive object={frameMaterial} attach="material" />
                        </Tube>
                    ))}
                    {/* Crossbars */}
                    {crossBars.map((path, i) => (
                        <Tube key={`C-${i}`} args={[path, 1, 0.04, 8, false]}>
                            <primitive object={frameMaterial} attach="material" />
                        </Tube>
                    ))}
                    {/* Joints */}
                    <Instances range={20}>
                        <sphereGeometry args={[0.07, 16, 16]} />
                        <primitive object={frameMaterial} attach="material" />
                        <Instance position={[-1.2, 2.0, 2.5]} />
                        <Instance position={[1.2, 2.0, 2.5]} />
                        <Instance position={[-1.2, -2.0, -2.5]} />
                        <Instance position={[1.2, -2.0, -2.5]} />
                    </Instances>
                </group>

                {/* --- GROUP: PANELS --- */}
                <group name="Panels">
                    {/* Top Canopy */}
                    <group position={[0, 2.4, 2.0]} rotation={[Math.PI / 2 - 0.1, 0, 0]}>
                        <Extrude args={[canopyShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 }]}>
                            <primitive object={carbonMaterial} attach="material" />
                        </Extrude>
                    </group>
                    {/* Side Wings */}
                    <group position={[-1.3, 1.0, 2.0]} rotation={[0, -0.3, 0]}>
                        <Extrude args={[wingShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01 }]}>
                            <primitive object={carbonMaterial} attach="material" />
                        </Extrude>
                    </group>
                    <group position={[1.3, 1.0, 2.0]} rotation={[0, 0.3, 0]}>
                        <group scale={[-1, 1, 1]}>
                            <Extrude args={[wingShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01 }]}>
                                <primitive object={carbonMaterial} attach="material" />
                            </Extrude>
                        </group>
                    </group>
                    {/* Belly Pan */}
                    <group position={[0, -2.4, 1.5]} rotation={[Math.PI / 2 + 0.1, 0, 0]}>
                        <Extrude args={[bellyShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.03 }]}>
                            <primitive object={carbonMaterial} attach="material" />
                        </Extrude>
                    </group>
                </group>

                {/* --- GROUP: MOTHERBOARD MOUNT --- */}
                {/* Centered in frame, tilted slightly forward for aggression */}
                <group name="MotherboardMount" position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
                    {/* Motherboard Tray */}
                    <RoundedBox args={[2.6, 3.2, 0.1]} position={[0, 0, -0.1]} radius={0.05}>
                        <primitive object={carbonMaterial} attach="material" />
                    </RoundedBox>

                    {/* Motherboard Component */}
                    <Motherboard onFocus={onFocus} simulationState={simulationState} />

                    {/* Sub-components mounted to Mobo */}
                    <group position={[0.2, 0.8, 0.1]}>
                        <CPUCooler onFocus={onFocus} simulationState={simulationState} />
                    </group>
                    <group position={[0.8, 0.8, 0.1]}>
                        <RAMSticks onFocus={onFocus} />
                    </group>
                    <group position={[0, -0.6, 0.2]}>
                        <GPU onFocus={onFocus} simulationState={simulationState} />
                    </group>
                    <Cables />
                </group>

                {/* --- GROUP: PSU MOUNT --- */}
                <group name="PSUMount" position={[0, -2.2, -1.0]}>
                    <PSU onFocus={onFocus} />
                </group>

                {/* --- GROUP: COOLING LOOP --- */}
                <group name="CoolingLoop">
                    {/* Radiator Mount (Left Side) */}
                    {/* Radiator Mount (Left Side) */}
                    <group name="RadiatorMount" position={[-1.8, 0, 0.5]} rotation={[0, 0.3, 0]}>
                        <RoundedBox args={[1.4, 4.0, 0.3]} radius={0.05}>
                            <primitive object={radiatorMaterial} attach="material" />
                        </RoundedBox>
                        <group position={[0, 0, 0.16]}>
                            <Fan position={[0, 1.2, 0]} rpm={1200} size={1.2} />
                            <Fan position={[0, 0, 0]} rpm={1200} size={1.2} />
                            <Fan position={[0, -1.2, 0]} rpm={1200} size={1.2} />
                        </group>
                    </group>

                    {/* Reservoir Mount (Right Side) */}
                    {/* Reservoir Mount (Right Side) */}
                    <group name="ReservoirMount" position={[1.8, -1.0, 0.5]} rotation={[0, -0.3, 0]}>
                        <Cylinder args={[0.35, 0.35, 2.0, 16]} position={[0, 0.5, 0]}>
                            <meshPhysicalMaterial color="#ff3c00" transmission={0.9} thickness={0.2} roughness={0.1} />
                        </Cylinder>
                        <Cylinder args={[0.4, 0.45, 0.6, 16]} position={[0, -0.8, 0]}>
                            <primitive object={radiatorMaterial} attach="material" />
                        </Cylinder>
                        <Cylinder args={[0.4, 0.4, 0.2, 16]} position={[0, 1.6, 0]}>
                            <primitive object={radiatorMaterial} attach="material" />
                        </Cylinder>
                    </group>

                    {/* Tubing Routing */}
                    {/* Tubing Routing */}
                    <group name="Tubing">
                        {/* 1. Pump (Res Bottom) -> GPU In */}
                        <Tube args={[new THREE.CatmullRomCurve3([
                            new THREE.Vector3(1.8, -1.8, 0.5), // Pump Out
                            new THREE.Vector3(1.5, -2.2, 0.5),
                            new THREE.Vector3(0.5, -2.2, 0.5),
                            new THREE.Vector3(0.5, -1.0, 0.5), // GPU In (approx)
                        ]), 20, 0.04, 8, false]}>
                            {/* @ts-ignore */}
                            <coolantMaterial ref={coolantRef1} transparent color="#ff3c00" />
                        </Tube>

                        {/* 2. GPU Out -> CPU In */}
                        <Tube args={[new THREE.CatmullRomCurve3([
                            new THREE.Vector3(0.0, -0.2, 0.5), // GPU Out
                            new THREE.Vector3(-0.4, 0.2, 0.6),
                            new THREE.Vector3(-0.2, 0.8, 0.5), // CPU In
                        ]), 16, 0.04, 8, false]}>
                            {/* @ts-ignore */}
                            <coolantMaterial ref={coolantRef2} transparent color="#ff3c00" />
                        </Tube>

                        {/* 3. CPU Out -> Radiator Top */}
                        <Tube args={[new THREE.CatmullRomCurve3([
                            new THREE.Vector3(0.2, 1.2, 0.5), // CPU Out
                            new THREE.Vector3(0.2, 1.8, 0.5),
                            new THREE.Vector3(-1.2, 2.0, 0.5),
                            new THREE.Vector3(-1.6, 1.8, 0.5), // Rad Top
                        ]), 20, 0.04, 8, false]}>
                            {/* @ts-ignore */}
                            <coolantMaterial transparent color="#ff3c00" />
                        </Tube>

                        {/* 4. Radiator Bottom -> Reservoir Top */}
                        <Tube args={[new THREE.CatmullRomCurve3([
                            new THREE.Vector3(-1.6, -1.8, 0.5), // Rad Bottom
                            new THREE.Vector3(-1.2, -2.2, 0.5),
                            new THREE.Vector3(1.2, -2.2, 0.5),
                            new THREE.Vector3(1.8, 0.8, 0.5), // Res Top
                        ]), 24, 0.04, 8, false]}>
                            {/* @ts-ignore */}
                            <coolantMaterial transparent color="#ff3c00" />
                        </Tube>
                    </group>
                </group>

                {/* --- GROUP: PEDESTAL ATTACH POINT --- */}
                <group name="PedestalAttach" position={[0, -2.5, 0]}>
                    {/* Visual marker for where the levitation happens */}
                    {/* Invisible in final, but useful for alignment */}
                </group>

            </Float>
        </group>
    );
};
