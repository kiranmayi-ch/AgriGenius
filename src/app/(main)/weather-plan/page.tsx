import { PageHeader } from "@/components/page-header";
import { WeatherPlanForm } from "./weather-plan-form";

export default function WeatherPlanPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="AI Weather-Proof Farming Plan"
        description="Get a weather-resilient farming schedule for your crop."
      />
      <div className="max-w-4xl mx-auto">
        <WeatherPlanForm />
      </div>
    </div>
  );
}
