import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 h-screen">
      <Image
        src="https://images.unsplash.com/photo-1498408040764-ab6eb772a145?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="background of a wheat field at sunset"
        fill
        className="object-cover"
        priority
        data-ai-hint="wheat field"
      />
      <div className="absolute inset-0 bg-background/20" />
      <div className="relative z-10 flex flex-col h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
