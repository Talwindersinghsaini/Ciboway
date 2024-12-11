"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMealStore } from "@/lib/store/meal-store";

interface ScanResult {
  barcode: string;
  name: string;
  brand: string;
  image: string;
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  ingredients: string;
  certifications: string[];
  ethicalScore: number;
  packaging: string[];
  origin: string[];
  ecoscore: string;
  nutriscore: string;
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScanResult | null>(null);
  const { toast } = useToast();
  const { addMealPlan } = useMealStore();

  const handleScan = async () => {
    setIsScanning(true);
    try {
      // Simulate barcode scan - replace with actual barcode scanning
      const barcode = "3017620425035"; // Example Nutella barcode
      
      const response = await fetch(`/api/products/${barcode}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const product = await response.json();
      setScannedProduct(product);
      
      toast({
        title: "Product Scanned",
        description: `${product.name} - Ethical Score: ${product.ethicalScore}/100`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not find product information",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToMeal = () => {
    if (!scannedProduct) return;

    const recipe = {
      id: `recipe-${Date.now()}`,
      name: scannedProduct.name,
      servings: 1,
      ingredients: [
        {
          id: `ing-${Date.now()}`,
          name: scannedProduct.name,
          quantity: "1",
          unit: "serving",
          category: "pantry",
          checked: false,
          haveAtHome: false,
        },
      ],
      instructions: ["Use as needed"],
      prepTime: 0,
      cookTime: 0,
      calories: scannedProduct.nutritionFacts.calories,
      protein: scannedProduct.nutritionFacts.protein,
      carbs: scannedProduct.nutritionFacts.carbs,
      fat: scannedProduct.nutritionFacts.fat,
      ethicalScore: scannedProduct.ethicalScore,
      tags: scannedProduct.certifications,
      image: scannedProduct.image,
    };

    const mealPlan = {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      mealType: "Snacks",
      recipe,
      servings: 1,
    };

    addMealPlan(mealPlan);
    toast({
      title: "Added to Meals",
      description: "Product has been added to your meal plan and grocery list.",
    });
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Scan Product</h1>
        <p className="text-muted-foreground">
          Scan a barcode or upload a photo to get ethical insights
        </p>
      </div>

      <Card className={cn(
        "aspect-square max-w-md mx-auto relative overflow-hidden",
        "flex items-center justify-center",
        isScanning && "animate-pulse"
      )}>
        <div className="absolute inset-0 bg-black/5" />
        <Camera className="h-24 w-24 text-muted-foreground/50" />
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-64 h-1 bg-primary/20 overflow-hidden rounded-full">
              <div className="w-full h-full bg-primary animate-[scan_2s_ease-in-out_infinite]" />
            </div>
          </div>
        )}
      </Card>

      <div className="flex gap-4 justify-center">
        <Button
          size="lg"
          onClick={handleScan}
          disabled={isScanning}
          className="rounded-full"
        >
          <Camera className="mr-2 h-4 w-4" />
          Scan Barcode
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full"
          disabled={isScanning}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      {scannedProduct && (
        <Card className="p-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {scannedProduct.image && (
                <img
                  src={scannedProduct.image}
                  alt={scannedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{scannedProduct.name}</h2>
                <p className="text-sm text-muted-foreground">{scannedProduct.brand}</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-green-500/10">
                Ethical Score: {scannedProduct.ethicalScore}/100
              </Badge>
              {scannedProduct.certifications?.map((cert) => (
                <Badge key={cert} variant="outline">
                  {cert.replace('en:', '')}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Nutrition Facts (per 100g)</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Calories: {scannedProduct.nutritionFacts.calories}kcal</div>
                <div>Protein: {scannedProduct.nutritionFacts.protein}g</div>
                <div>Carbs: {scannedProduct.nutritionFacts.carbs}g</div>
                <div>Fat: {scannedProduct.nutritionFacts.fat}g</div>
                <div>Fiber: {scannedProduct.nutritionFacts.fiber}g</div>
                <div>Sodium: {scannedProduct.nutritionFacts.sodium}g</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Environmental Impact</h3>
              <div className="flex gap-2">
                <Badge variant={scannedProduct.ecoscore === 'a' ? 'default' : 'secondary'}>
                  Eco-score: {scannedProduct.ecoscore?.toUpperCase()}
                </Badge>
                <Badge variant={scannedProduct.nutriscore === 'a' ? 'default' : 'secondary'}>
                  Nutri-score: {scannedProduct.nutriscore?.toUpperCase()}
                </Badge>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Meal Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Meal Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <p>Would you like to add {scannedProduct.name} to your meal plan?</p>
                  <p className="text-sm text-muted-foreground">
                    This will also add the item to your grocery list.
                  </p>
                  <Button onClick={handleAddToMeal} className="w-full">
                    Add to Meals
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  )
}