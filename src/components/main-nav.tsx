"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BrainCircuit,
  BarChart,
  Bug,
  MessageCircle,
  UserCheck,
  Users,
  BookOpen,
  CloudSun,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Dashboard" },
  {
    href: "/crop-recommendation",
    label: "Crop Recommender",
    icon: BrainCircuit,
    tooltip: "Crop Recommender"
  },
  {
    href: "/profit-predictor",
    label: "Profit Predictor",
    icon: BarChart,
    tooltip: "Profit Predictor"
  },
  {
    href: "/disease-detection",
    label: "Disease Detection",
    icon: Bug,
    tooltip: "Disease Detection"
  },
  { href: "/assistant", label: "AI Assistant", icon: MessageCircle, tooltip: "AI Assistant" },
  { href: "/agri-expert", label: "Agri Expert", icon: UserCheck, tooltip: "Agri Expert" },
  { href: "/community", label: "Community", icon: Users, tooltip: "Community" },
  { href: "/encyclopedia", label: "Encyclopedia", icon: BookOpen, tooltip: "Pest & Disease Encyclopedia" },
  { href: "/weather-plan", label: "Weather Plan", icon: CloudSun, tooltip: "Weather-Proof Farming Plan" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.tooltip}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
