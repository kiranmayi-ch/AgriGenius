import { AnimatedBackground } from '@/components/animated-background';
import { ClientOnly } from '@/components/client-only';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-0">
          <div className="flex items-center justify-between p-2">
            <Logo />
            <ClientOnly>
              <SidebarTrigger className="md:hidden" />
            </ClientOnly>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <ClientOnly>
            <UserNav />
          </ClientOnly>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="relative flex-1 overflow-hidden">
          <AnimatedBackground />
          <div className="relative z-10 flex flex-col h-full">
            <div className="md:hidden flex items-center p-2 border-b">
              <ClientOnly>
                <SidebarTrigger />
              </ClientOnly>
              <div className="mx-auto">
                <Logo />
              </div>
            </div>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
