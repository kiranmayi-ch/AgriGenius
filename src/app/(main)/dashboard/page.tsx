
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Leaf, BrainCircuit, BarChart, Bug, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { YieldChart } from "./yield-chart";

const quickActions = [
  { href: "/crop-recommendation", label: "Crop Recommender", icon: BrainCircuit },
  { href: "/profit-predictor", label: "Profit Predictor", icon: BarChart },
  { href: "/disease-detection", label: "Disease Detection", icon: Bug },
  { href: "/assistant", label: "AI Assistant", icon: MessageCircle },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="Welcome Back!"
        description="Here's what's happening on your farm today."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-accent">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Yield</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 kg</div>
            <p className="text-xs text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map(action => (
               <Link href={action.href} key={action.href} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <action.icon className="w-5 h-5"/>
                  </div>
                  <span className="text-xs text-center font-medium">{action.label}</span>
               </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Yield Overview</CardTitle>
            <CardDescription>
              A summary of your crop yield over the past 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <YieldChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
