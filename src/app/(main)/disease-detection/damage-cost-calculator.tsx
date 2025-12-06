'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getDamageCost, type DiseaseDetectionState } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator, Loader2, AlertCircle, TrendingDown, TriangleAlert } from 'lucide-react';
import type { DetectDiseaseFromImageOutput } from '@/ai/flows/disease-detection-from-image';

type DamageCostCalculatorProps = {
  diseaseResult: DetectDiseaseFromImageOutput;
  initialState: DiseaseDetectionState;
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
          <Calculator className="mr-2 h-4 w-4" />
          Calculate Damage Cost
        </>
      )}
    </Button>
  );
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
}

export function DamageCostCalculator({
  diseaseResult,
  initialState,
}: DamageCostCalculatorProps) {
  const [state, formAction] = useActionState(getDamageCost, initialState);

  return (
    <div className="space-y-6">
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <TriangleAlert />
            Damage Cost Calculator
          </CardTitle>
          <CardDescription>
            Estimate the potential financial loss if the detected disease,{' '}
            <strong>{diseaseResult.disease}</strong>, is left untreated.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          {/* Pass through existing state */}
          <input type="hidden" name="diseaseName" value={diseaseResult.disease} />
          <input type="hidden" name="diseaseSeverity" value={diseaseResult.severity} />
          {initialState.photoDataUri && <input type="hidden" name="photoDataUri" value={initialState.photoDataUri} />}
          {initialState.result && <input type="hidden" name="result" value={JSON.stringify(initialState.result)} />}

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Input
                  id="cropType"
                  name="cropType"
                  placeholder="e.g., Wheat"
                  defaultValue={state?.damageCostForm?.cropType}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landSizeAcres">Land Size (in acres)</Label>
                <Input
                  id="landSizeAcres"
                  name="landSizeAcres"
                  type="number"
                  placeholder="e.g., 50"
                  defaultValue={state?.damageCostForm?.landSizeAcres}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedYieldPerAcre">Yield / Acre (kg)</Label>
                <Input
                  id="expectedYieldPerAcre"
                  name="expectedYieldPerAcre"
                  type="number"
                  placeholder="e.g., 2000"
                  defaultValue={state?.damageCostForm?.expectedYieldPerAcre}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPricePerUnit">Avg. Price / Unit (₹)</Label>
                <Input
                  id="sellingPricePerUnit"
                  name="sellingPricePerUnit"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 20"
                  defaultValue={state?.damageCostForm?.sellingPricePerUnit}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state?.damageCostError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Calculation Failed</AlertTitle>
          <AlertDescription>{state.damageCostError}</AlertDescription>
        </Alert>
      )}

      {state?.damageCostResult && (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <TrendingDown className="h-6 w-6 text-destructive"/>
                    Potential Loss Estimate
                </CardTitle>
                <CardDescription>
                    This is an AI-powered estimate of potential losses for <strong>{state.damageCostForm?.cropType}</strong>.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                          <span className="font-medium">Estimated Yield Loss</span>
                      </div>
                      <div className='text-right'>
                        <p className="text-xl font-bold">{state.damageCostResult.estimatedYieldLossPercentage}</p>
                        <p className='text-sm text-muted-foreground'>({state.damageCostResult.estimatedYieldLossQuantity.toLocaleString()} kg)</p>
                      </div>
                  </div>

                 <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg text-destructive">
                      <div className="flex items-center gap-3">
                          <span className="font-medium">Estimated Financial Loss</span>
                      </div>
                      <span className="text-xl font-bold">{formatCurrency(state.damageCostResult.estimatedFinancialLoss)}</span>
                  </div>

                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Urgent Recommendation</AlertTitle>
                    <AlertDescription className='whitespace-pre-wrap'>
                        {state.damageCostResult.recommendation}
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
