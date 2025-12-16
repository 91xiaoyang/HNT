import React from 'react';
import { TowerCanvas } from './components/TowerCanvas';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col overflow-hidden">
      <header className="p-6 text-center z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-indigo-900 tracking-tight drop-shadow-sm flex items-center justify-center gap-4">
          <span className="text-5xl">🏯</span> 汉诺塔挑战
        </h1>
        
        <div className="mt-4 bg-white/60 backdrop-blur-md px-8 py-3 rounded-full shadow-sm border border-indigo-200 hover:scale-105 transition-transform cursor-default">
          <p className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            🎯 目标：把所有的盘子从 <span className="bg-indigo-600 text-white px-3 py-0.5 rounded-lg font-black shadow-sm">A</span> 拿到 <span className="bg-indigo-600 text-white px-3 py-0.5 rounded-lg font-black shadow-sm">C</span> 柱上
          </p>
        </div>
      </header>

      <main className="flex-1 relative w-full h-full flex flex-col items-center justify-center p-4">
         <TowerCanvas />
      </main>

      <footer className="pb-8 pt-4 px-4 text-center">
        <div className="bg-white/70 backdrop-blur-md px-8 py-4 rounded-2xl inline-flex flex-col md:flex-row items-center gap-4 shadow-lg border border-indigo-100">
           <span className="font-black text-indigo-800 text-xl tracking-wider">📜 游戏规则：</span>
           <div className="flex flex-col md:flex-row gap-4 text-lg font-bold text-indigo-700">
              <span className="flex items-center gap-2">
                 <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                 一次只移一个盘子
              </span>
              <span className="hidden md:block w-px h-6 bg-indigo-300"></span>
              <span className="flex items-center gap-2">
                 <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                 大盘子不能压小盘子
              </span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
