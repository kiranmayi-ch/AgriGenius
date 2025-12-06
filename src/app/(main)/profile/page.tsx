
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <PageHeader
        title="My Farm Profile"
        description="Manage your farm's details for more accurate AI recommendations."
      />
      <Card>
        <CardHeader>
          <CardTitle>Farm Details</CardTitle>
          <CardDescription>
            This information helps AgriGenius tailor its advice to your specific needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., Punjab, India" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="land-size">Land Size (in acres)</Label>
              <Input id="land-size" type="number" placeholder="e.g., 50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="farm-details">Farm Details & Soil Type</Label>
            <Textarea
              id="farm-details"
              placeholder="e.g., Loamy soil, good irrigation, primarily grow wheat and rice."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crop-history">Crop Rotation History</Label>
            <Textarea
              id="crop-history"
              placeholder="e.g., 2023: Wheat, 2022: Rice, 2021: Sugarcane"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    