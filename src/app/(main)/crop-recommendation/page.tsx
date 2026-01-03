
"use client";

import { PageHeader } from "@/components/page-header";
import { CropRecommendationForm } from "./crop-recommendation-form";
import { useLanguage } from "@/context/language-context";

export default function CropRecommendationPage() {
  const { translations } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.cropRecommender.title}
        description={translations.cropRecommender.description}
      />
      <div className="max-w-4xl mx-auto">
        <CropRecommendationForm />
      </div>
    </div>
  );
}
