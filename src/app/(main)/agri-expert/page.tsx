
"use client";

import { PageHeader } from "@/components/page-header";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Sprout, Wheat, Carrot, Apple, Phone, MessageSquare, UserCheck, MapPin, Search } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClientOnly } from "@/components/client-only";

const experts = [
  { name: "Dr. Rajesh Kumar", category: "Grains", location: "Punjab", contact: "+91 98765 43210", whatsapp: "+91 98765 43210" },
  { name: "Sunita Sharma", category: "Grains", location: "Haryana", contact: "+91 98765 43211", whatsapp: "+91 98765 43211" },
  { name: "Anil Patel", category: "Vegetables", location: "Gujarat", contact: "+91 98765 43212", whatsapp: "+91 98765 43212" },
  { name: "Priya Singh", category: "Vegetables", location: "Maharashtra", contact: "+91 98765 43213", whatsapp: "+91 98765 43213" },
  { name: "Dr. Meena Kumari", category: "Fruits", location: "Himachal Pradesh", contact: "+91 98765 43214", whatsapp: "+91 98765 43214" },
  { name: "Amit Verma", category: "Fruits", location: "Andhra Pradesh", contact: "+91 98765 43215", whatsapp: "+9.1 98765 43215" },
  { name: "Deepak Gowda", category: "Pulses", location: "Karnataka", contact: "+91 98765 43216", whatsapp: "+91 98765 43216" },
  { name: "Sarita Devi", category: "Pulses", location: "Madhya Pradesh", contact: "+91 98765 43217", whatsapp: "+91 98765 43217" },
];

const expertCategories = [
  { name: "Grains", icon: Wheat, experts: experts.filter(e => e.category === "Grains") },
  { name: "Vegetables", icon: Carrot, experts: experts.filter(e => e.category === "Vegetables") },
  { name: "Fruits", icon: Apple, experts: experts.filter(e => e.category === "Fruits") },
  { name: "Pulses", icon: Sprout, experts: experts.filter(e => e.category === "Pulses") },
];

export default function AgriExpertPage() {
  const [location, setLocation] = useState<string>("");
  const [showExperts, setShowExperts] = useState<boolean>(false);
  const { translations } = useLanguage();

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(location.trim()) {
        setShowExperts(true);
    }
  }

  if (!showExperts) {
    return (
       <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <PageHeader
          title={translations.agriExpert.title}
          description="Enter your location to find nearby agricultural experts."
        />
        <div className="flex items-center justify-center pt-10">
            <ClientOnly>
                <Card className="w-full max-w-lg">
                    <form onSubmit={handleLocationSubmit}>
                        <CardHeader>
                            <CardTitle>Find an Expert</CardTitle>
                            <CardDescription>Enter your state or district to get started.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Punjab, Haryana..."
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full">
                                <Search className="mr-2 h-4 w-4"/>
                                Search Experts
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </ClientOnly>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title={translations.agriExpert.title}
        description={`Showing experts. You can change your location anytime.`}
      />

       <div className="space-y-8">
        {expertCategories.map((category) => (
          <div key={category.name}>
             <div className="flex items-center gap-3 mb-4">
                <category.icon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">{category.name} Experts</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.experts.map(expert => (
                <Card key={expert.name}>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-muted rounded-full">
                                <UserCheck className="h-6 w-6 text-muted-foreground"/>
                            </div>
                            <div>
                                <CardTitle>{expert.name}</CardTitle>
                                <CardDescription>{expert.location}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                        <Separator />
                        <div className="flex items-center justify-between text-sm">
                           <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4"/> Contact</p>
                           <a href={`tel:${expert.contact}`} className="font-medium text-primary hover:underline">{expert.contact}</a>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                           <p className="flex items-center gap-2 text-muted-foreground"><MessageSquare className="h-4 w-4"/> WhatsApp</p>
                            <a href={`https://wa.me/${expert.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{expert.whatsapp}</a>
                        </div>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
