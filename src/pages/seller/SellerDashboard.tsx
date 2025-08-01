import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Language } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import {
  CropService,
  MessageService,
  generateSampleData,
  migrateCropData,
} from "@/lib/storage";
import { CropCard } from "@/components/CropCard";
import { SmartRecommendations } from "@/components/SmartRecommendations";
import { QuickActions } from "@/components/QuickActions";
import { ProfileEdit } from "@/components/ProfileEdit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Leaf,
  Search,
  Filter,
  MapPin,
  TrendingUp,
  ShoppingCart,
  MessageCircle,
  LogOut,
  User,
  Package,
  Brain,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Footer from "@/components/Footer";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";

const SellerDashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    (searchParams.get("lang") as Language) || "en",
  );
  const { t } = useTranslation(selectedLanguage);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high" | "quantity"
  >("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(12);

  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.type !== "seller") {
      navigate("/login?type=seller");
      return;
    }

    setSeller(currentUser);
    setSelectedLanguage(currentUser.language);

    // Generate sample data if needed
    generateSampleData();
    // Migrate existing data to ensure sampleDelivery field exists
    migrateCropData();
  }, [navigate]);

  const allCrops = CropService.getAllCrops();

  // Filter and search crops
  const filteredCrops = allCrops
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

  const cropTypes = [...new Set(allCrops.map((crop) => crop.cropType))];
  const regions = [...new Set(allCrops.map((crop) => crop.farmerVillage))];

  // Helper function to convert quantity to quintals for consistent calculation
  const convertToQuintals = (quantity: number, unit: string) => {
    switch (unit) {
      case "kg":
        return quantity / 100;
      case "ton":
        return quantity * 10;
      default:
        return quantity; // already in quintals
    }
  };

  // Helper function to convert price to per quintal for consistent comparison
  const convertPriceToPerQuintal = (price: number, unit: string) => {
    switch (unit) {
      case "kg":
        return price * 100;
      case "ton":
        return price / 10;
      default:
        return price; // already per quintal
    }
  };

  // Calculate weighted average price (based on quantity available, normalized to per quintal)
  const totalValue = allCrops.reduce((sum, crop) => {
    const quantityInQuintals = convertToQuintals(crop.quantity, crop.unit);
    const pricePerQuintal = convertPriceToPerQuintal(
      crop.pricePerUnit,
      crop.unit,
    );
    return sum + pricePerQuintal * quantityInQuintals;
  }, 0);

  const totalQuantityInQuintals = allCrops.reduce((sum, crop) => {
    return sum + convertToQuintals(crop.quantity, crop.unit);
  }, 0);

  const avgPrice =
    totalQuantityInQuintals > 0 ? totalValue / totalQuantityInQuintals : 0;

  // Calculate organic percentage
  const organicCount = allCrops.filter((crop) => crop.isOrganic).length;
  const organicPercentage =
    allCrops.length > 0
      ? Math.round((organicCount / allCrops.length) * 100)
      : 0;

  // Get messaging stats
  const conversations = seller
    ? MessageService.getConversations(seller.id)
    : [];
  const unreadMessages = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0,
  );

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-800">
                  {t("app.name")}
                </h1>
                <p className="text-sm text-blue-600">
                  Welcome, {seller?.name || "Buyer"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <ProfileEdit
                user={seller}
                language={selectedLanguage}
                onProfileUpdate={(updatedUser) => {
                  setSeller(updatedUser);
                  setSelectedLanguage(updatedUser.language);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  AuthService.logout();
                  navigate("/");
                }}
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
        {/* Optimal Product Features Banner */}
        <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-white mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <CardContent className="relative pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  🎯 Get Optimal Products with AI
                </h2>
                <p className="text-blue-100 mb-4">
                  Discover the best deals, compare products, set price alerts,
                  and find exactly what you need with our smart recommendation
                  system.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    ⚡ Quick Actions
                  </Badge>
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    🧠 AI Recommendations
                  </Badge>
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    🔔 Price Alerts
                  </Badge>
                  <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    ⚖️ Product Comparison
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
              <CardTitle className="text-sm font-medium">
                Available Crops
              </CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCrops.length}</div>
              <p className="text-xs text-muted-foreground">
                From {regions.length} regions
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
                {Math.round(totalQuantityInQuintals).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">
                Quintals available
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{Math.round(avgPrice).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">
                Per quintal (weighted)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {conversations.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {unreadMessages > 0
                  ? `${unreadMessages} unread`
                  : "All caught up"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            onClick={() => navigate("/seller/messages")}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm hover:bg-blue-50 border-blue-200"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span className="text-blue-800 font-medium text-sm sm:text-base">
              Messages
            </span>
            <span className="text-xs text-blue-600 hidden sm:block">
              Chat with farmers
            </span>
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm hover:bg-green-50 border-green-200"
          >
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            <span className="text-green-800 font-medium text-sm sm:text-base">
              Refresh
            </span>
            <span className="text-xs text-green-600 hidden sm:block">
              Update listings
            </span>
          </Button>

          <Button
            onClick={() => setSearchQuery("")}
            variant="outline"
            className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm hover:bg-purple-50 border-purple-200"
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <span className="text-purple-800 font-medium text-sm sm:text-base">
              Clear Search
            </span>
            <span className="text-xs text-purple-600 hidden sm:block">
              Reset filters
            </span>
          </Button>
        </div>

        {/* Quick Actions */}
        <QuickActions crops={allCrops} language={selectedLanguage} />

        {/* Smart Recommendations */}
        <SmartRecommendations crops={allCrops} language={selectedLanguage} />

        {/* Search and Filter Bar */}
        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <CardTitle>Browse Crops</CardTitle>
                <CardDescription>
                  Find fresh produce directly from farmers
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
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

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-green-100"
                onClick={() => setSearchQuery("organic")}
              >
                Organic
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => setSearchQuery("wheat")}
              >
                Wheat
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-orange-100"
                onClick={() => setSearchQuery("rice")}
              >
                Rice
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-100"
                onClick={() => setSearchQuery("vegetables")}
              >
                Vegetables
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
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
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No crops found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or clear filters
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mr-2"
            >
              Clear Search
            </Button>
            <Button onClick={() => window.location.reload()}>
              Refresh Listings
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCrops.slice(0, displayLimit).map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                language={selectedLanguage}
                showContactButton={true}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredCrops.length > displayLimit && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDisplayLimit((prev) => prev + 12)}
            >
              <Package className="h-4 w-4 mr-2" />
              Load More Crops ({filteredCrops.length - displayLimit} remaining)
            </Button>
          </div>
        )}

        {filteredCrops.length > 0 && displayLimit >= filteredCrops.length && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              You've viewed all {filteredCrops.length} crops
            </p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-white/60 backdrop-blur-sm border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help Finding Crops?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Search & Filter</h4>
                <p className="text-sm text-gray-600">
                  Use search and filters to find exactly what you need
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Contact Farmers</h4>
                <p className="text-sm text-gray-600">
                  Chat directly with farmers to negotiate and arrange delivery
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Fresh & Direct</h4>
                <p className="text-sm text-gray-600">
                  Get fresh produce directly from farmers without middlemen
                </p>
              </div>
            </div>
          </div>
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

export default SellerDashboard;
