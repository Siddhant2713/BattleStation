import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppStage, BuildState, PCPart, Accessory, PartType, AccessoryType } from '../types';

export type CameraView = 'ISO' | 'SIDE' | 'FRONT' | 'TOP';

interface BuilderContextType {
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  build: BuildState;
  equipPart: (part: PCPart) => void;
  equipAccessory: (acc: Accessory) => void;
  removePart: (type: PartType) => void;
  resetBuild: () => void;
  // Visuals
  rgbColor: string;
  setRgbColor: (color: string) => void;
  cameraView: CameraView;
  setCameraView: (view: CameraView) => void;
  totalWattage: number;
  // Drag & Drop State
  draggingPart: PCPart | null;
  setDraggingPart: (part: PCPart | null) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [build, setBuild] = useState<BuildState>({ parts: {}, accessories: {} });
  const [rgbColor, setRgbColor] = useState<string>('#ff0033'); // Default Neon Red
  const [cameraView, setCameraView] = useState<CameraView>('ISO');
  const [draggingPart, setDraggingPart] = useState<PCPart | null>(null);

  const equipPart = (part: PCPart) => {
    setBuild(prev => ({
      ...prev,
      parts: { ...prev.parts, [part.type]: part }
    }));
  };

  const equipAccessory = (acc: Accessory) => {
    setBuild(prev => ({
      ...prev,
      accessories: { ...prev.accessories, [acc.type]: acc }
    }));
  };

  const removePart = (type: PartType) => {
    setBuild(prev => {
      const newParts = { ...prev.parts };
      delete newParts[type];
      return { ...prev, parts: newParts };
    });
  };

  const resetBuild = () => {
    setBuild({ parts: {}, accessories: {} });
    setStage(AppStage.LANDING);
    setDraggingPart(null);
  };

  const totalWattage = (Object.values(build.parts) as (PCPart | undefined)[])
    .filter((p): p is PCPart => !!p)
    .reduce((acc, part) => acc + (part.power || (part.type === PartType.GPU ? 280 : part.type === PartType.CPU ? 150 : 25)), 0);

  return (
    <BuilderContext.Provider value={{
      stage, setStage,
      build, equipPart, equipAccessory, removePart, resetBuild,
      rgbColor, setRgbColor,
      cameraView, setCameraView,
      totalWattage,
      draggingPart, setDraggingPart
    }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) throw new Error("useBuilder must be used within a BuilderProvider");
  return context;
};