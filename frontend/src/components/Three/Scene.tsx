import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, ContactShadows, SpotLight } from '@react-three/drei';
import { useBuilder, CameraView } from '../../store/BuilderContext';
import { AppStage, PartType, PCPart } from '../../types';
import { CaseModel, ComponentRenderer } from './PCModels';
import { Vector3, ACESFilmicToneMapping } from 'three';
import type { PerspectiveCamera as PerspectiveCameraType } from 'three';
import * as THREE from 'three'; // Fallback only if strictly needed, but named is better. Removing global namespace import.

const CameraController = ({ stage, view }: { stage: AppStage, view: CameraView }) => {
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const targetPos = useRef(new Vector3(5, 3, 5));

  useEffect(() => {
    if (stage === AppStage.ROOM_SETUP) {
        targetPos.current.set(0, 3, 8);
        return;
    }
    if (stage === AppStage.SIMULATION) {
        targetPos.current.set(0, 1.5, 2.5);
        return;
    }
    if (stage === AppStage.LANDING) {
        targetPos.current.set(8, 3, 8);
        return;
    }

    switch (view) {
      case 'SIDE': targetPos.current.set(6, 2, 0); break;
      case 'FRONT': targetPos.current.set(0, 2, 6); break;
      case 'TOP': targetPos.current.set(0, 8, 0); break;
      case 'ISO': default: targetPos.current.set(5, 3, 5); break;
    }
  }, [stage, view]);

  useFrame((state, delta) => {
    if (cameraRef.current) {
      state.camera.position.lerp(targetPos.current, 3 * delta);
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[8, 2, 8]} fov={45} />;
};

const BuildComponents = () => {
  const { build, rgbColor, draggingPart } = useBuilder();
  
  return (
    <group>
      <CaseModel color={build.parts[PartType.CASE]?.color} />
      
      {/* Existing Parts */}
      {(Object.values(build.parts) as (PCPart | undefined)[])
        .filter((p): p is PCPart => !!p)
        .map((part) => (
          <ComponentRenderer key={part.type} type={part.type} data={part} rgbColor={rgbColor} />
      ))}

      {/* Ghost Part (Drag Preview) */}
      {draggingPart && (
         <group>
            {/* Pulsing Drop Zone Indicator */}
            <mesh position={[0, 1.5, 0]}>
               <boxGeometry args={[2.5, 4.5, 4.5]} />
               <meshBasicMaterial color="#ff0033" wireframe transparent opacity={0.1} />
            </mesh>
            <ComponentRenderer 
               type={draggingPart.type} 
               data={draggingPart} 
               rgbColor={rgbColor} 
               isGhost={true} 
            />
         </group>
      )}
    </group>
  );
};

export const Scene = () => {
  const { stage, cameraView, rgbColor } = useBuilder();

  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}>
        <fog attach="fog" args={['#050505', 5, 20]} />
        <CameraController stage={stage} view={cameraView} />
        
        {/* Cinematic Studio Lighting - Red Theme */}
        <ambientLight intensity={0.1} color="#330000" />
        
        {/* Key Light (White/Blue Cool) */}
        <spotLight 
           position={[10, 10, 5]} 
           angle={0.3} 
           penumbra={1} 
           intensity={2} 
           castShadow 
           color="#ffffff" 
           shadow-bias={-0.0001}
        />

        {/* Rim Light (Red Hot) */}
        <pointLight position={[-5, 5, -5]} intensity={10} color="#ff0033" distance={15} />
        
        {/* Fill Light (Underglow) */}
        <pointLight position={[0, -2, 0]} intensity={3} color={rgbColor} distance={8} />

        {/* Dynamic User RGB Light */}
        <pointLight position={[2, 2, 2]} intensity={2} color={rgbColor} distance={5} decay={2} />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />

        <Float speed={stage === AppStage.LANDING ? 1.5 : 0} rotationIntensity={0.2} floatIntensity={0.2}>
           <group position={[0, -1, 0]}>
             <BuildComponents />
           </group>
        </Float>

        <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2} far={4} color="#000" />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={stage !== AppStage.SIMULATION} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 4}
          target={[0, 1.5, 0]} 
        />
      </Canvas>
    </div>
  );
};