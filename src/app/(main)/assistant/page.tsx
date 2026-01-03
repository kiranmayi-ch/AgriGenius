
"use client";

import { PageHeader } from "@/components/page-header";
import { AssistantChat } from "./assistant-chat";
import { useLanguage } from "@/context/language-context";

export default function AssistantPage() {
  const { translations } = useLanguage();
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] sm:h-screen">
       <div className="p-4 sm:p-8 border-b">
         <PageHeader
            title={translations.aiAssistant.title}
            description={translations.aiAssistant.description}
          />
       </div>
      <AssistantChat />
    </div>
  );
}
