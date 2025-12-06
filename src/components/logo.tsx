import { Sprout } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Sprout className="h-8 w-8 text-accent" />
      <h1 className="text-xl font-bold text-foreground font-headline">
        AgriGenius
      </h1>
    </div>
  );
}
