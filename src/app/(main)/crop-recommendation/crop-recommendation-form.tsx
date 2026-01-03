
"use client";

import { useActionState } from "react";
import { getCropRecommendations, type CropRecommendationState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Sparkles, TrendingUp, CheckCircle2, FlaskConical, LineChart, Leaf } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useFormStatus } from "react-dom";
import { Separator } from "@/components/ui/separator";

const initialState: CropRecommendationState = {
  form: {
    location: "",
    landSize: 0,
    soilPH: 7.0,
    soilNitrogen: 50,
    soilPhosphorus: 50,
    soilPotassium: 50,
    weatherForecast: "",
    cropRotationHistory: "",
    marketTrends: "",
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing Data...
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
  const [state, formAction] = useActionState(getCropRecommendations, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Farm & Market Data</CardTitle>
            <CardDescription>
              Provide detailed farm data to power the recommendation model.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Farm Location</Label>
                <Input id="location" name="location" placeholder="e.g., Punjab, India" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landSize">Land Size (in acres)</Label>
                <Input id="landSize" name="landSize" type="number" placeholder="e.g., 50" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2"><FlaskConical className="h-5 w-5 text-primary"/> Soil Parameters</CardTitle>
                <CardDescription>Enter the values from your soil test report.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="space-y-2">
                      <Label htmlFor="soilPH">pH Level</Label>
                      <Input id="soilPH" name="soilPH" type="number" step="0.1" placeholder="e.g., 6.5" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="soilNitrogen">Nitrogen (N) ppm</Label>
                      <Input id="soilNitrogen" name="soilNitrogen" type="number" placeholder="e.g., 80" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="soilPhosphorus">Phosphorus (P) ppm</Label>
                      <Input id="soilPhosphorus" name="soilPhosphorus" type="number" placeholder="e.g., 25" />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="soilPotassium">Potassium (K) ppm</Label>
                      <Input id="soilPotassium" name="soilPotassium" type="number" placeholder="e.g., 150" />
                  </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="weatherForecast">Weather Forecast</Label>
              <Textarea id="weatherForecast" name="weatherForecast" placeholder="e.g., Hot and humid with a late monsoon expected."/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropRotationHistory">Crop Rotation History</Label>
              <Textarea id="cropRotationHistory" name="cropRotationHistory" placeholder="e.g., 2023: Wheat, 2022: Rice, 2021: Sugarcane" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketTrends">Market Trends</Label>
              <Textarea id="marketTrends" name="marketTrends" placeholder="e.g., High demand for organic produce, government subsidies for pulses." />
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
        <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary"/>
                AI Recommendation Report
            </h3>

            {/* Recommendations */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {state.recommendations.recommendations.map((rec, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-2xl">{rec.cropName}</span>
                                <span className="text-sm font-medium text-muted-foreground">Rank #{index + 1}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <p className="text-sm text-muted-foreground p-3 bg-secondary/30 rounded-md border border-secondary">{rec.rationale}</p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-1"><TrendingUp className="h-4 w-4 text-accent"/> Expected Yield</span>
                                    <span className="font-bold">{rec.expectedYield}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium flex items-center gap-1"><span className="text-accent font-bold text-base">₹</span> Profit Margin</span>
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

            {/* Analysis Sections */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        Model Insights & Analysis
                    </CardTitle>
                    <CardDescription>Deeper insights from the recommendation model.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {state.recommendations.soilAnalysis && (
                         <div>
                            <h4 className="font-semibold mb-2">Soil Parameter Analysis</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded-md">{state.recommendations.soilAnalysis}</p>
                        </div>
                    )}
                     {state.recommendations.featureCorrelation && (
                         <div>
                            <h4 className="font-semibold mb-2">Feature Correlation Study</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded-md">{state.recommendations.featureCorrelation}</p>
                        </div>
                    )}
                     {state.recommendations.climateSoilCropModeling && (
                         <div>
                            <h4 className="font-semibold mb-2">Climate-Soil-Crop Relationship Modeling</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded-md">{state.recommendations.climateSoilCropModeling}</p>
                        </div>
                    )}
                     {state.recommendations.sustainableFarmingSupport && (
                         <div>
                            <h4 className="font-semibold mb-2">Sustainable Farming Decision Support</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded-md">{state.recommendations.sustainableFarmingSupport}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
