
"use client";

import { cn } from "@/lib/utils";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute bottom-0 left-0 right-0 h-48">
        <div className={cn("plant-container")} style={{ left: '10%', bottom: '-10px', '--duration': '12s' }}>
          <div className={cn("plant")}></div>
        </div>
        <div className={cn("plant-container")} style={{ left: '30%', bottom: '-5px', '--duration': '10s', transform: 'scale(0.8)' }}>
          <div className={cn("plant")}></div>
        </div>
        <div className={cn("plant-container")} style={{ left: '50%', bottom: '-15px', '--duration': '14s', transform: 'scale(1.1)' }}>
          <div className={cn("plant")}></div>
        </div>
        <div className={cn("plant-container")} style={{ left: '70%', bottom: '0px', '--duration': '9s', transform: 'scale(0.9)' }}>
          <div className={cn("plant")}></div>
        </div>
        <div className={cn("plant-container")} style={{ left: '90%', bottom: '-8px', '--duration': '11s', transform: 'scale(0.7)' }}>
          <div className={cn("plant")}></div>
        </div>
      </div>
    </div>
  );
}
