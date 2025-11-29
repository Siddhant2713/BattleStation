import React, { useEffect, useState } from 'react';

export const SimulationPanel = () => {
  const [fps, setFps] = useState(60);
  const [gpuUsage, setGpuUsage] = useState(50);
  const [cpuUsage, setCpuUsage] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(prev => Math.min(144, Math.max(30, prev + (Math.random() - 0.5) * 10)));
      setGpuUsage(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
      setCpuUsage(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80 bg-black/80 backdrop-blur-md border-l border-white/10 p-6 h-full flex flex-col gap-6">
      <h2 className="text-xl font-bold brand-font text-neon-red">PERFORMANCE</h2>

      {/* FPS Meter */}
      <div className="bg-white/5 p-4 border border-white/10">
        <div className="text-xs font-mono text-gray-400">FPS</div>
        <div className="text-4xl font-bold brand-font text-white">{Math.round(fps)}</div>
        <div className="h-2 bg-gray-800 mt-2 rounded-full overflow-hidden">
          <div className="h-full bg-neon-red transition-all duration-300" style={{ width: `${(fps / 144) * 100}%` }} />
        </div>
      </div>

      {/* GPU Usage */}
      <div className="bg-white/5 p-4 border border-white/10">
        <div className="text-xs font-mono text-gray-400">GPU USAGE</div>
        <div className="text-2xl font-bold brand-font text-white">{Math.round(gpuUsage)}%</div>
        <div className="h-2 bg-gray-800 mt-2 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${gpuUsage}%` }} />
        </div>
      </div>

      {/* CPU Usage */}
      <div className="bg-white/5 p-4 border border-white/10">
        <div className="text-xs font-mono text-gray-400">CPU USAGE</div>
        <div className="text-2xl font-bold brand-font text-white">{Math.round(cpuUsage)}%</div>
        <div className="h-2 bg-gray-800 mt-2 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${cpuUsage}%` }} />
        </div>
      </div>
    </div>
  );
};