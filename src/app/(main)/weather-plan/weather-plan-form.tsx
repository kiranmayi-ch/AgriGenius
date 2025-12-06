'use client';

import React, {useActionState, useEffect, useState} from 'react';
import {useFormStatus} from 'react-dom';
import {generateWeatherPlan, type WeatherPlanState} from './actions';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {
  Loader2,
  AlertCircle,
  Sparkles,
  CloudSun,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Tractor,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const initialState: WeatherPlanState = {
  form: {
    crop: '',
    location: '',
  },
};

function SubmitButton() {
  const {pending} = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Plan...
        </>
      ) : (
        <>
          <CloudSun className="mr-2 h-4 w-4" />
          Get Weather Plan
        </>
      )}
    </Button>
  );
}

function WeatherPlanFormInternal() {
  const [state, formAction] = useActionState(generateWeatherPlan, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Create Your Farming Plan</CardTitle>
            <CardDescription>
              Enter a crop and your location to get a customized, weather-resilient schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="crop">Crop</Label>
                <div className="relative">
                    <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="crop" name="crop" placeholder="e.g., Wheat, Tomato" className="pl-10"/>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="location" name="location" placeholder="e.g., Punjab, India" className="pl-10"/>
                </div>
            </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {useFormStatus().pending && (
         <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is generating your weather-proof plan...</p>
            </CardContent>
         </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Weather-Proof Plan for {state.form.crop}
            </CardTitle>
             <CardDescription>
              A resilient farming schedule for {state.form.location}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className='text-lg font-semibold'>
                    <div className='flex items-center gap-2'>
                        <Thermometer className='h-5 w-5 text-accent'/> {state.result.irrigation.title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground whitespace-pre-wrap p-2'>
                  {state.result.irrigation.plan}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className='text-lg font-semibold'>
                    <div className='flex items-center gap-2'>
                        <Droplets className='h-5 w-5 text-accent'/> {state.result.fertilizer.title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground whitespace-pre-wrap p-2'>
                  {state.result.fertilizer.plan}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className='text-lg font-semibold'>
                    <div className='flex items-center gap-2'>
                        <Wind className='h-5 w-5 text-accent'/> {state.result.pestControl.title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground whitespace-pre-wrap p-2'>
                    {state.result.pestControl.plan}
                </AccordionContent>
              </AccordionItem>
                <AccordionItem value="item-4">
                <AccordionTrigger className='text-lg font-semibold'>
                    <div className='flex items-center gap-2'>
                        <Tractor className='h-5 w-5 text-accent'/> {state.result.harvesting.title}
                    </div>
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground whitespace-pre-wrap p-2'>
                    {state.result.harvesting.plan}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export function WeatherPlanForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <WeatherPlanFormInternal />;
}
