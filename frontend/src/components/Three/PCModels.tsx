import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, Group } from 'three';
import { PartType } from '../../types';

// --- PBR MATERIALS & HELPERS ---

// High-end glowing material
const NeonMaterial = ({ color, intensity = 2, pulse = false }: { color: string, intensity?: number, pulse?: boolean }) => {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (pulse && ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.emissiveIntensity = intensity + Math.sin(t * 4) * 0.5;
    }
  });
  return (
    <meshStandardMaterial 
      ref={ref}
      color={color} 
      emissive={color} 
      emissiveIntensity={intensity} 
      toneMapped={false}
    />
  );
};

// Realistic Glass
const GlassMaterial = ({ color = '#000000', opacity = 0.2 }: { color?: string, opacity?: number }) => (
  <meshPhysicalMaterial 
    color={color}
    metalness={0.9}
    roughness={0.05}
    transmission={0.6} // Add glass-like refraction
    thickness={1.5}
    clearcoat={1}
    clearcoatRoughness={0.1}
    opacity={opacity}
    transparent
  />
);

// Brushed Metal
const MetalMaterial = ({ color = '#1a1a1a', roughness = 0.4 }: { color?: string, roughness?: number }) => (
  <meshStandardMaterial 
    color={color}
    metalness={0.9}
    roughness={roughness}
  />
);

// Matte Plastic
const PlasticMaterial = ({ color = '#111' }: { color?: string }) => (
  <meshStandardMaterial 
    color={color}
    metalness={0.2}
    roughness={0.8}
  />
);

// Ghost Effect for Drag & Drop Preview
const GhostWrapper = ({ children, isGhost }: { children: React.ReactNode, isGhost: boolean }) => {
  if (!isGhost) return <>{children}</>;
  return (
    <group>
      <mesh>
         {/* This mesh captures the shape for the ghost effect override if we were using custom shaders, 
             but for simplicity in React Three Fiber without shaders, we'll just adjust opacity in children via props 
             or wrap in a group that pulses.
         */}
      </mesh>
      <group>
        {React.Children.map(children, (child: any) => {
          // Simple prop injection to force wireframe/transparent look on standard meshes would happen here
          // For now, we rely on the parent opacity group
          return React.cloneElement(child, { 
             // Logic to override materials would be complex here, so we use a visual wrapper in the Renderer instead
          });
        })}
      </group>
    </group>
  );
};

// --- COMPONENT MODELS ---

export const CaseModel = ({ color = '#050505' }: { color?: string }) => {
  return (
    <group>
      {/* Chassis Frame */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.2, 4.2, 4.2]} />
        <meshPhysicalMaterial 
          color="#111" 
          metalness={0.8} 
          roughness={0.2} 
          clearcoat={0.5} 
          wireframe={false}
        />
      </mesh>
      
      {/* Tempered Glass Side Panel */}
      <mesh position={[1.11, 1.5, 0]}>
        <boxGeometry args={[0.02, 4.0, 4.0]} />
        <GlassMaterial color="#111" opacity={0.3} />
      </mesh>

      {/* Internal Motherboard Tray */}
      <mesh position={[-0.9, 1.5, 0]}>
        <boxGeometry args={[0.1, 3.8, 3.8]} />
        <MetalMaterial color="#222" roughness={0.7} />
      </mesh>
      
      {/* Power Button Glow */}
      <mesh position={[0.5, 3.61, 2.0]}>
         <cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
         <NeonMaterial color="#ff0033" intensity={2} pulse />
      </mesh>
    </group>
  );
};

export const GPUModel = ({ color = '#222', rgbColor, isGhost = false }: { color?: string, rgbColor?: string, isGhost?: boolean }) => {
  const fanRef1 = useRef<Mesh>(null);
  const fanRef2 = useRef<Mesh>(null);
  const fanRef3 = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!isGhost) {
        if (fanRef1.current) fanRef1.current.rotation.z -= delta * 15;
        if (fanRef2.current) fanRef2.current.rotation.z -= delta * 15;
        if (fanRef3.current) fanRef3.current.rotation.z -= delta * 15;
    }
  });

  const bodyColor = isGhost ? '#ff0033' : '#1a1a1a';
  const opacity = isGhost ? 0.3 : 1;

  return (
    <group position={[-0.5, 0.5, 0]}>
      {/* Main Body */}
      <mesh>
        <boxGeometry args={[3, 0.5, 1.3]} />
        {isGhost ? (
            <meshBasicMaterial color="#ff0033" wireframe opacity={0.3} transparent />
        ) : (
            <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.3} />
        )}
      </mesh>
      
      {!isGhost && (
          <>
            {/* RGB Strip */}
            <mesh position={[0, 0.26, 0.64]}>
                <boxGeometry args={[2.8, 0.04, 0.04]} />
                <NeonMaterial color={rgbColor || color} intensity={3} />
            </mesh>

            {/* Fans */}
            <mesh ref={fanRef1} position={[-0.9, -0.26, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.05, 8]} />
                <PlasticMaterial color="#050505" />
            </mesh>
            <mesh ref={fanRef2} position={[0, -0.26, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.05, 8]} />
                <PlasticMaterial color="#050505" />
            </mesh>
             <mesh ref={fanRef3} position={[0.9, -0.26, 0]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.05, 8]} />
                <PlasticMaterial color="#050505" />
            </mesh>
          </>
      )}
    </group>
  );
};

export const CPUModel = ({ color = '#0070c0', isGhost }: { color?: string, isGhost?: boolean }) => (
  <group position={[-0.8, 2.2, 0.5]} rotation={[0, 0, Math.PI / 2]}>
    <mesh>
      <boxGeometry args={[0.5, 0.1, 0.5]} />
      {isGhost ? <meshBasicMaterial color="#ff0033" wireframe /> : <MetalMaterial color="#silver" />}
    </mesh>
    {!isGhost && (
        <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.3, 0.02, 0.3]} />
            <NeonMaterial color={color} intensity={2} pulse />
        </mesh>
    )}
  </group>
);

export const RAMModel = ({ position, color = '#ff0055', rgbColor, isGhost }: { position: [number, number, number], color?: string, rgbColor?: string, isGhost?: boolean }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={[0.05, 1.2, 0.3]} />
      {isGhost ? <meshBasicMaterial color="#ff0033" wireframe /> : <MetalMaterial color="#111" />}
    </mesh>
    {!isGhost && (
        <mesh position={[0.03, 0, 0]}>
            <boxGeometry args={[0.01, 1.1, 0.28]} />
            <NeonMaterial color={rgbColor || color} intensity={3} />
        </mesh>
    )}
  </group>
);

export const FanModel = ({ position, rotation, color = '#fff', rpm = 1200, rgb = true, rgbColor, isGhost }: { position: [number, number, number], rotation?: [number, number, number], color?: string, rpm?: number, rgb?: boolean, rgbColor?: string, isGhost?: boolean }) => {
  const bladesRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (bladesRef.current && !isGhost) {
      bladesRef.current.rotation.z -= delta * (rpm / 60);
    }
  });

  if (isGhost) {
      return (
          <group position={position} rotation={rotation}>
              <mesh>
                  <cylinderGeometry args={[0.45, 0.45, 0.1, 16]} />
                  <meshBasicMaterial color="#ff0033" wireframe transparent opacity={0.3} />
              </mesh>
          </group>
      )
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1, 1, 0.1]} />
        <PlasticMaterial color="#111" />
      </mesh>
      {/* Blades */}
      <group ref={bladesRef}>
        <mesh rotation={[Math.PI/2, 0, 0]}>
           <cylinderGeometry args={[0.45, 0.45, 0.05, 7]} />
           <meshPhysicalMaterial color="#333" transmission={0.5} opacity={0.8} transparent />
        </mesh>
      </group>
      {/* Halo Ring */}
      {rgb && (
        <mesh position={[0, 0, 0.06]}>
           <ringGeometry args={[0.45, 0.48, 32]} />
           <NeonMaterial color={rgbColor || color} intensity={2} />
        </mesh>
      )}
    </group>
  );
};

// Main Renderer Switch
export const ComponentRenderer = ({ type, data, rgbColor, isGhost = false }: { type: PartType, data: any, rgbColor: string, isGhost?: boolean }) => {
  switch (type) {
    case PartType.GPU:
      return <GPUModel color={data.color} rgbColor={rgbColor} isGhost={isGhost} />;
    case PartType.CPU:
      return <CPUModel color={data.color} isGhost={isGhost} />;
    case PartType.RAM:
      return (
        <group>
          <RAMModel position={[-0.7, 2.2, 1.0]} color={data.color} rgbColor={data.rgb ? rgbColor : undefined} isGhost={isGhost} />
          <RAMModel position={[-0.7, 2.2, 1.2]} color={data.color} rgbColor={data.rgb ? rgbColor : undefined} isGhost={isGhost} />
        </group>
      );
    case PartType.FAN:
      return (
        <group>
          <FanModel position={[0, 0.5, 1.9]} color={data.color} rpm={data.rpm} rgb={data.rgb} rgbColor={rgbColor} isGhost={isGhost} />
          <FanModel position={[0, 1.5, 1.9]} color={data.color} rpm={data.rpm} rgb={data.rgb} rgbColor={rgbColor} isGhost={isGhost} />
          <FanModel position={[0, 2.5, 1.9]} color={data.color} rpm={data.rpm} rgb={data.rgb} rgbColor={rgbColor} isGhost={isGhost} />
          <FanModel position={[0, 2.5, -1.9]} rotation={[0, Math.PI, 0]} color={data.color} rpm={data.rpm} rgb={data.rgb} rgbColor={rgbColor} isGhost={isGhost} />
        </group>
      );
    default:
      return null;
  }
};