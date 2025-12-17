import React, { useRef, useState, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { RoundedBox, Tube, Instances, Instance, shaderMaterial, Detailed, useTexture, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// --- Optimized Shaders ---

// 1. Ultra-lightweight Coolant Shader (UV Scroll only)
export const CoolantMaterial = shaderMaterial(
    { time: 0, color: new THREE.Color(1.0, 0.2, 0.0) },
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      // Simple UV scroll for flow effect
      float flow = step(0.5, fract(vUv.x * 4.0 - time * 2.0)); 
      vec3 finalColor = mix(color, color * 1.5, flow * 0.3);
      gl_FragColor = vec4(finalColor, 0.8);
    }
    `
);

// 2. Vertex-Rotation Shader for Fans (No CPU overhead)
export const FanMaterial = shaderMaterial(
    { time: 0, color: new THREE.Color(1.0, 1.0, 1.0), speed: 10.0 },
    `
    uniform float time;
    uniform float speed;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Rotate around Z axis
      float angle = time * speed;
      float s = sin(angle);
      float c = cos(angle);
      
      // Rotate only if not center hub (approximate by distance)
      if (length(pos.xy) > 0.2) {
          float x = pos.x * c - pos.y * s;
          float y = pos.x * s + pos.y * c;
          pos.x = x;
          pos.y = y;
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    `
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(color, 0.8); // Semi-transparent blades
    }
    `
);

extend({ CoolantMaterial, FanMaterial });

// --- Shared Materials (Instanced where possible) ---
const materials = {
    matteBlack: new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.8, metalness: 0.2 }),
    glossyBlack: new THREE.MeshStandardMaterial({ color: '#050505', roughness: 0.2, metalness: 0.8 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, metalness: 1.0 }),
    pcb: new THREE.MeshStandardMaterial({ color: '#050505', roughness: 0.8, metalness: 0.1 }),
    ledOrange: new THREE.MeshBasicMaterial({ color: '#ff3c00' }),
    copper: new THREE.MeshStandardMaterial({ color: '#b87333', roughness: 0.4, metalness: 0.8 }),
    aluminum: new THREE.MeshStandardMaterial({ color: '#aaaaaa', roughness: 0.5, metalness: 0.9 }),
    cableRed: new THREE.MeshStandardMaterial({ color: '#cc0000', roughness: 0.6 }),
    cableBlack: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.6 }),
};

// --- Reusable Components ---

export const Fan = ({ position, rotation, scale = 1, color = "#ff3c00", rpm = 1000, size = 1.2 }: any) => {
    const matRef = useRef<any>(null);

    useFrame((state) => {
        if (matRef.current) {
            matRef.current.time = state.clock.elapsedTime;
            // Map RPM to speed multiplier roughly
            matRef.current.speed = rpm * 0.01;
        }
    });

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Frame */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[size / 2, 0.05, 8, 12]} />
                <primitive object={materials.matteBlack} attach="material" />
            </mesh>

            {/* Blades (Single Mesh with Vertex Shader Rotation) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[size / 2 - 0.05, size / 2 - 0.05, 0.05, 8, 1, true]} />
                {/* @ts-ignore */}
                <fanMaterial ref={matRef} transparent color="white" />
            </mesh>

            {/* Center Hub */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
                <primitive object={materials.glossyBlack} attach="material" />
            </mesh>

            {/* RGB Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
                <torusGeometry args={[size / 2 - 0.08, 0.02, 8, 12]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
        </group>
    );
};

const InteractivePart = ({ children, onFocus, ...props }: any) => {
    const groupRef = useRef<THREE.Group>(null);

    const handleDoubleClick = (e: any) => {
        e.stopPropagation();
        if (groupRef.current && onFocus) {
            const worldPos = new THREE.Vector3();
            groupRef.current.getWorldPosition(worldPos);
            onFocus(worldPos);
        }
    };

    return (
        <group
            ref={groupRef}
            onDoubleClick={handleDoubleClick}
            {...props}
        >
            {children}
        </group>
    );
};

// --- Main Components ---

// Update Props Interface
interface SimulationProps {
    onFocus?: (pos: THREE.Vector3) => void;
    simulationState?: React.MutableRefObject<{ temp: number; load: number }>;
}

export const Motherboard = ({ onFocus, simulationState }: SimulationProps) => {
    return (
        <InteractivePart onFocus={onFocus} position={[0, 0, 0]}>
            <Detailed distances={[0, 15, 30]}>
                <MotherboardLOD0 hovered={false} />
                <MotherboardLOD1 hovered={false} />
                <MotherboardLOD2 hovered={false} />
            </Detailed>
        </InteractivePart>
    );
};

const MotherboardLOD0 = ({ hovered }: any) => (
    <group>
        {/* PCB: 2.44 width, 3.05 height */}
        <RoundedBox args={[2.44, 3.05, 0.05]} radius={0.02}>
            <primitive object={materials.pcb} attach="material" />
            {hovered && <meshStandardMaterial color="#222" emissive="#111" />}
        </RoundedBox>

        {/* VRM Heatsinks (Aggressive Style) */}
        <group position={[-0.8, 1.0, 0.05]}>
            {/* Left Heatsink - Angled */}
            <mesh position={[-0.2, -0.2, 0]} rotation={[0, 0, 0.1]}>
                <boxGeometry args={[0.6, 1.8, 0.2]} />
                <primitive object={materials.matteBlack} attach="material" />
            </mesh>
            {/* I/O Shroud with Logo Area */}
            <RoundedBox args={[0.7, 1.9, 0.3]} position={[-0.35, -0.2, 0.05]} radius={0.05}>
                <primitive object={materials.glossyBlack} attach="material" />
                <mesh position={[-0.36, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                    <planeGeometry args={[0.2, 0.8]} />
                    <meshBasicMaterial color="#ff3c00" />
                </mesh>
            </RoundedBox>
        </group>

        {/* Top Heatsink */}
        <mesh position={[0.2, 1.35, 0.05]} rotation={[0, 0, -0.05]}>
            <boxGeometry args={[1.8, 0.6, 0.2]} />
            <primitive object={materials.matteBlack} attach="material" />
        </mesh>

        {/* CPU Socket Area (Center Top) */}
        <mesh position={[0.2, 0.8, 0.03]}>
            <boxGeometry args={[0.6, 0.6, 0.02]} />
            <meshStandardMaterial color="#ccc" metalness={0.8} />
        </mesh>

        {/* RAM Slots (Right of CPU) */}
        <group position={[0.8, 0.8, 0.05]}>
            {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[i * 0.12, 0, 0]}>
                    <boxGeometry args={[0.04, 1.0, 0.04]} />
                    <primitive object={materials.matteBlack} attach="material" />
                </mesh>
            ))}
        </group>

        {/* PCIe Slots (Reinforced) */}
        <group position={[0, -0.5, 0.05]}>
            {[0, 1, 2].map((i) => (
                <group key={i} position={[0, i * -0.8, 0]}>
                    <mesh>
                        <boxGeometry args={[1.8, 0.1, 0.06]} />
                        <primitive object={materials.glossyBlack} attach="material" />
                    </mesh>
                    <mesh position={[0, 0, 0.01]}>
                        <boxGeometry args={[1.82, 0.12, 0.02]} />
                        <primitive object={materials.chrome} attach="material" />
                    </mesh>
                </group>
            ))}
        </group>

        {/* Chipset Heatsink (Bottom Right) */}
        <group position={[0.6, -1.0, 0.05]}>
            <boxGeometry args={[1.0, 0.8, 0.05]} />
            <primitive object={materials.matteBlack} attach="material" />
            <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[0.8, 0.6]} />
                <meshBasicMaterial color="#ff3c00" transparent opacity={0.8} />
            </mesh>
            {/* M.2 Shield */}
            <mesh position={[0, 0.6, 0.02]}>
                <boxGeometry args={[1.0, 0.3, 0.04]} />
                <primitive object={materials.aluminum} attach="material" />
            </mesh>
        </group>

        {/* Capacitors */}
        <Instances range={30}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
            <primitive object={materials.aluminum} attach="material" />
            {[...Array(8)].map((_, i) => <Instance key={`t-${i}`} position={[-0.5 + i * 0.15, 0.8, 0.05]} />)}
            {[...Array(8)].map((_, i) => <Instance key={`b-${i}`} position={[-0.5 + i * 0.15, 0.4, 0.05]} />)}
        </Instances>
    </group>
);

const MotherboardLOD1 = ({ hovered }: any) => (
    <group>
        <boxGeometry args={[2.44, 3.05, 0.05]} />
        <primitive object={materials.pcb} attach="material" />
        <mesh position={[-1.0, 1.0, 0.05]}>
            <boxGeometry args={[0.5, 1.8, 0.15]} />
            <primitive object={materials.matteBlack} attach="material" />
        </mesh>
    </group>
);

const MotherboardLOD2 = ({ hovered }: any) => (
    <group>
        <boxGeometry args={[2.44, 3.05, 0.05]} />
        <primitive object={materials.pcb} attach="material" />
    </group>
);


export const GPU = ({ onFocus, simulationState }: SimulationProps) => {
    return (
        <InteractivePart onFocus={onFocus} position={[0, 0, 0]}>
            <Detailed distances={[0, 15, 30]}>
                <GPULOD0 />
                <GPULOD1 />
                <GPULOD2 />
            </Detailed>
        </InteractivePart>
    );
};

const GPULOD0 = () => (
    <group>
        {/* PCB */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.2, 1.4, 0.05]} />
            <primitive object={materials.pcb} attach="material" />
        </mesh>
        {/* Backplate (Detailed) */}
        <RoundedBox args={[3.2, 1.4, 0.02]} position={[0, 0, -0.04]} radius={0.02}>
            <primitive object={materials.aluminum} attach="material" />
            {/* Cutouts */}
            <mesh position={[0.5, 0, 0.02]}>
                <planeGeometry args={[1.0, 0.8]} />
                <meshStandardMaterial color="#111" />
            </mesh>
        </RoundedBox>
        {/* Waterblock (Replaces Heatsink) */}
        <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[3.2, 1.4, 0.15]} />
            <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.2} transmission={0.2} thickness={0.5} />
        </mesh>
        {/* Acrylic Top */}
        <RoundedBox args={[3.2, 1.4, 0.05]} position={[0, 0, 0.18]} radius={0.05}>
            <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.05} thickness={0.2} transparent />
        </RoundedBox>
        {/* RGB Strip */}
        <mesh position={[0, 0.65, 0.15]}>
            <boxGeometry args={[3.0, 0.05, 0.02]} />
            <meshBasicMaterial color="#ff3c00" />
        </mesh>
        {/* Fittings Ports */}
        <group position={[1.2, 0.5, 0.2]}>
            <Cylinder args={[0.15, 0.15, 0.2, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <primitive object={materials.chrome} attach="material" />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 0.2, 16]} position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <primitive object={materials.chrome} attach="material" />
            </Cylinder>
        </group>
    </group>
);

const GPULOD1 = () => (
    <group>
        <boxGeometry args={[3.3, 1.5, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        <mesh position={[0, 0.76, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[3.0, 0.1, 0.02]} />
            <meshBasicMaterial color="#ff3c00" toneMapped={false} />
        </mesh>
    </group>
);

const GPULOD2 = () => (
    <group>
        <boxGeometry args={[3.3, 1.5, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
    </group>
);

export const CPUCooler = ({ onFocus, simulationState }: SimulationProps) => {
    const coolantRef = useRef<any>(null);
    useFrame((state, delta) => {
        if (coolantRef.current) {
            // Use clamped delta for stability
            const dt = Math.min(delta, 0.1);
            coolantRef.current.time += dt;

            const temp = simulationState?.current?.temp ?? 40;
            coolantRef.current.speed = THREE.MathUtils.mapLinear(temp, 30, 80, 0.5, 2.0);
        }
    });

    return (
        <InteractivePart onFocus={onFocus} position={[0, 0, 0]}>
            <group>
                {/* Mounting Bracket */}
                <RoundedBox args={[0.8, 0.8, 0.05]} radius={0.02}>
                    <primitive object={materials.chrome} attach="material" />
                </RoundedBox>
                {/* Block Body */}
                <RoundedBox args={[0.7, 0.7, 0.15]} position={[0, 0, 0.1]} radius={0.05}>
                    <primitive object={materials.matteBlack} attach="material" />
                </RoundedBox>
                {/* Acrylic Top */}
                <RoundedBox args={[0.65, 0.65, 0.1]} position={[0, 0, 0.2]} radius={0.02}>
                    <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.05} thickness={0.2} transparent />
                </RoundedBox>
                {/* Coolant Liquid */}
                <mesh position={[0, 0, 0.18]}>
                    <boxGeometry args={[0.6, 0.6, 0.05]} />
                    {/* @ts-ignore */}
                    <coolantMaterial ref={coolantRef} transparent />
                </mesh>
                {/* Fittings */}
                <group position={[0, 0.2, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
                    <Cylinder args={[0.1, 0.1, 0.15, 12]} position={[0.15, 0, 0]}>
                        <primitive object={materials.chrome} attach="material" />
                    </Cylinder>
                    <Cylinder args={[0.1, 0.1, 0.15, 12]} position={[-0.15, 0, 0]}>
                        <primitive object={materials.chrome} attach="material" />
                    </Cylinder>
                </group>
            </group>
        </InteractivePart>
    );
};

export const RAMSticks = ({ onFocus }: any) => {
    return (
        <InteractivePart onFocus={onFocus} position={[0, 0, 0]}>
            <group>
                {[0, 1, 2, 3].map((i) => (
                    <group key={i} position={[i * 0.12, 0, 0]}>
                        <boxGeometry args={[0.04, 1.0, 0.3]} />
                        <primitive object={materials.matteBlack} attach="material" />
                        <mesh position={[0, 0, 0.16]}>
                            <boxGeometry args={[0.04, 1.0, 0.04]} />
                            <meshBasicMaterial color="#ff3c00" toneMapped={false} />
                        </mesh>
                    </group>
                ))}
            </group>
        </InteractivePart>
    );
};

export const PSU = ({ onFocus }: any) => {
    return (
        <InteractivePart onFocus={onFocus}>
            <group>
                <RoundedBox args={[1.5, 1.4, 0.86]} radius={0.02}>
                    <primitive object={materials.matteBlack} attach="material" />
                </RoundedBox>
                <group position={[0, 0, 0.44]}>
                    <circleGeometry args={[0.6, 16]} />
                    <meshStandardMaterial color="#111" wireframe />
                    <mesh position={[0, 0, -0.05]}>
                        <circleGeometry args={[0.6, 16]} />
                        <primitive object={materials.matteBlack} attach="material" />
                    </mesh>
                </group>
            </group>
        </InteractivePart>
    );
};

export const Cables = () => {
    // 24-Pin: Mobo Right Edge -> PSU
    const cableCurve24Pin = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.2, 0.5, 0.05), // Mobo Right Edge
        new THREE.Vector3(1.4, 0.5, -0.2), // Behind Tray
        new THREE.Vector3(1.4, -1.5, -0.2), // Down
        new THREE.Vector3(0.5, -2.5, -0.5), // PSU
    ]), []);

    // GPU Power: GPU Top -> PSU
    const cableCurveGPU = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, -0.5, 0.4), // GPU Top Edge
        new THREE.Vector3(0.5, -0.8, 0.4), // Loop Down
        new THREE.Vector3(0.8, -1.2, 0.2), // Back
        new THREE.Vector3(0.8, -2.0, -0.2), // PSU
    ]), []);

    return (
        <group>
            <Tube args={[cableCurve24Pin, 16, 0.06, 6, false]}>
                <primitive object={materials.cableRed} attach="material" />
            </Tube>
            <Tube args={[cableCurve24Pin, 16, 0.06, 6, false]} position={[0.02, 0.02, 0]}>
                <primitive object={materials.cableBlack} attach="material" />
            </Tube>
            <Tube args={[cableCurveGPU, 16, 0.05, 6, false]}>
                <primitive object={materials.cableRed} attach="material" />
            </Tube>
        </group>
    );
};
