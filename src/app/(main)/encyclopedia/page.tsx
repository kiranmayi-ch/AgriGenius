import { PageHeader } from "@/components/page-header";
import { EncyclopediaSearch } from "./encyclopedia-search";

export default function EncyclopediaPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="Pest & Disease Encyclopedia"
        description="Search for detailed information about common agricultural pests and diseases."
      />
      <div className="max-w-4xl mx-auto">
        <EncyclopediaSearch />
      </div>
    </div>
  );
}
