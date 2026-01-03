
"use client";

import { PageHeader } from "@/components/page-header";
import { WeatherPlanForm } from "./weather-plan-form";
import { useLanguage } from "@/context/language-context";

export default function WeatherPlanPage() {
  const { translations } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.weatherPlan.title}
        description={translations.weatherPlan.description}
      />
      <div className="max-w-4xl mx-auto">
        <WeatherPlanForm />
      </div>
    </div>
  );
}
