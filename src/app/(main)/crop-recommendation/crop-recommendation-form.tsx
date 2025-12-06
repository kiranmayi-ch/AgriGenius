"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getCropRecommendations, type CropRecommendationState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const initialState: CropRecommendationState = {
  form: {
    location: "Punjab, India",
    landSize: 50,
    farmDetails: "Loamy soil, good irrigation.",
    soilData: "pH 6.8, high in nitrogen, medium phosphorus.",
    weatherForecast: "Warm and sunny with occasional rain.",
    cropRotationHistory: "2023: Wheat, 2022: Rice, 2021: Sugarcane",
    marketTrends: "High demand for organic vegetables and grains.",
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Get Recommendations
        </>
      )}
    </Button>
  );
}

export function CropRecommendationForm() {
  const [state, formAction] = useFormState(getCropRecommendations, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Farm & Market Data</CardTitle>
            <CardDescription>
              Provide as much detail as possible for the best recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={state.form.location} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landSize">Land Size (in acres)</Label>
                <Input id="landSize" name="landSize" type="number" defaultValue={state.form.landSize} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmDetails">Farm Details</Label>
              <Textarea id="farmDetails" name="farmDetails" defaultValue={state.form.farmDetails} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soilData">Soil Data</Label>
              <Textarea id="soilData" name="soilData" defaultValue={state.form.soilData} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weatherForecast">Weather Forecast</Label>
              <Textarea id="weatherForecast" name="weatherForecast" defaultValue={state.form.weatherForecast} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropRotationHistory">Crop Rotation History</Label>
              <Textarea id="cropRotationHistory" name="cropRotationHistory" defaultValue={state.form.cropRotationHistory} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketTrends">Market Trends</Label>
              <Textarea id="marketTrends" name="marketTrends" defaultValue={state.form.marketTrends} />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

      {state.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.recommendations && (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary"/>
                AI Recommendations
            </h3>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {state.recommendations.map((rec, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">{rec.cropName}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <p className="text-sm text-muted-foreground">{rec.rationale}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-1"><TrendingUp className="h-4 w-4 text-accent"/> Expected Yield</span>
                                    <span className="font-bold">{rec.expectedYield}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-1"><span className="text-accent font-bold text-base">$</span> Profit Margin</span>
                                    <span className="font-bold">{rec.profitMargin}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="font-medium flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-accent"/> Sustainability Score</span>
                                      <span className="font-bold">{rec.sustainabilityScore} / 100</span>
                                    </div>
                                    <Progress value={rec.sustainabilityScore} className="h-2 [&>div]:bg-accent" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
