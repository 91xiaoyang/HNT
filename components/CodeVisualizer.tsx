import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CODE_SNIPPET } from '../constants';
import { Button } from './Button';
import { Play, SkipForward, RotateCcw } from 'lucide-react';
import { CodeStep } from '../types';

export const CodeVisualizer: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Simplified trace for Hanoi(2, A, B, C)
  // Logic: hanoi(n, from, aux, to)
  const steps: CodeStep[] = [
    { line: 0, stackDepth: 0, description: "开始: hanoi(2, A, B, C)", args: {n: 2, from: 'A', aux: 'B', to: 'C'} },
    { line: 1, stackDepth: 0, description: "n 不为 0，继续执行", args: {n: 2, from: 'A', aux: 'B', to: 'C'} },
    { line: 3, stackDepth: 0, description: "递归调用: 先把上面 1 个盘子移开", args: {n: 2, from: 'A', aux: 'B', to: 'C'} },
    
    { line: 0, stackDepth: 1, description: "开始: hanoi(1, A, C, B)", args: {n: 1, from: 'A', aux: 'C', to: 'B'} },
    { line: 1, stackDepth: 1, description: "n 不为 0，继续", args: {n: 1, from: 'A', aux: 'C', to: 'B'} },
    { line: 3, stackDepth: 1, description: "递归调用: hanoi(0...)", args: {n: 1, from: 'A', aux: 'C', to: 'B'} },
    
    // Base case n=0 omitted for brevity in visual logic mostly, but let's show one return
    { line: 1, stackDepth: 2, description: "n 等于 0，直接返回", args: {n: 0, from: 'A', aux: 'B', to: 'C'} },
    
    { line: 5, stackDepth: 1, description: "输出: 将盘子 1 从 A 移到 B", args: {n: 1, from: 'A', aux: 'C', to: 'B'} },
    { line: 7, stackDepth: 1, description: "递归调用: hanoi(0...)", args: {n: 1, from: 'A', aux: 'C', to: 'B'} },
    
    { line: 5, stackDepth: 0, description: "输出: 将盘子 2 从 A 移到 C", args: {n: 2, from: 'A', aux: 'B', to: 'C'} },
    
    { line: 7, stackDepth: 0, description: "递归调用: 把 B 上的盘子移到 C", args: {n: 2, from: 'A', aux: 'B', to: 'C'} },
    { line: 0, stackDepth: 1, description: "开始: hanoi(1, B, A, C)", args: {n: 1, from: 'B', aux: 'A', to: 'C'} },
    { line: 5, stackDepth: 1, description: "输出: 将盘子 1 从 B 移到 C", args: {n: 1, from: 'B', aux: 'A', to: 'C'} },
    { line: 8, stackDepth: 0, description: "全部完成！", args: {n: 2, from: 'A', aux: 'B', to: 'C'} }
  ];

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    let timer: any;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 2000); // Slower for kids to read
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full p-2">
      {/* Code Side */}
      <div className="bg-slate-900 rounded-xl p-6 text-sm font-mono shadow-2xl overflow-hidden relative border border-slate-700">
        <div className="absolute top-0 left-0 right-0 bg-slate-800 p-2 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="mt-6 space-y-1">
          {CODE_SNIPPET.split('\n').map((line, idx) => (
            <div 
              key={idx} 
              className={`px-2 py-1 transition-colors duration-300 ${currentStep.line === idx ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
            >
              <span className="inline-block w-6 opacity-50 select-none text-xs">{idx + 1}</span>
              {line}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex gap-4">
           <Button variant="success" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? "暂停" : <><Play className="w-4 h-4 mr-1"/> 自动运行</>}
           </Button>
           <Button variant="secondary" size="sm" onClick={handleNext} disabled={isPlaying}>
              <SkipForward className="w-4 h-4 mr-1" /> 下一步
           </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
           </Button>
        </div>
      </div>

      {/* Visual Side */}
      <div className="bg-indigo-50 rounded-xl p-6 relative border-2 border-indigo-100 flex flex-col">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">计算机的“大脑”（调用栈）</h3>
        
        <div className="flex-1 flex flex-col-reverse justify-start gap-2 overflow-hidden pb-4">
            <AnimatePresence>
                {/* Render stack frames based on current depth and history */}
                {Array.from({length: currentStep.stackDepth + 1}).map((_, i) => {
                    // Find the most recent step that was at this depth
                    const frameStep = steps.slice(0, currentStepIndex + 1).reverse().find(s => s.stackDepth === i);
                    if (!frameStep || !frameStep.args) return null;

                    return (
                        <motion.div
                            key={i}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            className={`p-4 rounded-lg shadow-lg border-l-8 flex flex-col ${i === currentStep.stackDepth ? 'bg-white border-indigo-500 ring-2 ring-indigo-200' : 'bg-slate-100 border-slate-300 opacity-60'}`}
                        >
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                任务层级 Level {i}
                            </div>
                            <div className="font-mono text-lg text-slate-800 font-bold">
                                hanoi(n={frameStep.args.n}, {frameStep.args.from}, {frameStep.args.aux}, {frameStep.args.to})
                            </div>
                            {i === currentStep.stackDepth && (
                                <div className="mt-2 text-indigo-600 font-semibold bg-indigo-50 p-2 rounded">
                                    → {currentStep.description}
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
