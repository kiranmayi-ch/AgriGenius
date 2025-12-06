
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Bell, CloudDrizzle, BarChart, Leaf, BrainCircuit, Bug, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { YieldChart } from "./yield-chart";

const quickActions = [
  { href: "/crop-recommendation", label: "Crop Recommender", icon: BrainCircuit },
  { href: "/profit-predictor", label: "Profit Predictor", icon: BarChart },
  { href: "/disease-detection", label: "Disease Detection", icon: Bug },
  { href: "/assistant", label: "AI Assistant", icon: MessageCircle },
];

const alerts = [
  {
    title: "Price Alert: Wheat",
    description: "Market price for wheat has increased by 5%.",
    time: "5m ago",
    icon: BarChart,
  },
  {
    title: "Weather Warning",
    description: "Heavy rainfall expected in your area tomorrow.",
    time: "1h ago",
    icon: CloudDrizzle,
  },
  {
    title: "Pest Alert: Aphids",
    description: "Aphid activity reported in your region.",
    time: "3h ago",
    icon: Bug,
  },
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-12 lg:col-span-4">
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
        <Card className="col-span-12 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>
              Recent updates and warnings for your farm.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    <alert.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</p>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    