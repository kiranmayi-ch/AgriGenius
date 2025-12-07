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
import Image from 'next/image';

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
          <Image
            src="https://images.unsplash.com/photo-1498408040764-ab6eb772a145?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="background of a wheat field at sunset"
            fill
            className="object-cover"
            priority
            data-ai-hint="wheat field"
          />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="md:hidden flex items-center p-2 border-b bg-background/50">
              <ClientOnly>
                <SidebarTrigger />
              </ClientOnly>
              <div className="mx-auto">
                <Logo />
              </div>
            </div>
            <div className='overflow-auto h-full'>
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
