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
  User,
  BrainCircuit,
  BarChart,
  Bug,
  MessageCircle,
  UserCheck,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tooltip: "Dashboard" },
  { href: "/profile", label: "My Farm", icon: User, tooltip: "My Farm" },
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
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              as="a"
              isActive={pathname.startsWith(item.href)}
              tooltip={item.tooltip}
            >
                <item.icon />
                <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
