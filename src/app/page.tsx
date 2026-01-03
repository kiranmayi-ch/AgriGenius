"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function RootPage() {
  const router = useRouter();

  return (
    <div className="relative flex-1 h-screen">
       <Image
        src="https://images.unsplash.com/photo-1498408040764-ab6eb772a145?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background of a wheat field at sunset"
        fill
        className="object-cover"
        priority
        data-ai-hint="wheat field"
      />
      <div className="absolute inset-0 bg-background/20" />
      <div className="relative z-10 flex flex-col h-full items-center justify-center text-center p-4">
        <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-2xl">
          <Logo />
          <p className="text-xl italic text-foreground/80 mt-4 mb-8">
            "The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings."
          </p>
          <Button size="lg" onClick={() => router.push('/dashboard')}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
