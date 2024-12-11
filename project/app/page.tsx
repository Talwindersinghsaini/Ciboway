"use client";

import Link from "next/link";
import { Search, Award, Leaf, Zap, Target, Scan, Medal, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const achievements = [
  {
    icon: Award,
    title: "Ethical Explorer",
    description: "10 Ethical Products Scanned",
    progress: 7,
    total: 10,
    variant: "default" as const,
  },
  {
    icon: Leaf,
    title: "Plant Champion",
    description: "First Vegan Meal Added",
    progress: 1,
    total: 1,
    variant: "success" as const,
    completed: true,
  },
  {
    icon: Zap,
    title: "Goal Crusher",
    description: "100% Calorie Goal Met",
    progress: 85,
    total: 100,
    variant: "warning" as const,
  },
  {
    icon: Target,
    title: "Protein Master",
    description: "80% of Protein Goal Met",
    progress: 80,
    total: 100,
    variant: "info" as const,
  },
];

const upcomingAchievements = [
  {
    icon: Scan,
    title: "Scan Expert",
    description: "Scan 50 Different Products",
    progress: 32,
    total: 50,
  },
  {
    icon: Medal,
    title: "Eco Warrior",
    description: "Reduce CO2 by 20kg",
    progress: 12,
    total: 20,
  },
  {
    icon: Trophy,
    title: "Meal Planner Pro",
    description: "Plan 30 Days of Meals",
    progress: 18,
    total: 30,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8 py-8 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to CiboWay
        </h1>
        <ThemeSwitcher />
      </div>

      <section className="text-center">
        <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
          Make informed food choices that align with your values. Search products,
          track your impact, and join a community of conscious consumers.
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for any food item..." 
              className="pl-10 h-12 text-lg rounded-full"
            />
          </div>
          <div className="flex gap-2 justify-center mt-4 text-sm text-muted-foreground">
            <span>Popular:</span>
            <button className="hover:text-primary transition-colors">Quinoa</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">Avocado</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">Fair Trade Coffee</button>
          </div>
        </div>
      </section>

      <Dialog>
        <DialogTrigger asChild>
          <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Achievements</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map(({ icon: Icon, title, description, progress, total, variant, completed }) => (
                <div key={title} className="text-center space-y-3">
                  <div className="relative inline-block">
                    <div className={`w-16 h-16 rounded-full border-2 ${completed ? 'border-primary' : 'border-muted'} flex items-center justify-center mx-auto`}>
                      <Icon className={`h-8 w-8 ${completed ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    {completed && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <div className="h-2 bg-muted rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(progress / total) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {progress}/{total}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Your Achievements</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Progress</h3>
                <div className="grid gap-4">
                  {achievements.map(({ icon: Icon, title, description, progress, total, completed }) => (
                    <Card key={title} className="p-6">
                      <div className="flex items-start gap-6">
                        <div className={`w-14 h-14 rounded-full border-2 ${completed ? 'border-primary' : 'border-muted'} flex items-center justify-center shrink-0`}>
                          <Icon className={`h-7 w-7 ${completed ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-medium">{title}</h4>
                            <span className="text-sm text-muted-foreground">
                              {progress}/{total}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4">{description}</p>
                          <div className="h-2.5 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(progress / total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Upcoming Achievements</h3>
                <div className="grid gap-4">
                  {upcomingAchievements.map(({ icon: Icon, title, description, progress, total }) => (
                    <Card key={title} className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="w-14 h-14 rounded-full border-2 border-muted flex items-center justify-center shrink-0">
                          <Icon className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-medium">{title}</h4>
                            <span className="text-sm text-muted-foreground">
                              {progress}/{total}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-4">{description}</p>
                          <div className="h-2.5 bg-muted rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(progress / total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <section className="bg-primary/5 -mx-4 px-4 py-12 mt-8">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Your Personal Food Ethics Guide
          </h2>
          <p className="text-muted-foreground mb-6">
            CiboWay helps you make food choices that align with your values.
            Whether you care about sustainability, animal welfare, or dietary
            restrictions, we've got you covered.
          </p>
          <Link href="/profile">
            <Button variant="outline" size="lg" className="rounded-full">
              Set Your Preferences
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}