import { PageHeader } from "@/components/page-header";
import { DiseaseDetectionForm } from "./disease-detection-form";

export default function DiseaseDetectionPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="AI Disease Detection"
        description="Upload a photo of a crop to detect diseases or nutrient deficiencies."
      />
       <div className="max-w-4xl mx-auto">
        <DiseaseDetectionForm />
       </div>
    </div>
  );
}
