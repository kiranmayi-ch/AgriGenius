"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateCommunityInsights, type CommunityInsightsState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Loader2, Wheat, Bug, TrendingUp, Syringe, AlertCircle, Sparkles, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const initialState: CommunityInsightsState = {
  form: {
    location: "",
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gathering Insights...
        </>
      ) : (
        <>
          <Users className="mr-2 h-4 w-4" />
          Get Community Insights
        </>
      )}
    </Button>
  );
}


function CommunityForm() {
    const [state, formAction] = useActionState(generateCommunityInsights, initialState);

    return (
    <div className="space-y-6">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Find Local Insights</CardTitle>
            <CardDescription>
              Enter your district or state to discover what's happening in your area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="location">Your Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="location" name="location" placeholder="e.g., Guntur, Andhra Pradesh" className="pl-10" />
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

      {state.result && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary"/>
              Local Insights for {state.form.location}
          </h3>

          {/* Common Crops */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wheat className="h-5 w-5 text-primary" /> Common Crops Nearby
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.result.commonCrops.map((crop, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-md">
                  <p className="font-semibold">{crop.name}</p>
                  <p className="text-sm text-muted-foreground">{crop.notes}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Common Diseases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-primary" /> Common Diseases Reported
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.result.commonDiseases.map((disease, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">{disease.name}</p>
                            <p className="text-sm text-muted-foreground">Affects: {disease.crop}</p>
                        </div>
                        <Badge variant={disease.prevalence === 'High' ? 'destructive' : 'secondary'}>{disease.prevalence} Prevalence</Badge>
                    </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Local Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.result.marketTrends.map((trend, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-md">
                  <p className="font-semibold">{trend.crop}: <span className="font-normal">{trend.trend}</span></p>
                  <p className="text-sm text-muted-foreground">{trend.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Effective Treatments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="h-5 w-5 text-primary" /> Community-Sourced Treatments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.result.effectiveTreatments.map((treatment, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{treatment.treatment}</p>
                      <p className="text-sm text-muted-foreground">For: {treatment.disease}</p>
                    </div>
                     <Badge variant="default">{treatment.effectiveness}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


export function CommunityInsightsForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <CommunityForm />;
}
