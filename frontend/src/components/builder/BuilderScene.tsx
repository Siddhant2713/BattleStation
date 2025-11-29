import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, useCursor, Grid, Stage } from '@react-three/drei';
import * as THREE from 'three';
import { useBuilderStore } from '../../store/useBuilderStore';

export const BuilderScene = () => {
    const { draggingPart, selectPart, setDraggingPart } = useBuilderStore();
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    const planeRef = useRef<THREE.Mesh>(null);
    const ghostRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (draggingPart && ghostRef.current && planeRef.current) {
            // Raycast to plane
            const raycaster = state.raycaster;
            const intersects = raycaster.intersectObject(planeRef.current);

            if (intersects.length > 0) {
                const point = intersects[0].point;
                // Snap to grid logic (e.g., 0.5 units)
                const snap = 0.5;
                ghostRef.current.position.set(
                    Math.round(point.x / snap) * snap,
                    Math.max(0, point.y), // Keep above ground
                    Math.round(point.z / snap) * snap
                );
            }
        }
    });

    const handlePointerUp = () => {
        if (draggingPart && ghostRef.current) {
            // Place the part
            selectPart(draggingPart.type, draggingPart);
            setDraggingPart(null);
        }
    };

    return (
        <>
            <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />

            <Stage environment="city" intensity={0.5} adjustCamera={false}>
                {/* Build Area / Plane */}
                <mesh
                    ref={planeRef}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -0.01, 0]}
                    scale={20}
                    visible={false} // Invisible plane for raycasting
                    onPointerUp={handlePointerUp}
                >
                    <planeGeometry />
                    <meshBasicMaterial color="red" wireframe />
                </mesh>

                <Grid infiniteGrid fadeDistance={30} sectionColor="#FF0033" cellColor="#333" />

                {/* Ghost Mesh for Dragging */}
                {draggingPart && (
                    <group ref={ghostRef}>
                        <mesh>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial color="#FF0033" transparent opacity={0.5} wireframe />
                        </mesh>
                    </group>
                )}

                {/* Placed Parts (Placeholder visualization) */}
                <PlacedParts />
            </Stage>
        </>
    );
};

const PlacedParts = () => {
    const { selectedParts } = useBuilderStore();

    return (
        <group>
            {/* Case (Always present or selected) */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[2, 4, 4]} />
                <meshStandardMaterial color="#1a1a1a" transparent opacity={0.5} />
            </mesh>

            {/* Visualize other parts based on selection */}
            {selectedParts.gpu && (
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[0.5, 0.2, 1.5]} />
                    <meshStandardMaterial color="#00FF00" />
                </mesh>
            )}
        </group>
    );
};
