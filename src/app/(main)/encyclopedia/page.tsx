
"use client";

import { PageHeader } from "@/components/page-header";
import { EncyclopediaSearch } from "./encyclopedia-search";
import { useLanguage } from "@/context/language-context";

export default function EncyclopediaPage() {
  const { translations } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.encyclopedia.title}
        description={translations.encyclopedia.description}
      />
      <div className="max-w-4xl mx-auto">
        <EncyclopediaSearch />
      </div>
    </div>
  );
}
