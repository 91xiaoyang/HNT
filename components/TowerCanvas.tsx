import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disk, Tower, Move } from '../types';
import { DISK_COLORS } from '../constants';
import { Button } from './Button';
import { RotateCcw, Play, CheckCircle, Timer, Trophy, Layers, ChevronUp, ChevronDown, BrainCircuit } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TowerCanvas: React.FC = () => {
  // Game Configuration
  const [diskCount, setDiskCount] = useState(3);
  
  // Game State
  const [towers, setTowers] = useState<Tower[]>([[], [], []]);
  const [selectedTowerIndex, setSelectedTowerIndex] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [message, setMessage] = useState<string>("");
  
  // Timer State
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto Solve State
  const [isSolving, setIsSolving] = useState(false);
  const solveIntervalRef = useRef<number | null>(null);

  const minMoves = Math.pow(2, diskCount) - 1;

  // Initialize Game
  const resetGame = useCallback(() => {
    // Stop any running timers/solvers
    stopTimer();
    stopSolver();

    const initialTower: Disk[] = Array.from({ length: diskCount }, (_, i) => ({
      id: i,
      size: diskCount - i, 
      color: DISK_COLORS[diskCount - 1 - i] || 'bg-gray-500'
    }));
    
    setTowers([initialTower, [], []]);
    setMoveCount(0);
    setIsWon(false);
    setMessage("准备开始！点击柱子移动盘子");
    setSelectedTowerIndex(null);
    setTimeElapsed(0);
    setIsRunning(false);
    setIsSolving(false);
  }, [diskCount]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Timer Logic
  useEffect(() => {
    if (isRunning && !isWon) {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isRunning, isWon]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopSolver = () => {
    if (solveIntervalRef.current) {
      clearInterval(solveIntervalRef.current);
      solveIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Move Logic
  const isValidMove = (fromIdx: number, toIdx: number, currentTowers: Tower[]): boolean => {
    if (fromIdx === toIdx) return false;
    const fromTower = currentTowers[fromIdx];
    const toTower = currentTowers[toIdx];
    
    if (fromTower.length === 0) return false;
    
    const diskToMove = fromTower[fromTower.length - 1];
    const topDiskAtDest = toTower.length > 0 ? toTower[toTower.length - 1] : null;

    if (topDiskAtDest && topDiskAtDest.size < diskToMove.size) {
      return false;
    }
    return true;
  };

  const executeMove = (fromIdx: number, toIdx: number) => {
    if (!isRunning && !isWon && !isSolving) setIsRunning(true);

    setTowers(prev => {
      const newTowers = prev.map(t => [...t]);
      const disk = newTowers[fromIdx].pop();
      if (disk) {
        newTowers[toIdx].push(disk);
      }
      
      // Check Win
      if (newTowers[2].length === diskCount && !isSolving) {
        setIsWon(true);
        setIsRunning(false);
        setMessage("挑战成功！太棒了！🎉");
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return newTowers;
    });
    setMoveCount(c => c + 1);
  };

  const handleTowerClick = (index: number) => {
    if (isSolving || isWon) return;

    if (selectedTowerIndex === null) {
      if (towers[index].length > 0) {
        setSelectedTowerIndex(index);
        setMessage("选择目标柱子...");
      } else {
        setMessage("这个柱子是空的！");
        setTimeout(() => setMessage(isRunning ? "继续加油！" : "点击柱子移动盘子"), 1000);
      }
    } else {
      if (isValidMove(selectedTowerIndex, index, towers)) {
        executeMove(selectedTowerIndex, index);
        setMessage("");
      } else {
        setMessage("大盘子不能放在小盘子上！🚫");
        setTimeout(() => setMessage(""), 1500);
      }
      setSelectedTowerIndex(null);
    }
  };

  // Change Difficulty
  const changeDifficulty = (delta: number) => {
    const newCount = Math.max(3, Math.min(8, diskCount + delta));
    setDiskCount(newCount);
  };

  // Auto Solver
  const getSolutionMoves = (n: number, from: number, to: number, aux: number): Move[] => {
    if (n === 0) return [];
    const moves1 = getSolutionMoves(n - 1, from, aux, to);
    const moves2 = [{ from, to }];
    const moves3 = getSolutionMoves(n - 1, aux, to, from);
    return [...moves1, ...moves2, ...moves3];
  };

  const startAutoSolve = () => {
    if (isSolving) return;
    
    // Reset to initial state for solving
    // We construct the visual state manually to ensure clean start
    const initialTower: Disk[] = Array.from({ length: diskCount }, (_, i) => ({
      id: i,
      size: diskCount - i, 
      color: DISK_COLORS[diskCount - 1 - i] || 'bg-gray-500'
    }));
    setTowers([initialTower, [], []]);
    setMoveCount(0);
    setIsWon(false);
    setIsRunning(false);
    setTimeElapsed(0);
    setSelectedTowerIndex(null);
    
    setIsSolving(true);
    setMessage("电脑正在演示解法...");

    const moves = getSolutionMoves(diskCount, 0, 2, 1);
    let step = 0;

    // Slowed down from 500ms to 1200ms
    solveIntervalRef.current = window.setInterval(() => {
      if (step >= moves.length) {
        stopSolver();
        setIsSolving(false);
        setMessage("演示结束！轮到你啦！");
        // Reset game so user can play
        setTimeout(resetGame, 2000);
        return;
      }
      const move = moves[step];
      // Directly modify state for solver to avoid win-check logic triggering confetti prematurely or timing issues
      setTowers(prev => {
        const newTowers = prev.map(t => [...t]);
        const disk = newTowers[move.from].pop();
        if (disk) newTowers[move.to].push(disk);
        return newTowers;
      });
      setMoveCount(c => c + 1);
      step++;
    }, 1200); 
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto h-full justify-center">
      
      {/* Control Panel */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-full p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-100">
        
        {/* Difficulty Selector */}
        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl">
          <div className="flex flex-col items-center mr-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">难度 (盘子数)</span>
            <span className="text-2xl font-black text-indigo-800 leading-none">{diskCount}</span>
          </div>
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => changeDifficulty(1)} 
              disabled={isSolving || isRunning || diskCount >= 8}
              className="p-1 bg-white hover:bg-indigo-100 rounded-md text-indigo-600 disabled:opacity-30 transition-colors shadow-sm"
            >
              <ChevronUp size={16} />
            </button>
            <button 
              onClick={() => changeDifficulty(-1)} 
              disabled={isSolving || isRunning || diskCount <= 3}
              className="p-1 bg-white hover:bg-indigo-100 rounded-md text-indigo-600 disabled:opacity-30 transition-colors shadow-sm"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex items-center gap-6 md:gap-12 flex-1 justify-center">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Timer size={20}/></div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase">时间</div>
                <div className="text-xl font-mono font-bold text-slate-700 w-16">{formatTime(timeElapsed)}</div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-full"><Layers size={20}/></div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase">步数 / 最少</div>
                <div className="text-xl font-mono font-bold text-slate-700">
                  {moveCount} <span className="text-slate-400 text-sm">/ {minMoves}</span>
                </div>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetGame} icon={<RotateCcw size={18} />} disabled={isSolving}>
            重置
          </Button>
          <Button variant="outline" onClick={startAutoSolve} disabled={isSolving || isRunning} icon={<BrainCircuit size={18} />}>
            程序计算
          </Button>
        </div>
      </div>

      {/* Game Message */}
      <div className="h-8 mb-2">
        <AnimatePresence mode='wait'>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-lg font-bold ${isWon ? 'text-green-600' : 'text-indigo-600'}`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game Board */}
      <div className="relative flex items-end justify-center gap-4 md:gap-16 h-[400px] w-full bg-white/60 rounded-3xl border-4 border-indigo-100 p-8 shadow-inner overflow-hidden">
        {[0, 1, 2].map((towerIndex) => (
          <div 
            key={towerIndex}
            className={`
              relative flex flex-col-reverse items-center justify-start w-1/3 h-full rounded-2xl transition-all duration-200
              ${selectedTowerIndex === towerIndex ? 'bg-indigo-100/50 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]' : 'hover:bg-white/40'}
              ${(isSolving || isWon) ? 'cursor-default' : 'cursor-pointer'}
            `}
            onClick={() => handleTowerClick(towerIndex)}
          >
            {/* The Pole */}
            <div className="absolute bottom-0 w-4 md:w-6 h-[80%] bg-slate-300 rounded-t-xl z-0 shadow-inner" />
            
            {/* The Base Label */}
            <div className="absolute -bottom-10 md:-bottom-12 w-12 h-12 flex items-center justify-center bg-slate-200 rounded-full text-xl font-black text-slate-500 shadow-sm border-2 border-white">
               {String.fromCharCode(65 + towerIndex)}
            </div>

            {/* Click Hit Area (Invisible but helps with clicking) */}
            <div className="absolute inset-0 z-0" />

            {/* The Disks */}
            <div className="z-10 w-full flex flex-col-reverse items-center mb-0 pb-2">
               <AnimatePresence>
                {towers[towerIndex].map((disk, index) => (
                  <motion.div
                    key={disk.id}
                    layoutId={`disk-${disk.id}`}
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className={`
                      h-6 md:h-8 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] border border-white/30 backdrop-brightness-110
                      ${disk.color} flex items-center justify-center mb-0.5 md:mb-1 relative
                    `}
                    style={{ 
                      width: `${(disk.size / diskCount) * 80 + 20}%`, // Responsive width logic
                      maxWidth: '100%'
                    }}
                  >
                     {/* Shine effect */}
                    <div className="absolute top-1 left-2 right-2 h-[2px] bg-white/30 rounded-full" />
                    
                    {/* Number label (only if few disks or large enough) */}
                    <span className="text-[10px] md:text-xs font-bold text-black/40 select-none">
                       {disk.size}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
             {/* Hover Indicator (only when active) */}
             {!isSolving && !isWon && selectedTowerIndex === null && (
               <div className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none flex items-start justify-center pt-4 transition-opacity">
                  <ChevronDown className="text-indigo-400 animate-bounce" />
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};
