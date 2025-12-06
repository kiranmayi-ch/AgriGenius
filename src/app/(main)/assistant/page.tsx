import { PageHeader } from "@/components/page-header";
import { AssistantChat } from "./assistant-chat";

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] sm:h-screen">
       <div className="p-4 sm:p-8 border-b">
         <PageHeader
            title="AI Assistant"
            description="Ask me anything about farming. I can help in English, Telugu, and Hindi."
          />
       </div>
      <AssistantChat />
    </div>
  );
}
