"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, KeyRound } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
            <Logo />
        </div>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your mobile number to get started.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="mobile" name="mobile" type="tel" placeholder="+91 98765 43210" className="pl-10" />
          </div>
        </div>
         <Button variant="secondary" className="w-full">Send OTP</Button>
        <div className="space-y-2">
          <Label htmlFor="otp">One-Time Password (OTP)</Label>
           <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="otp" name="otp" type="text" placeholder="Enter OTP" className="pl-10" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Sign Up</Button>
        <p className="text-xs text-muted-foreground text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
