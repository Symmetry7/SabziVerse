import React, { useState } from "react";
import { Crop, CropType, Language } from "@/types";
import { useTranslation, cropTypes } from "@/lib/i18n";
import { SmartRecommendationEngine } from "@/lib/recommendationEngine";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Zap,
  TrendingDown,
  Leaf,
  Award,
  Clock,
  MapPin,
  Package,
  Star,
  DollarSign,
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CropCard } from "./CropCard";

interface QuickActionsProps {
  crops: Crop[];
  language: Language;
  onViewCrop?: (crop: Crop) => void;
}

export const QuickActions = ({
  crops,
  language,
  onViewCrop,
}: QuickActionsProps) => {
  const { t } = useTranslation(language);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [results, setResults] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const quickActions = [
    {
      id: "best-price",
      title: "Best Price Deals",
      description: "Find crops with lowest prices per quintal",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      action: () => {
        const sorted = [...crops].sort(
          (a, b) => a.pricePerUnit - b.pricePerUnit,
        );
        setResults(sorted.slice(0, 6));
      },
    },
    {
      id: "premium-quality",
      title: "Premium Quality",
      description: "Browse highest quality produce available",
      icon: Award,
      color: "from-yellow-500 to-orange-600",
      action: () => {
        const premium = crops
          .filter((c) => c.quality === "premium")
          .sort((a, b) => b.quantity - a.quantity);
        setResults(premium.slice(0, 6));
      },
    },
    {
      id: "organic-only",
      title: "Organic Produce",
      description: "Certified organic crops only",
      icon: Leaf,
      color: "from-green-600 to-lime-600",
      action: () => {
        const organic = crops
          .filter((c) => c.isOrganic)
          .sort((a, b) => a.pricePerUnit - b.pricePerUnit);
        setResults(organic.slice(0, 6));
      },
    },
    {
      id: "fresh-harvest",
      title: "Fresh Harvest",
      description: "Recently harvested crops",
      icon: Clock,
      color: "from-blue-500 to-cyan-600",
      action: () => {
        const now = new Date();
        const fresh = crops
          .filter((c) => {
            const harvestDate = new Date(c.harvestDate);
            const daysDiff =
              (now.getTime() - harvestDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysDiff <= 30; // Within 30 days
          })
          .sort(
            (a, b) =>
              new Date(b.harvestDate).getTime() -
              new Date(a.harvestDate).getTime(),
          );
        setResults(fresh.slice(0, 6));
      },
    },
    {
      id: "bulk-available",
      title: "Bulk Available",
      description: "Large quantities available for bulk purchase",
      icon: Package,
      color: "from-purple-500 to-indigo-600",
      action: () => {
        const bulk = crops
          .filter((c) => c.quantity >= 50) // 50+ quintals
          .sort((a, b) => b.quantity - a.quantity);
        setResults(bulk.slice(0, 6));
      },
    },
    {
      id: "nearby",
      title: "Nearby Farmers",
      description: "Crops from farmers in your region",
      icon: MapPin,
      color: "from-red-500 to-pink-600",
      action: () => {
        // Simple proximity based on state (in real app, use geolocation)
        const northernStates = [
          "haryana",
          "punjab",
          "uttar",
          "rajasthan",
          "delhi",
        ];
        const westernStates = ["gujarat", "maharashtra", "rajasthan"];
        const southernStates = [
          "karnataka",
          "tamil",
          "kerala",
          "telangana",
          "andhra",
        ];

        const nearby = crops
          .filter((c) => {
            const location = c.farmerVillage.toLowerCase();
            return northernStates.some((state) => location.includes(state));
          })
          .sort((a, b) => a.pricePerUnit - b.pricePerUnit);
        setResults(nearby.slice(0, 6));
      },
    },
    {
      id: "sample-available",
      title: "Sample Available",
      description: "Farmers offering sample delivery",
      icon: Star,
      color: "from-teal-500 to-emerald-600",
      action: () => {
        const withSamples = crops
          .filter((c) => c.sampleDelivery?.available)
          .sort(
            (a, b) =>
              (a.sampleDelivery?.deliveryDays || 99) -
              (b.sampleDelivery?.deliveryDays || 99),
          );
        setResults(withSamples.slice(0, 6));
      },
    },
    {
      id: "ending-soon",
      title: "Ending Soon",
      description: "Limited time availability",
      icon: Clock,
      color: "from-orange-500 to-red-600",
      action: () => {
        const now = new Date();
        const endingSoon = crops
          .filter((c) => {
            const endDate = new Date(c.availableUntil);
            const daysLeft =
              (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return daysLeft <= 30 && daysLeft > 0; // Ending within 30 days
          })
          .sort(
            (a, b) =>
              new Date(a.availableUntil).getTime() -
              new Date(b.availableUntil).getTime(),
          );
        setResults(endingSoon.slice(0, 6));
      },
    },
  ];

  const handleQuickAction = (action: any) => {
    setSelectedAction(action.id);
    action.action();
  };

  const getMarketInsights = (actionId: string) => {
    if (results.length === 0) return null;

    const avgPrice =
      results.reduce((sum, c) => sum + c.pricePerUnit, 0) / results.length;
    const totalQuantity = results.reduce((sum, c) => sum + c.quantity, 0);
    const organicCount = results.filter((c) => c.isOrganic).length;

    switch (actionId) {
      case "best-price":
        return `Average: ₹${Math.round(avgPrice)}/quintal • ${results.length} deals found`;
      case "premium-quality":
        return `${results.length} premium crops • Total: ${totalQuantity} quintals`;
      case "organic-only":
        return `${results.length} organic crops • Average: ₹${Math.round(avgPrice)}/quintal`;
      case "bulk-available":
        return `Total available: ${totalQuantity} quintals • ${results.length} suppliers`;
      default:
        return `${results.length} results • ${organicCount} organic • Avg: ₹${Math.round(avgPrice)}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription>
                  {isCollapsed
                    ? "Click to expand quick actions"
                    : "Find optimal products with one click"}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            >
              {isCollapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div
        className={`transition-all duration-300 overflow-hidden ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"}`}
      >
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  selectedAction === action.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                }`}
                onClick={() => handleQuickAction(action)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Results */}
        {selectedAction && results.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {quickActions.find((a) => a.id === selectedAction)?.icon &&
                      React.createElement(
                        quickActions.find((a) => a.id === selectedAction)!.icon,
                        {
                          className: "h-5 w-5",
                        },
                      )}
                    {quickActions.find((a) => a.id === selectedAction)?.title}
                  </CardTitle>
                  <CardDescription>
                    {getMarketInsights(selectedAction)}
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {results.length} Results
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                {results.map((crop, index) => (
                  <div key={crop.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2 z-10">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          #{index + 1}
                        </Badge>
                      </div>
                    )}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold capitalize">
                            {cropTypes[language]?.[crop.cropType] ||
                              crop.cropType}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {crop.farmerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            ₹{crop.pricePerUnit}/quintal
                          </p>
                          <Badge
                            variant={
                              crop.quality === "premium"
                                ? "default"
                                : crop.quality === "good"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {crop.quality}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>{crop.quantity} quintals</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{crop.farmerVillage}</span>
                        </div>
                        {crop.isOrganic && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Leaf className="h-3 w-3" />
                            <span>Organic</span>
                          </div>
                        )}
                        {crop.sampleDelivery?.available && (
                          <div className="flex items-center gap-1 text-blue-600">
                            <Star className="h-3 w-3" />
                            <span>Sample Available</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedCrop(crop);
                            setIsDetailModalOpen(true);
                            onViewCrop?.(crop);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {results.length > 6 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    View All {results.length} Results
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedAction && results.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for this criteria</p>
                <p className="text-sm">
                  Try adjusting your search or check back later
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Crop Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Crop Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this crop listing
            </DialogDescription>
          </DialogHeader>
          {selectedCrop && (
            <div className="mt-4">
              <CropCard
                crop={selectedCrop}
                language={language}
                showContactButton={true}
                className="border-0 shadow-none bg-transparent"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
