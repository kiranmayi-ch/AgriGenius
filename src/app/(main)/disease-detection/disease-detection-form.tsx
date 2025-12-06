"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getDiseaseDetection, type DiseaseDetectionState } from "./actions";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bug, Camera, ClipboardCheck, Loader2, Sparkles, AlertCircle, ShieldQuestion } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const initialState: DiseaseDetectionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Bug className="mr-2 h-4 w-4" />
          Detect Disease
        </>
      )}
    </Button>
  );
}

export function DiseaseDetectionForm() {
  const [state, formAction] = useFormState(getDiseaseDetection, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const hiddenDataUriInput = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.photoDataUri) {
      setPreview(state.photoDataUri);
    }
  }, [state.photoDataUri]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        if (hiddenDataUriInput.current) {
          hiddenDataUriInput.current.value = dataUri;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const severityBadgeVariant = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  }

  return (
    <div className="space-y-6">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Upload Crop Image</CardTitle>
            <CardDescription>
              Select a clear photo of the affected plant or leaf for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <input type="hidden" name="photoDataUri" ref={hiddenDataUriInput} />
              
              {preview ? (
                <div className="relative w-full max-w-sm mx-auto aspect-square">
                    <Image src={preview} alt="Selected crop" fill className="rounded-md object-cover" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Camera className="h-12 w-12" />
                  <span className="font-medium">Click to upload an image</span>
                  <span className="text-sm">PNG, JPG, or GIF up to 10MB</span>
                </div>
              )}
            </div>
            {fileName && <p className="text-sm text-center mt-2 text-muted-foreground">File: {fileName}</p>}

          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

      {state.error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.result && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Analysis Report
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <ShieldQuestion className="h-5 w-5 text-muted-foreground"/>
                        Diagnosis: {state.result.disease}
                    </div>
                    <Badge variant={severityBadgeVariant(state.result.severity)}>Severity: {state.result.severity}</Badge>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Explanation</h4>
                    <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">{state.result.explanation}</p>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-accent"/> Recommended Actions</h4>
                    <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md whitespace-pre-wrap">{state.result.recommendedActions}</p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
