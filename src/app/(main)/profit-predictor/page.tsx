
"use client";

import { PageHeader } from "@/components/page-header";
import { ProfitPredictorForm } from "./profit-predictor-form";
import { useLanguage } from "@/context/language-context";

export default function ProfitPredictorPage() {
  const { translations } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.profitPredictor.title}
        description={translations.profitPredictor.description}
      />
      <div className="max-w-4xl mx-auto">
        <ProfitPredictorForm />
      </div>
    </div>
  );
}
