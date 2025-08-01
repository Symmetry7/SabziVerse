import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Farmer, Language } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import { CropService, migrateCropData } from "@/lib/storage";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import { CropCard } from "@/components/CropCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Leaf, ArrowLeft, Search, TrendingUp, Eye, Users } from "lucide-react";

const ExploreCrops = () => {
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useTranslation(selectedLanguage);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high" | "quantity"
  >("newest");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.type !== "farmer") {
      navigate("/");
      return;
    }

    const farmerUser = currentUser as Farmer;
    setFarmer(farmerUser);
    setSelectedLanguage(farmerUser.language);

    // Migrate existing data to ensure sampleDelivery field exists
    migrateCropData();
  }, [navigate]);

  const allCrops = CropService.getAllCrops();
  const otherCrops = farmer
    ? allCrops.filter((crop) => crop.farmerId !== farmer.id)
    : [];

  // Filter and search crops
  const filteredCrops = otherCrops
    .filter((crop) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          crop.cropType.toLowerCase().includes(query) ||
          crop.variety?.toLowerCase().includes(query) ||
          crop.description.toLowerCase().includes(query) ||
          crop.farmerName.toLowerCase().includes(query) ||
          crop.farmerVillage.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerUnit - b.pricePerUnit;
        case "price-high":
          return b.pricePerUnit - a.pricePerUnit;
        case "quantity":
          return b.quantity - a.quantity;
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/farmer/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back")}
              </Button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">
                  Explore Crops
                </h1>
                <p className="text-sm text-green-600">
                  See what other farmers are selling
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Crops
              </CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{otherCrops.length}</div>
              <p className="text-xs text-muted-foreground">
                From other farmers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(otherCrops.map((crop) => crop.farmerId)).size}
              </div>
              <p className="text-xs text-muted-foreground">Active sellers</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {Math.round(
                  otherCrops.reduce((sum, crop) => sum + crop.pricePerUnit, 0) /
                    (otherCrops.length || 1),
                ).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Per quintal</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>
              Explore crops from farmers across India
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search crops, farmers, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="quantity">Quantity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredCrops.length} crops found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          )}
        </div>

        {/* Crops Grid */}
        {filteredCrops.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No crops found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "No other farmers have listed crops yet"}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mr-2"
              >
                Clear Search
              </Button>
            )}
            <Button onClick={() => navigate("/farmer/crop-upload")}>
              List Your Crops
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                language={selectedLanguage}
                showContactButton={false} // Farmers can view but not contact themselves
              />
            ))}
          </div>
        )}

        {/* Insights Section */}
        {filteredCrops.length > 0 && (
          <div className="mt-12">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>
                  Learn from what other farmers are doing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Most Popular Crop
                    </h4>
                    <p className="text-lg font-bold text-green-600 capitalize">
                      {
                        Object.entries(
                          filteredCrops.reduce(
                            (acc, crop) => {
                              acc[crop.cropType] =
                                (acc[crop.cropType] || 0) + 1;
                              return acc;
                            },
                            {} as Record<string, number>,
                          ),
                        ).sort(([, a], [, b]) => b - a)[0]?.[0]
                      }
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Price Range
                    </h4>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{Math.min(...filteredCrops.map((c) => c.pricePerUnit))} -
                      ₹{Math.max(...filteredCrops.map((c) => c.pricePerUnit))}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      Organic Crops
                    </h4>
                    <p className="text-lg font-bold text-purple-600">
                      {Math.round(
                        (filteredCrops.filter((c) => c.isOrganic).length /
                          filteredCrops.length) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Language Selector */}
      <FloatingLanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </div>
  );
};

export default ExploreCrops;
