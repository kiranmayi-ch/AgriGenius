"use client";

import { PageHeader } from "@/components/page-header";
import { AgriExpertChat } from "./agri-expert-chat";
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Wheat, Carrot, Apple } from "lucide-react";
import { useLanguage } from "@/context/language-context";


const expertCategories = [
  { name: "Grains", icon: Wheat, description: "Wheat, Rice, Maize, etc." },
  { name: "Vegetables", icon: Carrot, description: "Tomato, Potato, Onion, etc." },
  { name: "Fruits", icon: Apple, description: "Mango, Banana, Grapes, etc." },
  { name: "Pulses", icon: Sprout, description: "Lentils, Chickpeas, Beans, etc." },
];

export default function AgriExpertPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { translations } = useLanguage();

  if (selectedCategory) {
    return (
      <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] sm:h-screen">
        <div className="p-4 sm:p-8 border-b">
          <PageHeader
            title={translations.agriExpert.title}
            description={`Chat with an AI expert specializing in ${selectedCategory}.`}
          />
        </div>
        <AgriExpertChat category={selectedCategory} />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.agriExpert.title}
        description={translations.agriExpert.description}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {expertCategories.map((category) => (
          <Card
            key={category.name}
            className="cursor-pointer hover:border-primary hover:shadow-lg transition-all"
            onClick={() => setSelectedCategory(category.name)}
          >
            <CardHeader className="flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-2">
                <category.icon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
