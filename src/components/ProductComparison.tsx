import React, { useState } from "react";
import { Crop, Language } from "@/types";
import { useTranslation, cropTypes } from "@/lib/i18n";
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
  Scale,
  TrendingUp,
  TrendingDown,
  Equal,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Star,
  Package,
  MapPin,
  Calendar,
  Leaf,
  DollarSign,
} from "lucide-react";

interface ProductComparisonProps {
  crops: Crop[];
  language: Language;
}

export const ProductComparison = ({
  crops,
  language,
}: ProductComparisonProps) => {
  const { t } = useTranslation(language);
  const [selectedCrops, setSelectedCrops] = useState<Crop[]>([]);
  const [availableCrops, setAvailableCrops] = useState<Crop[]>(crops);

  const addToComparison = (crop: Crop) => {
    if (
      selectedCrops.length < 4 &&
      !selectedCrops.find((c) => c.id === crop.id)
    ) {
      setSelectedCrops((prev) => [...prev, crop]);
      setAvailableCrops((prev) => prev.filter((c) => c.id !== crop.id));
    }
  };

  const removeFromComparison = (cropId: string) => {
    const cropToRemove = selectedCrops.find((c) => c.id === cropId);
    if (cropToRemove) {
      setSelectedCrops((prev) => prev.filter((c) => c.id !== cropId));
      setAvailableCrops((prev) => [...prev, cropToRemove]);
    }
  };

  const getBestValue = (crops: Crop[]) => {
    if (crops.length === 0) return null;
    return crops.reduce((best, current) =>
      current.pricePerUnit < best.pricePerUnit ? current : best,
    );
  };

  const getWorstValue = (crops: Crop[]) => {
    if (crops.length === 0) return null;
    return crops.reduce((worst, current) =>
      current.pricePerUnit > worst.pricePerUnit ? current : worst,
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getComparisonIndicator = (
    crop: Crop,
    field: "price" | "quality" | "quantity",
  ) => {
    if (selectedCrops.length < 2) return null;

    switch (field) {
      case "price":
        const bestPrice = getBestValue(selectedCrops);
        const worstPrice = getWorstValue(selectedCrops);
        if (crop.id === bestPrice?.id)
          return <TrendingDown className="h-4 w-4 text-green-600" />;
        if (crop.id === worstPrice?.id)
          return <TrendingUp className="h-4 w-4 text-red-600" />;
        return <Equal className="h-4 w-4 text-gray-400" />;

      case "quality":
        const qualityScores = { premium: 3, good: 2, standard: 1 };
        const maxQuality = Math.max(
          ...selectedCrops.map((c) => qualityScores[c.quality]),
        );
        const minQuality = Math.min(
          ...selectedCrops.map((c) => qualityScores[c.quality]),
        );
        if (qualityScores[crop.quality] === maxQuality)
          return <CheckCircle className="h-4 w-4 text-green-600" />;
        if (
          qualityScores[crop.quality] === minQuality &&
          maxQuality !== minQuality
        )
          return <AlertCircle className="h-4 w-4 text-red-600" />;
        return <Equal className="h-4 w-4 text-gray-400" />;

      case "quantity":
        const maxQuantity = Math.max(...selectedCrops.map((c) => c.quantity));
        const minQuantity = Math.min(...selectedCrops.map((c) => c.quantity));
        if (crop.quantity === maxQuantity)
          return <TrendingUp className="h-4 w-4 text-green-600" />;
        if (crop.quantity === minQuantity && maxQuantity !== minQuantity)
          return <TrendingDown className="h-4 w-4 text-red-600" />;
        return <Equal className="h-4 w-4 text-gray-400" />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Product Comparison</CardTitle>
              <CardDescription>
                Compare up to 4 products side by side to find the optimal choice
              </CardDescription>
            </div>
          </div>
          {selectedCrops.length > 0 && (
            <div className="mt-4">
              <Badge className="bg-teal-100 text-teal-800 border-teal-300">
                {selectedCrops.length}/4 products selected
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Available Products to Add */}
      {selectedCrops.length < 4 && availableCrops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Products to Compare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCrops.slice(0, 6).map((crop) => (
                <div key={crop.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium capitalize text-sm">
                        {cropTypes[language]?.[crop.cropType] || crop.cropType}
                      </h3>
                      <p className="text-xs text-gray-600">{crop.farmerName}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToComparison(crop)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">₹{crop.pricePerUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <Badge variant="outline" className="text-xs py-0 px-1">
                        {crop.quality}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {selectedCrops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Product Comparison ({selectedCrops.length} products)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-full">
                {selectedCrops.map((crop, index) => (
                  <div
                    key={crop.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gray-50 p-3 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold capitalize text-sm">
                            {cropTypes[language]?.[crop.cropType] ||
                              crop.cropType}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {crop.variety}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromComparison(crop.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3 space-y-3">
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Price</span>
                          {getComparisonIndicator(crop, "price")}
                        </div>
                        <span className="font-semibold text-green-600">
                          ₹{crop.pricePerUnit}
                        </span>
                      </div>

                      {/* Quality */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Quality</span>
                          {getComparisonIndicator(crop, "quality")}
                        </div>
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

                      {/* Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Quantity</span>
                          {getComparisonIndicator(crop, "quantity")}
                        </div>
                        <span className="font-medium">
                          {crop.quantity} {crop.unit}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Location</span>
                        </div>
                        <span className="text-xs text-gray-600 text-right">
                          {crop.farmerVillage}
                        </span>
                      </div>

                      {/* Harvest Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Harvested</span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {formatDate(crop.harvestDate)}
                        </span>
                      </div>

                      {/* Organic */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Organic</span>
                        </div>
                        {crop.isOrganic ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </div>

                      {/* Sample Available */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Sample</span>
                        </div>
                        {crop.sampleDelivery?.available ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                      </div>

                      {/* Farmer */}
                      <div className="border-t pt-3">
                        <div className="text-center">
                          <p className="font-medium text-sm">
                            {crop.farmerName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {crop.farmerPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-3 border-t">
                      <Button size="sm" className="w-full">
                        Contact Farmer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Summary */}
            {selectedCrops.length > 1 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Comparison Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                      <TrendingDown className="h-4 w-4" />
                      <span className="font-medium">Best Price</span>
                    </div>
                    <p className="text-gray-700">
                      {getBestValue(selectedCrops)?.farmerName} - ₹
                      {getBestValue(selectedCrops)?.pricePerUnit}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                      <Star className="h-4 w-4" />
                      <span className="font-medium">Premium Quality</span>
                    </div>
                    <p className="text-gray-700">
                      {
                        selectedCrops.filter((c) => c.quality === "premium")
                          .length
                      }{" "}
                      product(s)
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                      <Leaf className="h-4 w-4" />
                      <span className="font-medium">Organic</span>
                    </div>
                    <p className="text-gray-700">
                      {selectedCrops.filter((c) => c.isOrganic).length}{" "}
                      product(s)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedCrops.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products selected for comparison</p>
              <p className="text-sm">
                Add products above to start comparing them side by side
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
