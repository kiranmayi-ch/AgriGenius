import { PageHeader } from "@/components/page-header";
import { CommunityInsightsForm } from "./community-insights-form";

export default function CommunityPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="Community Knowledge Hub"
        description="Anonymously learn from nearby farmers about crops, diseases, and market trends."
      />
      <div className="max-w-4xl mx-auto">
        <CommunityInsightsForm />
      </div>
    </div>
  );
}
