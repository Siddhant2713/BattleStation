import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useBuilderStore } from '../../store/useBuilderStore';
import { CaseModel, ComponentRenderer } from '../Three/PCModels';
import { PartType, PCPart } from '../../types';
import gsap from 'gsap';

// Slot definitions (position, rotation, type)
const SLOTS: Record<PartType, { position: [number, number, number], rotation?: [number, number, number] }> = {
    [PartType.GPU]: { position: [-0.5, 0.5, 0] },
    [PartType.CPU]: { position: [-0.8, 2.2, 0.5], rotation: [0, 0, Math.PI / 2] },
    [PartType.RAM]: { position: [-0.7, 2.2, 1.0] }, // Base position for RAM
    [PartType.FAN]: { position: [0, 0.5, 1.9] },
    [PartType.CASE]: { position: [0, 0, 0] },
    [PartType.STORAGE]: { position: [0, -1, 0] },
    [PartType.COOLER]: { position: [-0.8, 2.2, 0.8] },
    [PartType.PSU]: { position: [0, -1.5, 0] },
};

const GhostPart = () => {
    const { draggingPart, setPart } = useBuilderStore();
    const { camera, raycaster, pointer, scene } = useThree();
    const ref = useRef<THREE.Group>(null);
    const [snapped, setSnapped] = useState(false);

    useFrame(() => {
        if (!ref.current || !draggingPart) return;

        // Raycast to a virtual plane facing the camera
        const planeNormal = new THREE.Vector3(0, 0, 1);
        const planeConstant = 0;
        const plane = new THREE.Plane(planeNormal, planeConstant);
        const target = new THREE.Vector3();

        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(plane, target);

        // Smooth follow
        ref.current.position.lerp(target, 0.2);

        // Check snapping
        const slot = SLOTS[draggingPart.type];
        if (slot) {
            const slotPos = new THREE.Vector3(...slot.position);
            const dist = ref.current.position.distanceTo(slotPos);

            if (dist < 1.5) { // Snap radius
                ref.current.position.lerp(slotPos, 0.5);
                if (!snapped) setSnapped(true);
            } else {
                if (snapped) setSnapped(false);
            }
        }
    });

    // Handle drop (this would ideally be handled by a global mouse up listener, 
    // but for now we assume the UI handles the "end drag" and calls a function.
    // actually, we can listen to pointer up here if the canvas captures events)

    return draggingPart ? (
        <group ref={ref}>
            <ComponentRenderer
                type={draggingPart.type}
                data={draggingPart}
                rgbColor="#ff0033"
                isGhost={true}
            />
            {snapped && (
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.5} />
                </mesh>
            )}
        </group>
    ) : null;
};

const InstalledParts = () => {
    const { parts } = useBuilderStore();

    return (
        <group>
            {Object.entries(parts).map(([type, part]) => {
                if (!part) return null;
                const slot = SLOTS[type as PartType];
                return (
                    <group key={type} position={slot?.position} rotation={slot?.rotation}>
                        <ComponentRenderer type={type as PartType} data={part} rgbColor="#ff0033" />
                    </group>
                );
            })}
        </group>
    );
};

export const BuilderScene = () => {
    const { parts, setPart, draggingPart } = useBuilderStore();

    // Drop handler
    const handlePointerUp = (e: any) => {
        if (draggingPart) {
            // Check if close to slot
            const slot = SLOTS[draggingPart.type];
            // This logic is simplified; normally we'd check intersection with a specific drop zone mesh
            // For now, we'll assume if they drop it in the canvas, it installs (if valid)
            setPart(draggingPart.type, draggingPart);
            // We need to clear draggingPart in the store, but the store doesn't have a clearDraggingPart action yet.
            // I should add it or use a separate state.
            // Actually, the UI usually handles the drag end.
        }
    };

    return (
        <Canvas
            shadows
            camera={{ position: [6, 3, 6], fov: 45 }}
            onPointerUp={handlePointerUp}
        >
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-5, 5, -5]} intensity={5} color="#ff0033" distance={10} />

            <group position={[0, -1.5, 0]}>
                <CaseModel />
                <InstalledParts />
                <GhostPart />
            </group>

            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2} far={4} color="#000" />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />
        </Canvas>
    );
};
