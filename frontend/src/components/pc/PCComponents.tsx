import React, { useRef, useState, useMemo, useEffect } from 'react';
// Re-indexing trigger
import { useFrame, extend } from '@react-three/fiber';
import { RoundedBox, Cylinder, useCursor, Tube, Extrude, Instance, Instances, shaderMaterial, Detailed } from '@react-three/drei';
import * as THREE from 'three';

// --- Custom Shaders ---

const CoolantMaterial = shaderMaterial(
    { time: 0, color: new THREE.Color(1.0, 0.2, 0.0), speed: 1.0 },
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
    uniform float speed;
    varying vec2 vUv;
    void main() {
      float flow = sin(vUv.x * 10.0 - time * speed * 3.0);
      vec3 finalColor = mix(color, vec3(1.0, 0.5, 0.0), flow * 0.2);
      gl_FragColor = vec4(finalColor, 0.8);
    }
    `
);

extend({ CoolantMaterial });

// --- Materials ---
const materials = {
    matteBlack: new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.8, metalness: 0.2 }),
    glossyBlack: new THREE.MeshStandardMaterial({ color: '#050505', roughness: 0.2, metalness: 0.8 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, metalness: 1.0 }),
    pcb: new THREE.MeshStandardMaterial({ color: '#050505', roughness: 0.8, metalness: 0.1 }),
    fanBlade: new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.6,
        thickness: 0.1,
        transparent: true,
        opacity: 0.5,
    }),
    ledOrange: new THREE.MeshBasicMaterial({ color: '#ff3c00' }),
    copper: new THREE.MeshStandardMaterial({ color: '#b87333', roughness: 0.4, metalness: 0.8 }),
    aluminum: new THREE.MeshStandardMaterial({ color: '#aaaaaa', roughness: 0.5, metalness: 0.9 }),
    cableRed: new THREE.MeshStandardMaterial({ color: '#cc0000', roughness: 0.6 }),
    cableBlack: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.6 }),
};

// --- Reusable Components ---

export const Fan = ({ position, rotation, scale = 1, color = "#ff3c00", rpm = 1000, size = 1.2, temp = 40 }: any) => {
    const fanRef = useRef<THREE.Group>(null);
    const [currentRpm, setCurrentRpm] = useState(0);

    useFrame((_, delta) => {
        const targetRpm = THREE.MathUtils.mapLinear(temp, 30, 80, 800, 2500);
        const newRpm = THREE.MathUtils.lerp(currentRpm, targetRpm, delta * 2);
        setCurrentRpm(newRpm);

        if (fanRef.current) {
            fanRef.current.rotation.z -= delta * (newRpm / 60);
        }
    });

    const blurOpacity = THREE.MathUtils.mapLinear(currentRpm, 800, 2500, 0, 0.8);

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <group>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[size / 2, 0.05, 8, 24]} />
                    <primitive object={materials.matteBlack} attach="material" />
                </mesh>
                {[1, -1].map(x => [1, -1].map(y => (
                    <mesh key={`${x}-${y}`} position={[x * (size / 2 - 0.1), y * (size / 2 - 0.1), 0]}>
                        <boxGeometry args={[0.2, 0.2, 0.15]} />
                        <primitive object={materials.matteBlack} attach="material" />
                    </mesh>
                )))}
            </group>

            <group ref={fanRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
                    <primitive object={materials.glossyBlack} attach="material" />
                </mesh>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <mesh key={i} rotation={[0, 0, (i / 7) * Math.PI * 2]} position={[0, 0, 0]}>
                        <group rotation={[0.2, 0, 0]} position={[0, 0.25, 0]}>
                            <boxGeometry args={[0.12, 0.55, 0.01]} />
                            <primitive object={materials.fanBlade} attach="material" />
                        </group>
                    </mesh>
                ))}
            </group>

            {blurOpacity > 0.1 && (
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
                    <circleGeometry args={[size / 2 - 0.05, 16]} />
                    <meshBasicMaterial color="#333" transparent opacity={blurOpacity * 0.3} depthWrite={false} />
                </mesh>
            )}

            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
                <torusGeometry args={[size / 2 - 0.08, 0.02, 8, 32]} />
                <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
        </group>
    );
};

const InteractivePart = ({ children, onFocus, ...props }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

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
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={() => setHovered(false)}
            onDoubleClick={handleDoubleClick}
            {...props}
        >
            <group>
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { hovered } as any);
                    }
                    return child;
                })}
            </group>
        </group>
    );
};

// --- Main Components ---

// ATX Dimensions: 305mm x 244mm -> 3.05 x 2.44 units
export const Motherboard = ({ onFocus, temp = 40, load = 0 }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current && load > 0.5) {
            const vibration = Math.sin(state.clock.elapsedTime * 500) * 0.0005 * load;
            groupRef.current.position.x = vibration;
        }
    });

    return (
        <InteractivePart onFocus={onFocus} position={[0, 0, 0]}>
            <group ref={groupRef}>
                <Detailed distances={[0, 10, 20]}>
                    <MotherboardLOD0 hovered={false} />
                    <MotherboardLOD1 hovered={false} />
                    <MotherboardLOD2 hovered={false} />
                </Detailed>
            </group>
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

        {/* VRM Heatsinks (Top and Left) */}
        <group position={[-0.8, 1.0, 0.05]}>
            {/* Left Heatsink */}
            <RoundedBox args={[0.5, 1.8, 0.15]} position={[-0.2, -0.2, 0]} radius={0.02}>
                <primitive object={materials.matteBlack} attach="material" />
            </RoundedBox>
            {/* I/O Shroud */}
            <RoundedBox args={[0.6, 1.8, 0.25]} position={[-0.3, -0.2, 0.05]} radius={0.05}>
                <primitive object={materials.glossyBlack} attach="material" />
            </RoundedBox>
        </group>

        {/* Top Heatsink */}
        <RoundedBox args={[1.8, 0.5, 0.15]} position={[0.2, 1.3, 0.05]} radius={0.02}>
            <primitive object={materials.matteBlack} attach="material" />
        </RoundedBox>

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

        {/* PCIe Slots (Bottom Half) */}
        <group position={[0, -0.5, 0.05]}>
            {[0, 1, 2].map((i) => (
                <group key={i} position={[0, i * -0.6, 0]}>
                    <mesh>
                        <boxGeometry args={[1.8, 0.08, 0.04]} />
                        <primitive object={materials.glossyBlack} attach="material" />
                    </mesh>
                    <mesh position={[0, 0, 0.01]}>
                        <boxGeometry args={[1.82, 0.1, 0.01]} />
                        <primitive object={materials.chrome} attach="material" />
                    </mesh>
                </group>
            ))}
        </group>

        {/* Chipset Heatsink (Bottom Right) */}
        <group position={[0.6, -1.0, 0.05]}>
            <boxGeometry args={[0.8, 0.8, 0.04]} />
            <primitive object={materials.matteBlack} attach="material" />
            <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[0.6, 0.6]} />
                <meshBasicMaterial color="#ff3c00" transparent opacity={0.8} />
            </mesh>
        </group>

        {/* Capacitors */}
        <Instances range={20}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
            <primitive object={materials.aluminum} attach="material" />
            {[...Array(5)].map((_, i) => <Instance key={i} position={[-0.5 + i * 0.1, 0.8, 0.05]} />)}
            {[...Array(5)].map((_, i) => <Instance key={`b-${i}`} position={[-0.5 + i * 0.1, 0.4, 0.05]} />)}
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


export const GPU = ({ onFocus, temp = 40, load = 0 }: any) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (groupRef.current && load > 0.6) {
            const vibration = Math.sin(state.clock.elapsedTime * 800) * 0.0003 * load;
            groupRef.current.position.y = vibration;
        }
    });

    return (
        <InteractivePart onFocus={onFocus} position={[0, 0, 0]}>
            <group ref={groupRef}>
                <Detailed distances={[0, 10, 20]}>
                    <GPULOD0 temp={temp} />
                    <GPULOD1 />
                    <GPULOD2 />
                </Detailed>
            </group>
        </InteractivePart>
    );
};

const GPULOD0 = ({ temp }: any) => (
    <group>
        {/* PCB */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.2, 1.4, 0.05]} />
            <primitive object={materials.pcb} attach="material" />
        </mesh>
        {/* Backplate */}
        <RoundedBox args={[3.2, 1.4, 0.02]} position={[0, 0, -0.04]} radius={0.02}>
            <primitive object={materials.aluminum} attach="material" />
        </RoundedBox>
        {/* Heatsink */}
        <mesh position={[0, 0, 0.15]}>
            <boxGeometry args={[3.0, 1.2, 0.25]} />
            <primitive object={materials.aluminum} attach="material" />
        </mesh>
        {/* Shroud */}
        <RoundedBox args={[3.3, 1.5, 0.1]} position={[0, 0, 0.35]} radius={0.1}>
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </RoundedBox>
        {/* Fans */}
        <Fan position={[-1.0, 0, 0.36]} scale={0.45} rpm={1500} temp={temp} />
        <Fan position={[0, 0, 0.36]} scale={0.45} rpm={1500} temp={temp} />
        <Fan position={[1.0, 0, 0.36]} scale={0.45} rpm={1500} temp={temp} />
        {/* RGB Bar */}
        <mesh position={[0, 0.76, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[3.0, 0.1, 0.02]} />
            <meshBasicMaterial color="#ff3c00" toneMapped={false} />
        </mesh>
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

export const CPUCooler = ({ onFocus, temp = 40 }: any) => {
    const coolantRef = useRef<any>(null);
    useFrame((state, delta) => {
        if (coolantRef.current) {
            coolantRef.current.time += delta;
            coolantRef.current.speed = THREE.MathUtils.mapLinear(temp, 30, 80, 0.5, 2.0);
        }
    });

    return (
        <InteractivePart onFocus={onFocus} position={[0, 0, 0]}>
            <group>
                <RoundedBox args={[0.7, 0.7, 0.15]} radius={0.05}>
                    <primitive object={materials.matteBlack} attach="material" />
                </RoundedBox>
                <RoundedBox args={[0.6, 0.6, 0.1]} position={[0, 0, 0.13]} radius={0.02}>
                    <meshPhysicalMaterial color="#ffffff" transmission={0.8} roughness={0.1} thickness={0.2} transparent />
                </RoundedBox>
                <mesh position={[0, 0, 0.1]}>
                    <boxGeometry args={[0.5, 0.5, 0.05]} />
                    {/* @ts-ignore */}
                    <coolantMaterial ref={coolantRef} transparent />
                </mesh>
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
