import { PageHeader } from "@/components/page-header";
import { ProfitPredictorForm } from "./profit-predictor-form";

export default function ProfitPredictorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="AI Profit Predictor"
        description="Estimate the potential profit or loss for your next harvest."
      />
      <div className="max-w-4xl mx-auto">
        <ProfitPredictorForm />
      </div>
    </div>
  );
}
