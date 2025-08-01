import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Farmer, Language } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import {
  CropService,
  generateSampleData,
  migrateCropData,
} from "@/lib/storage";
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
  Leaf,
  Plus,
  Eye,
  MessageCircle,
  TrendingUp,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Footer from "@/components/Footer";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import { ProfileEdit } from "@/components/ProfileEdit";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { QuickActions } from "@/components/QuickActions";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useTranslation(selectedLanguage);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.type !== "farmer") {
      navigate("/");
      return;
    }

    const farmerUser = currentUser as Farmer;
    setFarmer(farmerUser);
    setSelectedLanguage(farmerUser.language);

    // Generate sample data if needed
    generateSampleData();
    // Migrate existing data to ensure sampleDelivery field exists
    migrateCropData();
  }, [navigate]);

  const myCrops = farmer ? CropService.getCropsByFarmerId(farmer.id) : [];
  const allCrops = CropService.getAllCrops();
  const otherCrops = allCrops.filter((crop) => crop.farmerId !== farmer?.id);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
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
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">
                  {t("app.name")}
                </h1>
                <p className="text-sm text-green-600">
                  {t("farmer.dashboard.welcome")} {farmer.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {farmer.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ProfileEdit
                user={farmer}
                language={selectedLanguage}
                onProfileUpdate={(updatedUser) => {
                  setFarmer(updatedUser as Farmer);
                  setSelectedLanguage(updatedUser.language);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("profile.logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* AI Features Banner */}
        <Card className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <CardContent className="relative pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  🌱 Smart Market Insights
                </h2>
                <p className="text-green-100 mb-4">
                  Discover market trends, compare prices, and find optimal
                  buyers for your crops with our AI-powered tools.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    📊 Market Analysis
                  </Badge>
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    💰 Price Insights
                  </Badge>
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    🎯 Smart Recommendations
                  </Badge>
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    📈 Crop Comparison
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Crops</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myCrops.length}</div>
              <p className="text-xs text-muted-foreground">Listed products</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {myCrops
                  .reduce(
                    (total, crop) => total + crop.quantity * crop.pricePerUnit,
                    0,
                  )
                  .toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">
                Total inventory worth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quantity
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myCrops
                  .reduce((total, crop) => {
                    // Convert to quintals for consistent calculation
                    const quantityInQuintals =
                      crop.unit === "kg"
                        ? crop.quantity / 100
                        : crop.unit === "ton"
                          ? crop.quantity * 10
                          : crop.quantity; // already in quintals
                    return total + quantityInQuintals;
                  }, 0)
                  .toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Quintals total</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Market Crops
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{otherCrops.length}</div>
              <p className="text-xs text-muted-foreground">
                From other farmers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            onClick={() => navigate("/farmer/crop-upload")}
            className="h-16 sm:h-20 bg-green-600 hover:bg-green-700 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="leading-tight">
              {t("farmer.dashboard.add.crop")}
            </span>
          </Button>

          <Button
            onClick={() => navigate("/farmer/my-crops")}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Package className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="leading-tight">
              {t("farmer.dashboard.my.crops")}
            </span>
          </Button>

          <Button
            onClick={() => navigate("/farmer/explore")}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="leading-tight">
              {t("farmer.dashboard.explore")}
            </span>
          </Button>

          <Button
            onClick={() => navigate("/farmer/messages")}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="leading-tight">
              {t("farmer.dashboard.messages")}
            </span>
          </Button>
        </div>

        {/* Market Insights for Farmers */}
        <QuickActions crops={otherCrops} language={selectedLanguage} />

        {/* Smart Market Analysis */}
        <SmartRecommendations crops={otherCrops} language={selectedLanguage} />

        {/* Recent Crops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Recent Crops */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("farmer.dashboard.my.crops")}</CardTitle>
                  <CardDescription>Your recently listed crops</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/farmer/my-crops")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {myCrops.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No crops listed yet</p>
                  <Button
                    onClick={() => navigate("/farmer/crop-upload")}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Crop
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myCrops.slice(0, 3).map((crop) => (
                    <div
                      key={crop.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Leaf className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {crop.cropType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {crop.quantity} {crop.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{crop.pricePerUnit}/{crop.unit}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Market Overview */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Market Overview</CardTitle>
                  <CardDescription>
                    Recent crops from other farmers
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/farmer/explore")}
                >
                  Explore
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {otherCrops.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No other crops available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {otherCrops.slice(0, 3).map((crop) => (
                    <div
                      key={crop.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Leaf className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {crop.cropType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {crop.farmerVillage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{crop.pricePerUnit}/{crop.unit}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />

      {/* Floating Language Selector */}
      <FloatingLanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </div>
  );
};

export default FarmerDashboard;
