
"use client";

import { PageHeader } from "@/components/page-header";
import { DiseaseDetectionForm } from "./disease-detection-form";
import { useLanguage } from "@/context/language-context";

export default function DiseaseDetectionPage() {
  const { translations } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.diseaseDetection.title}
        description={translations.diseaseDetection.description}
      />
       <div className="max-w-4xl mx-auto">
        <DiseaseDetectionForm />
       </div>
    </div>
  );
}
