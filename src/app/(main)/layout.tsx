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
            src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop"
            alt="background of a crop field"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
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
