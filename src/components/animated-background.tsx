"use client";

import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

const DoodleSun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary/40"
  >
    <circle cx="12" cy="12" r="4" fill="hsl(var(--primary) / 0.1)" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const DoodleCloud = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("text-primary/30", className)}
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="hsl(var(--primary) / 0.05)" />
  </svg>
);


export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Doodles */}
      <div className="absolute top-[10%] left-[5%] animate-float-slow opacity-50">
        <DoodleSun />
      </div>
      <div className="absolute top-[20%] left-[25%] animate-float-slow-delay opacity-60">
        <DoodleCloud />
      </div>
      <div className="absolute top-[15%] right-[10%] animate-float-slower opacity-50">
        <DoodleCloud className="w-20 h-20" />
      </div>
       <div className="absolute bottom-[25%] left-[15%] animate-float-slow opacity-40">
        <Leaf className="w-6 h-6 text-primary/40 rotate-[-30deg]"/>
      </div>
       <div className="absolute bottom-[30%] right-[20%] animate-float-slower opacity-50">
        <Leaf className="w-8 h-8 text-primary/40 rotate-[20deg]"/>
      </div>


      {/* Bottom Plants */}
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
