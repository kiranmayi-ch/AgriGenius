
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export function UserNav() {
  const { translations } = useLanguage();
  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-12 w-full justify-start gap-2 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:px-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="text-left group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">AgriGenius</p>
              <p className="text-xs text-muted-foreground">{translations.userNav.subtitle}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">AgriGenius</p>
              <p className="text-xs leading-none text-muted-foreground">
                {translations.userNav.subtitle}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{translations.userNav.settings}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{translations.userNav.logout}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
