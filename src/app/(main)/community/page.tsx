
"use client";

import { PageHeader } from "@/components/page-header";
import { CommunityForum } from "./community-forum";
import { useLanguage } from "@/context/language-context";

export default function CommunityPage() {
  const { translations } = useLanguage();
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.community.title}
        description={translations.community.description}
      />
      <CommunityForum />
    </div>
  );
}
