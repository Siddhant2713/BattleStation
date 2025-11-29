export enum PartType {
  CASE = 'Case',
  CPU = 'CPU',
  GPU = 'GPU',
  RAM = 'RAM',
  STORAGE = 'Storage',
  COOLER = 'Cooling',
  PSU = 'PSU',
  FAN = 'Fan'
}

export enum AccessoryType {
  KEYBOARD = 'Keyboard',
  MOUSE = 'Mouse',
  MONITOR = 'Monitor',
  DESK = 'Desk'
}

export interface PCPart {
  id: string;
  name: string;
  type: PartType;
  price: number;
  specs: string;
  modelType: 'box' | 'cylinder' | 'flat'; // Simplified for procedural 3D
  color: string;
  power?: number; // Watts
  performanceScore: number; // Arbitrary score for simulation logic
  rpm?: number; // Fan speed
  rgb?: boolean; // RGB capability
}

export interface Accessory {
  id: string;
  name: string;
  type: AccessoryType;
  color: string;
}

export interface BuildState {
  parts: Partial<Record<PartType, PCPart>>;
  accessories: Partial<Record<AccessoryType, Accessory>>;
}

export enum AppStage {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  BUILDING = 'BUILDING',
  ROOM_SETUP = 'ROOM_SETUP',
  SIMULATION = 'SIMULATION'
}

export interface GameData {
  id: string;
  title: string;
  image: string;
  minSpecs: {
    gpuScore: number;
    cpuScore: number;
  };
}

export interface SimulationResult {
  fps: number;
  verdict: string;
  bottleneck: string | null;
  recommendation: string;
}

// Global declaration for React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      boxGeometry: any;
      cylinderGeometry: any;
      ringGeometry: any;
      planeGeometry: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      primitive: any;
      directionalLight: any;
    }
  }
}
