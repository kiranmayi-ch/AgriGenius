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
import { useLanguage } from "@/context/language-context";

const menuItemsConfig = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/crop-recommendation", key: "cropRecommender", icon: BrainCircuit },
  { href: "/profit-predictor", key: "profitPredictor", icon: BarChart },
  { href: "/disease-detection", key: "diseaseDetection", icon: Bug },
  { href: "/assistant", key: "aiAssistant", icon: MessageCircle },
  { href: "/agri-expert", key: "agriExpert", icon: UserCheck },
  { href: "/community", key: "community", icon: Users },
  { href: "/encyclopedia", key: "encyclopedia", icon: BookOpen },
  { href: "/weather-plan", key: "weatherPlan", icon: CloudSun },
];

export function MainNav() {
  const pathname = usePathname();
  const { translations } = useLanguage();

  const menuItems = menuItemsConfig.map(item => ({
    ...item,
    label: translations.navigation[item.key as keyof typeof translations.navigation],
    tooltip: translations.navigation[item.key as keyof typeof translations.navigation],
  }));

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
