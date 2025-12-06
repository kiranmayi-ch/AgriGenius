import { PageHeader } from "@/components/page-header";
import { AgriExpertChat } from "./agri-expert-chat";
import { Stethoscope } from "lucide-react";

export default function AgriExpertPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] sm:h-screen">
       <div className="p-4 sm:p-8 border-b">
         <PageHeader
            title="Agriculture Expert"
            description="Get your queries cleared by contacting our expert."
          />
       </div>
      <AgriExpertChat />
    </div>
  );
}
