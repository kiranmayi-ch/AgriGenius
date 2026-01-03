"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useRouter } from "next/navigation";
import { ArrowRight, Languages } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Language } from "@/context/language-context";

export default function RootPage() {
  const router = useRouter();
  const { language, setLanguage, translations } = useLanguage();

  const handleGetStarted = () => {
    router.push('/dashboard');
  }

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
        <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-2xl w-full">
          <Logo />
          <p className="text-xl italic text-foreground/80 mt-4 mb-8">
            {translations.landing.quote}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="w-full sm:w-auto">
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <Languages className="mr-2 h-5 w-5"/>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="ml">മലയാളം</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="or">ଓଡ଼ିଆ</SelectItem>
                  <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                  <SelectItem value="gu">ગુજરાતી</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="lg" onClick={handleGetStarted}>
              {translations.landing.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
