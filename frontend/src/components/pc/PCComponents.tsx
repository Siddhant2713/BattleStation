import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder, useCursor } from '@react-three/drei';
import * as THREE from 'three';

// --- Reusable Components ---

const Fan = ({ position, rotation, scale = 1, color = "#333", rpm = 1000 }: any) => {
    const fanRef = useRef<THREE.Group>(null);
    useFrame((_, delta) => {
        if (fanRef.current) {
            fanRef.current.rotation.z -= delta * (rpm / 60) * 0.5; // Simple RPM approximation
        }
    });

    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Frame */}
            <RoundedBox args={[1.2, 1.2, 0.2]} radius={0.05}>
                <meshStandardMaterial color="#111" />
            </RoundedBox>
            {/* Blades */}
            <group ref={fanRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.1]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <mesh key={i} rotation={[0, 0, (i / 7) * Math.PI * 2]} position={[0, 0, 0]}>
                        <boxGeometry args={[0.15, 0.5, 0.02]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                ))}
            </group>
            {/* RGB Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.02, 16, 32]} />
                <meshBasicMaterial color="#FF003C" toneMapped={false} />
            </mesh>
        </group>
    );
};

// --- Main Components ---

// --- Interactive Wrapper ---
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

    // Clone children to inject hover props if they are meshes/materials
    // Or just wrap them in a group that handles events
    return (
        <group
            ref={groupRef}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={() => setHovered(false)}
            onDoubleClick={handleDoubleClick}
            {...props}
        >
            <group>
                {/* We can use a context or cloneElement to pass 'hovered' state down if needed for material changes */}
                {/* For now, we will pass 'hovered' as a prop to the specific render functions below */}
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

export const Motherboard = ({ onFocus }: any) => {
    return (
        <InteractivePart onFocus={onFocus} position={[-1, 2.25, 0]}>
            <MotherboardContent />
        </InteractivePart>
    );
};

const MotherboardContent = ({ hovered }: any) => (
    <group>
        {/* PCB */}
        <RoundedBox args={[0.1, 3.8, 3.8]} radius={0.02}>
            <meshStandardMaterial
                color="#050505"
                roughness={0.8}
                emissive={hovered ? "#222" : "#000"}
            />
        </RoundedBox>

        {/* VRM Heatsinks */}
        <RoundedBox args={[0.15, 0.5, 2]} position={[0.05, 1.5, -0.5]} radius={0.02}>
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <RoundedBox args={[0.15, 2, 0.5]} position={[0.05, 0.5, -1.5]} radius={0.02}>
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* RAM Slots */}
        <group position={[0.05, 0.8, 0.8]}>
            {[0, 1, 2, 3].map((i) => (
                <mesh key={i} position={[0, 0, i * 0.15]}>
                    <boxGeometry args={[0.05, 1.2, 0.05]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
            ))}
        </group>

        {/* PCIe Slots */}
        <group position={[0.05, -1, 0]}>
            {[0, 1, 2].map((i) => (
                <mesh key={i} position={[0, i * -0.8, 0]}>
                    <boxGeometry args={[0.05, 0.1, 2.5]} />
                    <meshStandardMaterial color="#333" metalness={0.5} />
                </mesh>
            ))}
        </group>
    </group>
);

export const GPU = ({ onFocus }: any) => {
    return (
        <InteractivePart onFocus={onFocus} position={[-0.5, 1.2, 0]}>
            <GPUContent />
        </InteractivePart>
    );
};

const GPUContent = ({ hovered }: any) => (
    <group>
        {/* PCB */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 0.1, 3]} />
            <meshStandardMaterial color="#111" />
        </mesh>
        {/* Shroud */}
        <RoundedBox args={[1.4, 0.3, 2.8]} position={[0, -0.15, 0]} radius={0.05}>
            <meshStandardMaterial
                color={hovered ? "#2a2a2a" : "#222"}
                metalness={0.6}
                roughness={0.4}
                emissive={hovered ? "#FF003C" : "#000000"}
                emissiveIntensity={hovered ? 0.2 : 0}
            />
        </RoundedBox>
        {/* Fans */}
        <Fan position={[0, -0.31, -0.8]} rotation={[Math.PI / 2, 0, 0]} scale={0.6} rpm={800} />
        <Fan position={[0, -0.31, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.6} rpm={800} />
        <Fan position={[0, -0.31, 0.8]} rotation={[Math.PI / 2, 0, 0]} scale={0.6} rpm={800} />
        {/* Side RGB Logo */}
        <mesh position={[0.71, -0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.5, 0.1]} />
            <meshBasicMaterial color="#FF003C" toneMapped={false} />
        </mesh>
    </group>
);

export const CPUCooler = ({ onFocus }: any) => {
    return (
        <InteractivePart onFocus={onFocus} position={[-0.8, 2.8, 0]}>
            <CPUCoolerContent />
        </InteractivePart>
    );
};

const CPUCoolerContent = ({ hovered }: any) => (
    <group>
        {/* Pump Block */}
        <Cylinder args={[0.3, 0.3, 0.2]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial
                color="#111"
                metalness={0.5}
                emissive={hovered ? "#00FFFF" : "#000"}
                emissiveIntensity={hovered ? 0.2 : 0}
            />
        </Cylinder>
        {/* RGB Ring */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.11, 0, 0]}>
            <ringGeometry args={[0.2, 0.25, 32]} />
            <meshBasicMaterial color="#00FFFF" toneMapped={false} />
        </mesh>
        {/* Tubes (Simplified) */}
        <mesh position={[0.5, 0.5, 0]}>
            <tubeGeometry args={[new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0.5, 1, 0),
                new THREE.Vector3(1, 1.5, 1) // Leading to top radiator
            ]), 20, 0.05, 8, false]} />
            <meshStandardMaterial color="#111" roughness={0.3} />
        </mesh>
    </group>
);

export const RAMSticks = ({ onFocus }: any) => {
    return (
        <InteractivePart onFocus={onFocus} position={[-0.9, 3.05, 0.8]}>
            <RAMSticksContent />
        </InteractivePart>
    );
};

const RAMSticksContent = ({ hovered }: any) => (
    <group>
        {[0, 2].map((i) => ( // 2 sticks populated
            <group key={i} position={[0, 0, i * 0.15]}>
                <boxGeometry args={[0.1, 1.2, 0.05]} />
                <meshStandardMaterial color="#111" />
                {/* RGB Strip */}
                <mesh position={[0.06, 0, 0]}>
                    <planeGeometry args={[0.01, 1.1]} />
                    <meshBasicMaterial color={hovered ? "#FF003C" : "#FF003C"} toneMapped={false} />
                </mesh>
            </group>
        ))}
    </group>
);

export const CaseFans = ({ onFocus }: any) => {
    return (
        <InteractivePart onFocus={onFocus}>
            <CaseFansContent />
        </InteractivePart>
    );
};

const CaseFansContent = ({ hovered }: any) => (
    <group>
        {/* Front Intake */}
        <Fan position={[0, 1.5, 2.1]} rotation={[0, 0, 0]} rpm={1200} />
        <Fan position={[0, 3.0, 2.1]} rotation={[0, 0, 0]} rpm={1200} />

        {/* Rear Exhaust */}
        <Fan position={[0, 3.5, -2.1]} rotation={[0, Math.PI, 0]} rpm={1200} />
    </group>
);
