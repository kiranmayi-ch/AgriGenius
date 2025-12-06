import { PageHeader } from "@/components/page-header";
import { CropRecommendationForm } from "./crop-recommendation-form";

export default function CropRecommendationPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="AI Crop Recommender"
        description="Get intelligent crop suggestions based on your farm's data."
      />
      <div className="max-w-4xl mx-auto">
        <CropRecommendationForm />
      </div>
    </div>
  );
}
