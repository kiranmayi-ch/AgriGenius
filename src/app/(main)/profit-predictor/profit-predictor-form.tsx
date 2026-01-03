
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { getProfitPrediction, fetchRegionalAverages, type ProfitPredictorState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, DollarSign, Leaf, LineChart, Loader2, Sparkles, Map, Pin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useFormStatus } from "react-dom";
import { ClientOnly } from "@/components/client-only";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const initialState: ProfitPredictorState = {
  form: {
    cropType: "",
    landSizeAcres: undefined,
    expectedYieldPerAcre: undefined,
    sellingPricePerUnit: undefined,
    inputCostsPerAcre: undefined,
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
          Calculating...
        </>
      ) : (
        <>
          <BarChart className="mr-2 h-4 w-4" />
          Calculate Profit
        </>
      )}
    </Button>
  );
}

export function ProfitPredictorForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(getProfitPrediction, initialState);
  const [formValues, setFormValues] = useState(initialState.form);
  
  const [useAverageYield, setUseAverageYield] = useState(false);
  const [useAveragePrice, setUseAveragePrice] = useState(false);
  const [useAverageCost, setUseAverageCost] = useState(false);

  const [isFetching, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = async (field: 'expectedYieldPerAcre' | 'sellingPricePerUnit' | 'inputCostsPerAcre', checked: boolean) => {
    const setters = {
        expectedYieldPerAcre: setUseAverageYield,
        sellingPricePerUnit: setUseAveragePrice,
        inputCostsPerAcre: setUseAverageCost
    };
    setters[field](checked);

    if (checked) {
        if (!formValues.location || !formValues.cropType) {
            toast({ variant: 'destructive', title: "Missing Info", description: "Please enter Location and Crop Type first."});
            setters[field](false);
            return;
        }

        startTransition(async () => {
            const result = await fetchRegionalAverages({
                location: formValues.location!,
                cropType: formValues.cropType!,
                fields: [field]
            });

            if ('error' in result) {
                toast({ variant: 'destructive', title: "AI Error", description: result.error});
                setters[field](false);
            } else {
                 setFormValues(prev => ({...prev, [field]: result.data[field]}));
                 toast({ title: "AI Suggestion", description: "Using average data for your region. You can edit anytime."});
            }
        });
    }
  }


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  }

  const isYieldDisabled = useAverageYield || isFetching;
  const isPriceDisabled = useAveragePrice || isFetching;
  const isCostDisabled = useAverageCost || isFetching;

  return (
    <div className="space-y-6">
      <ClientOnly>
        <form action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle>Crop & Cost Details</CardTitle>
              <CardDescription>
                Enter your estimates to predict the financial outcome of your harvest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <Input id="location" name="location" placeholder="e.g., Nashik, Maharashtra" value={formValues.location || ''} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Input id="cropType" name="cropType" placeholder="e.g., Wheat" value={formValues.cropType || ''} onChange={handleInputChange}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landSizeAcres">Land Size (in acres)</Label>
                  <Input id="landSizeAcres" name="landSizeAcres" type="number" placeholder="e.g., 50" value={formValues.landSizeAcres || ''} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expectedYieldPerAcre">Expected Yield / Acre (kg)</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="useAverageYield" name="useAverageYield" onCheckedChange={(checked) => handleToggle('expectedYieldPerAcre', checked)} checked={useAverageYield} />
                      <Label htmlFor="useAverageYield" className="text-xs">Use AI Average</Label>
                    </div>
                  </div>
                  <Input id="expectedYieldPerAcre" name="expectedYieldPerAcre" type="number" placeholder="e.g., 2000" value={formValues.expectedYieldPerAcre || ''} onChange={handleInputChange} disabled={isYieldDisabled}/>
                  {useAverageYield && <p className="text-xs text-muted-foreground">Using average data for your region. You can edit anytime.</p>}
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                    <Label htmlFor="sellingPricePerUnit">Avg. Selling Price / Unit (₹)</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="useAveragePrice" name="useAveragePrice" onCheckedChange={(checked) => handleToggle('sellingPricePerUnit', checked)} checked={useAveragePrice}/>
                      <Label htmlFor="useAveragePrice" className="text-xs">Use AI Average</Label>
                    </div>
                  </div>
                  <Input id="sellingPricePerUnit" name="sellingPricePerUnit" type="number" step="0.01" placeholder="e.g., 20" value={formValues.sellingPricePerUnit || ''} onChange={handleInputChange} disabled={isPriceDisabled} />
                  {useAveragePrice && <p className="text-xs text-muted-foreground">Using average data for your region. You can edit anytime.</p>}
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                    <Label htmlFor="inputCostsPerAcre">Input Costs / Acre (₹)</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="useAverageCost" name="useAverageCost" onCheckedChange={(checked) => handleToggle('inputCostsPerAcre', checked)} checked={useAverageCost}/>
                      <Label htmlFor="useAverageCost" className="text-xs">Use AI Average</Label>
                    </div>
                  </div>
                  <Input id="inputCostsPerAcre" name="inputCostsPerAcre" type="number" placeholder="e.g., 15000" value={formValues.inputCostsPerAcre || ''} onChange={handleInputChange} disabled={isCostDisabled}/>
                  {useAverageCost && <p className="text-xs text-muted-foreground">Using average data for your region. You can edit anytime.</p>}
                </div>
                 {isFetching && <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching AI suggestions...</div>}
              </div>

            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </Card>
        </form>
      </ClientOnly>

      {state.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.result && (
        <>
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Prediction Results for {state.form.cropType}
                  </CardTitle>
                  <CardDescription>
                      Here is the estimated financial breakdown for your {state.form.landSizeAcres}-acre farm.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                          <Leaf className="h-6 w-6 text-muted-foreground" />
                          <span className="font-medium">Total Expected Yield</span>
                      </div>
                      <span className="text-xl font-bold">{formatNumber(state.result.expectedYield)} kg</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                          <span className="font-bold text-muted-foreground text-xl">₹</span>
                          <span className="font-medium">Expected Income (Avg. Price)</span>
                      </div>
                      <span className="text-xl font-bold">{formatCurrency(state.result.expectedIncome)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
                      <div className="flex items-center gap-3 text-destructive">
                          <LineChart className="h-6 w-6 " />
                          <span className="font-medium">Total Input Costs</span>
                      </div>
                      <span className="text-xl font-bold text-destructive">{formatCurrency(state.result.totalInputCosts)}</span>
                  </div>
                  <Separator />
                  <div className={`flex items-center justify-between p-4 rounded-lg ${state.result.estimatedProfitLoss >= 0 ? 'bg-accent/10 text-accent-foreground' : 'bg-destructive/10 text-destructive'}`}>
                      <span className="text-lg font-bold">Estimated Profit / Loss</span>
                      <span className={`text-2xl font-bold ${state.result.estimatedProfitLoss >= 0 ? 'text-accent-foreground' : 'text-destructive'}`}>{formatCurrency(state.result.estimatedProfitLoss)}</span>
                  </div>
              </CardContent>
          </Card>

          {state.result.marketSuggestions && state.result.marketSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Map className="h-6 w-6 text-primary" />
                    Intelligent Market Suggestions
                </CardTitle>
                <CardDescription>
                    Sell your crop at these nearby Mandis for potentially higher profits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.result.marketSuggestions.map((market, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-lg">{market.mandiName}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1"><Pin className="h-3 w-3"/>{market.distance}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg text-accent">{formatCurrency(market.potentialProfit)}</p>
                           <p className="text-sm text-muted-foreground">Est. Profit</p>
                        </div>
                    </div>
                    <Separator className="my-3"/>
                    <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Price / Unit</span>
                            <span className="font-medium">{formatCurrency(market.estimatedPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Advantage</span>
                            <span className="font-medium text-right">{market.pros}</span>
                        </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
