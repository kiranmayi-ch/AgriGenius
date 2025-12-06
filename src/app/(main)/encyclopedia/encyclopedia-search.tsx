'use client';

import React, {useActionState, useEffect, useState} from 'react';
import {useFormStatus} from 'react-dom';
import Image from 'next/image';
import {
  generateEncyclopediaEntry,
  type EncyclopediaState,
} from './actions';
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
  BookOpen,
  Search,
  Thermometer,
  Stethoscope,
} from 'lucide-react';

const initialState: EncyclopediaState = {
  form: {
    query: '',
  },
};

function SubmitButton() {
  const {pending} = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Search Encyclopedia
        </>
      )}
    </Button>
  );
}

function EncyclopediaForm() {
  const [state, formAction] = useActionState(
    generateEncyclopediaEntry,
    initialState
  );

  return (
    <div className="space-y-6">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Search the Encyclopedia</CardTitle>
            <CardDescription>
              Enter the name of a pest or disease to look up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="query">Pest or Disease Name</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="query"
                  name="query"
                  placeholder="e.g., Powdery Mildew, Aphids"
                  className="pl-10"
                />
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
                <p className="text-muted-foreground">Fetching encyclopedia entry...</p>
            </CardContent>
         </Card>
      )}

      {state.result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              {state.result.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {state.result.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={state.result.imageUrl}
                  alt={`Image of ${state.result.name}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground bg-secondary/30 p-3 rounded-md">
                {state.result.description}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-accent" />
                Symptoms
              </h3>
              <div className="text-muted-foreground bg-secondary/30 p-3 rounded-md whitespace-pre-wrap">
                {state.result.symptoms}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-accent" />
                Treatment & Prevention
              </h3>
              <div className="text-muted-foreground bg-secondary/30 p-3 rounded-md whitespace-pre-wrap">
                {state.result.treatment}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function EncyclopediaSearch() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <EncyclopediaForm />;
}
