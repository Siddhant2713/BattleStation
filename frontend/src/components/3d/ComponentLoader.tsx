import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

interface ComponentLoaderProps {
    url: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    onLoaded?: () => void;
    placeholderColor?: string;
}

const Model = ({ url, ...props }: ComponentLoaderProps) => {
    const { scene } = useGLTF(url);

    // Apply custom material logic here if needed, e.g. making glass panels transparent
    scene.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Example: If material name contains 'Glass', make it transparent
            if (child.material.name.includes('Glass')) {
                child.material.transparent = true;
                child.material.opacity = 0.3;
                child.material.roughness = 0.1;
                child.material.metalness = 0.9;
            }
        }
    });

    return <primitive object={scene} {...props} />;
};

export const ComponentLoader: React.FC<ComponentLoaderProps> = ({
    url,
    placeholderColor = "#FF003C",
    ...props
}) => {
    return (
        <Suspense fallback={
            <mesh position={props.position} rotation={props.rotation} scale={props.scale}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={placeholderColor} wireframe />
            </mesh>
        }>
            <Model url={url} {...props} />
        </Suspense>
    );
};

// Preload common assets
// useGLTF.preload('/assets/models/case_default.glb');
