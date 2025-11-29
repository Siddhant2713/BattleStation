import { PartType, PCPart, GameData, AccessoryType, Accessory } from './types';

export const PART_CATALOG: PCPart[] = [
  // Cases
  { id: 'c1', name: 'NZXT H5 Flow', type: PartType.CASE, price: 95, specs: 'Mid Tower', modelType: 'box', color: '#1a1a1a', performanceScore: 0 },
  { id: 'c2', name: 'Hyte Y60', type: PartType.CASE, price: 199, specs: 'Panoramic Glass', modelType: 'box', color: '#ffffff', performanceScore: 0 },
  
  // CPUs
  { id: 'cpu1', name: 'Intel Core i5-13600K', type: PartType.CPU, price: 300, specs: '14 Cores', modelType: 'flat', color: '#0070c0', performanceScore: 85 },
  { id: 'cpu2', name: 'AMD Ryzen 7 7800X3D', type: PartType.CPU, price: 450, specs: '8 Cores, 3D V-Cache', modelType: 'flat', color: '#ed1c24', performanceScore: 95 },
  { id: 'cpu3', name: 'Intel Core i9-14900K', type: PartType.CPU, price: 600, specs: '24 Cores', modelType: 'flat', color: '#0070c0', performanceScore: 98 },

  // GPUs
  { id: 'gpu1', name: 'NVIDIA RTX 4060', type: PartType.GPU, price: 300, specs: '8GB GDDR6', modelType: 'box', color: '#76b900', performanceScore: 60 },
  { id: 'gpu2', name: 'NVIDIA RTX 4070 Ti', type: PartType.GPU, price: 800, specs: '12GB GDDR6X', modelType: 'box', color: '#76b900', performanceScore: 85 },
  { id: 'gpu3', name: 'NVIDIA RTX 4090', type: PartType.GPU, price: 1600, specs: '24GB GDDR6X', modelType: 'box', color: '#000000', performanceScore: 100 },

  // RAM
  { id: 'ram1', name: 'Corsair Vengeance 16GB', type: PartType.RAM, price: 60, specs: 'DDR5 5200MHz', modelType: 'flat', color: '#222', performanceScore: 70 },
  { id: 'ram2', name: 'G.Skill Trident Z5 32GB', type: PartType.RAM, price: 120, specs: 'DDR5 6400MHz RGB', modelType: 'flat', color: '#888', performanceScore: 90 },

  // Storage
  { id: 'ssd1', name: 'Samsung 980 Pro 1TB', type: PartType.STORAGE, price: 80, specs: 'NVMe Gen4', modelType: 'flat', color: '#111', performanceScore: 80 },

  // Fans
  { id: 'fan1', name: 'Corsair iCUE AR120', type: PartType.FAN, price: 30, specs: '120mm RGB 1800RPM', modelType: 'cylinder', color: '#00ffff', performanceScore: 10, rpm: 1800, rgb: true },
  { id: 'fan2', name: 'Lian Li Uni Fan SL', type: PartType.FAN, price: 90, specs: '3-Pack 120mm 1900RPM', modelType: 'cylinder', color: '#ff0055', performanceScore: 15, rpm: 1900, rgb: true },
  { id: 'fan3', name: 'Be Quiet! Silent Wings', type: PartType.FAN, price: 25, specs: '140mm 1600RPM', modelType: 'cylinder', color: '#333333', performanceScore: 10, rpm: 1600, rgb: false },
];

export const ACCESSORY_CATALOG: Accessory[] = [
  { id: 'mon1', name: 'Alienware 34" OLED', type: AccessoryType.MONITOR, color: '#000' },
  { id: 'kb1', name: 'Razer BlackWidow', type: AccessoryType.KEYBOARD, color: '#111' },
  { id: 'ms1', name: 'Logitech G Pro X', type: AccessoryType.MOUSE, color: '#111' },
];

export const GAMES: GameData[] = [
  { id: 'val', title: 'Valorant', image: 'https://picsum.photos/seed/val/400/225', minSpecs: { gpuScore: 40, cpuScore: 50 } },
  { id: 'cp2077', title: 'Cyberpunk 2077', image: 'https://picsum.photos/seed/cp/400/225', minSpecs: { gpuScore: 80, cpuScore: 80 } },
  { id: 'cod', title: 'Call of Duty: MW3', image: 'https://picsum.photos/seed/cod/400/225', minSpecs: { gpuScore: 70, cpuScore: 70 } },
];