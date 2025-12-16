import React from 'react';
import { motion } from 'framer-motion';

export const RecursionTree: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
      <h3 className="text-2xl font-bold text-slate-700 mb-8">分而治之 (Divide & Conquer)</h3>
      
      <div className="relative">
        {/* Level 0: Main Problem */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center z-10 relative"
        >
            <div className="bg-indigo-600 text-white px-8 py-4 rounded-xl shadow-xl font-bold text-xl border-4 border-indigo-300">
                移动 3 个盘子
            </div>
        </motion.div>

        {/* Connectors */}
        <svg className="absolute top-14 left-0 w-full h-24 -z-10 overflow-visible">
             <motion.path 
                d="M150,0 C150,50 50,50 50,100" 
                fill="none" stroke="#cbd5e1" strokeWidth="4" 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }}
             />
              <motion.path 
                d="M150,0 C150,50 250,50 250,100" 
                fill="none" stroke="#cbd5e1" strokeWidth="4" 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }}
             />
              <motion.path 
                d="M150,0 L150,100" 
                fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="5,5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 1 }}
             />
        </svg>

        {/* Level 1: Sub Problems */}
        <div className="flex gap-16 mt-20">
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col items-center"
            >
                <div className="bg-orange-400 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm">
                    移动 2 个 (小)
                </div>
                <div className="text-slate-400 text-xs mt-1">给大盘子让路</div>
            </motion.div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex flex-col items-center"
            >
                <div className="bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg font-bold text-md border-2 border-dashed border-white">
                    移动最大的盘子
                </div>
                <div className="text-slate-400 text-xs mt-1">关键的一步！</div>
            </motion.div>

             <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 }}
                className="flex flex-col items-center"
            >
                <div className="bg-orange-400 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm">
                    移动 2 个 (小)
                </div>
                <div className="text-slate-400 text-xs mt-1">盖到大盘子上</div>
            </motion.div>
        </div>

        <motion.div 
            className="mt-12 bg-white/50 backdrop-blur p-6 rounded-2xl border border-slate-200 text-center max-w-md mx-auto shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
        >
            <p className="text-lg text-slate-600">
                要把 <span className="font-bold text-indigo-600">N</span> 个盘子移动到目标：
                <br/>
                1. 先把 <span className="font-bold text-orange-500">N-1</span> 个小的移开。
                <br/>
                2. 把剩下的 <span className="font-bold text-slate-800">大家伙</span> 移过去。
                <br/>
                3. 再把 <span className="font-bold text-orange-500">N-1</span> 个小的移回来。
            </p>
        </motion.div>
      </div>
    </div>
  );
};
