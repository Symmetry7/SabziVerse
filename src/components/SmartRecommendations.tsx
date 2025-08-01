import { useState, useEffect } from "react";
import { Crop, CropType, QualityGrade, Language } from "@/types";
import { useTranslation, cropTypes } from "@/lib/i18n";
import {
  SmartRecommendationEngine,
  BuyerPreferences,
  OptimalMatch,
  MarketInsights,
} from "@/lib/recommendationEngine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Leaf,
  Award,
  BarChart3,
  AlertCircle,
  Lightbulb,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CropCard } from "./CropCard";
import { PriceAlerts } from "./PriceAlerts";
import { ProductComparison } from "./ProductComparison";

interface SmartRecommendationsProps {
  crops: Crop[];
  language: Language;
}

export const SmartRecommendations = ({
  crops,
  language,
}: SmartRecommendationsProps) => {
  const { t } = useTranslation(language);
  const [preferences, setPreferences] = useState<BuyerPreferences>({
    preferredCrops: [],
    maxBudgetPerQuintal: 5000,
    minQuality: "standard",
    preferOrganic: false,
    maxDistance: 1000,
    minQuantity: 1,
    urgency: "medium",
    sampleRequired: false,
  });

  const [recommendations, setRecommendations] = useState<OptimalMatch[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(
    null,
  );
  const [selectedCropForInsights, setSelectedCropForInsights] = useState<
    CropType | undefined
  >();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCropForDetail, setSelectedCropForDetail] =
    useState<Crop | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const optimalMatches = SmartRecommendationEngine.findOptimalProducts(
      crops,
      preferences,
    );
    const insights = SmartRecommendationEngine.getMarketInsights(
      crops,
      selectedCropForInsights,
    );

    setRecommendations(optimalMatches);
    setMarketInsights(insights);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (crops.length > 0) {
      const insights = SmartRecommendationEngine.getMarketInsights(crops);
      setMarketInsights(insights);
    }
  }, [crops]);

  const handleCropTypeToggle = (cropType: CropType) => {
    setPreferences((prev) => ({
      ...prev,
      preferredCrops: prev.preferredCrops.includes(cropType)
        ? prev.preferredCrops.filter((c) => c !== cropType)
        : [...prev.preferredCrops, cropType],
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  AI Smart Recommendations
                </CardTitle>
                <CardDescription>
                  {isCollapsed
                    ? "Click to expand AI recommendations"
                    : "Get optimal product matches based on your requirements"}
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
        className={`transition-all duration-300 overflow-hidden ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[4000px] opacity-100"}`}
      >
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger
              value="recommendations"
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Smart Match
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Market Insights
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Price Alerts
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Compare
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Bulk Optimizer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Preferences Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Set Your Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Crop Types */}
                <div className="space-y-2">
                  <Label>Preferred Crop Types</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(cropTypes[language] || cropTypes.en).map(
                      ([key, name]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={preferences.preferredCrops.includes(
                              key as CropType,
                            )}
                            onCheckedChange={() =>
                              handleCropTypeToggle(key as CropType)
                            }
                          />
                          <Label htmlFor={key} className="text-sm capitalize">
                            {name}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Budget */}
                  <div className="space-y-2">
                    <Label>Max Budget (₹ per quintal)</Label>
                    <Input
                      type="number"
                      value={preferences.maxBudgetPerQuintal}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          maxBudgetPerQuintal: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="5000"
                    />
                  </div>

                  {/* Minimum Quantity */}
                  <div className="space-y-2">
                    <Label>Min Quantity (quintals)</Label>
                    <Input
                      type="number"
                      value={preferences.minQuantity}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          minQuantity: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="1"
                    />
                  </div>

                  {/* Quality */}
                  <div className="space-y-2">
                    <Label>Minimum Quality</Label>
                    <Select
                      value={preferences.minQuality}
                      onValueChange={(value: QualityGrade) =>
                        setPreferences((prev) => ({
                          ...prev,
                          minQuality: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Urgency */}
                  <div className="space-y-2">
                    <Label>Purchase Urgency</Label>
                    <Select
                      value={preferences.urgency}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setPreferences((prev) => ({
                          ...prev,
                          urgency: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          Low - Focus on price
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium - Balanced
                        </SelectItem>
                        <SelectItem value="high">
                          High - Immediate need
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Max Distance */}
                  <div className="space-y-2">
                    <Label>Max Distance (km)</Label>
                    <Input
                      type="number"
                      value={preferences.maxDistance}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          maxDistance: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="1000"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organic"
                      checked={preferences.preferOrganic}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          preferOrganic: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="organic">Prefer Organic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sample"
                      checked={preferences.sampleRequired}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({
                          ...prev,
                          sampleRequired: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="sample">Sample Required</Label>
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Find Optimal Products
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations Results */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Optimal Matches ({recommendations.length})
                  </CardTitle>
                  <CardDescription>
                    Products ranked by AI optimization algorithm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {recommendations.slice(0, 6).map((match, index) => (
                      <div key={match.crop.id} className="relative">
                        <div className="absolute -top-2 -left-2 z-10">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold capitalize">
                                {cropTypes[language]?.[match.crop.cropType] ||
                                  match.crop.cropType}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {match.crop.farmerName}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700"
                              >
                                {Math.round(match.score)}% Match
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>₹{match.crop.pricePerUnit}/quintal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>{match.crop.quantity} quintals</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span className="capitalize">
                                {match.crop.quality}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{match.crop.farmerVillage}</span>
                            </div>
                          </div>

                          {match.priceAdvantage > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                              <div className="flex items-center gap-1 text-green-700 text-sm">
                                <TrendingUp className="h-3 w-3" />
                                <span>
                                  {Math.round(match.priceAdvantage)}% below
                                  market price
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              Why this match:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {match.reasons.slice(0, 3).map((reason, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setSelectedCropForDetail(match.crop);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Market Insights
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label>Analyze specific crop:</Label>
                  <Select
                    value={selectedCropForInsights || "all"}
                    onValueChange={(value) => {
                      const cropType =
                        value === "all" ? undefined : (value as CropType);
                      setSelectedCropForInsights(cropType);
                      const insights =
                        SmartRecommendationEngine.getMarketInsights(
                          crops,
                          cropType,
                        );
                      setMarketInsights(insights);
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crops</SelectItem>
                      {Object.entries(cropTypes[language] || cropTypes.en).map(
                        ([key, name]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {marketInsights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Avg Price</p>
                            <p className="text-2xl font-bold">
                              ₹{marketInsights.averagePrice}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Available</p>
                            <p className="text-2xl font-bold">
                              {marketInsights.totalAvailable}
                            </p>
                            <p className="text-xs text-gray-500">quintals</p>
                          </div>
                          <Package className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Organic</p>
                            <p className="text-2xl font-bold">
                              {marketInsights.organicPercentage}%
                            </p>
                          </div>
                          <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Price Range</p>
                            <p className="text-lg font-bold">
                              ₹{marketInsights.priceRange.min} - ₹
                              {marketInsights.priceRange.max}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {marketInsights && marketInsights.topRegions.length > 0 && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Top Producing Regions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {marketInsights.topRegions.map((region, index) => (
                          <div
                            key={region.region}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">#{index + 1}</Badge>
                              <div>
                                <p className="font-medium">{region.region}</p>
                                <p className="text-sm text-gray-600">
                                  {region.count} listings
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ₹{Math.round(region.avgPrice)}
                              </p>
                              <p className="text-sm text-gray-600">avg price</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {marketInsights &&
                  marketInsights.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          AI Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {marketInsights.recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                            >
                              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                              <p className="text-sm text-blue-800">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <PriceAlerts crops={crops} language={language} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <ProductComparison crops={crops} language={language} />
          </TabsContent>

          <TabsContent value="bulk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Bulk Purchase Optimizer
                </CardTitle>
                <CardDescription>
                  Optimize your bulk purchases for maximum savings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Bulk purchase optimization feature coming soon!</p>
                  <p className="text-sm">
                    This will help you find the best combination of suppliers
                    for large orders.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
          {selectedCropForDetail && (
            <div className="mt-4">
              <CropCard
                crop={selectedCropForDetail}
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
