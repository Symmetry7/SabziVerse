import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Language } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/Footer";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import { Tractor, ShoppingCart, Users, Leaf } from "lucide-react";

const UserTypeSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useTranslation(selectedLanguage);
  const navigate = useNavigate();

  const handleUserTypeSelect = (
    type: "farmer" | "seller",
    action: "signup" | "login",
  ) => {
    if (action === "login") {
      navigate(`/login?type=${type}&lang=${selectedLanguage}`);
    } else if (type === "farmer") {
      navigate(`/farmer/signup?lang=${selectedLanguage}`);
    } else {
      navigate(`/seller/signup?lang=${selectedLanguage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex justify-center sm:justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-green-800">
                {t("app.name")}
              </h1>
              <p className="text-xs sm:text-sm text-green-600">
                {t("app.tagline")}
              </p>
            </div>
          </div>
          {/* Language selector moved to floating widget */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t("user.type.title")}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12">
            {t("user.type.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
            {/* Farmer Card */}
            <Card className="border-2 border-transparent hover:border-green-300 transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Tractor className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  {t("user.type.farmer")}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t("user.type.farmer.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Upload crop details and photos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Set your own prices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Connect directly with buyers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>No middleman commission</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleUserTypeSelect("farmer", "signup")}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Create Account
                  </Button>
                  <Button
                    onClick={() => handleUserTypeSelect("farmer", "login")}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    size="lg"
                  >
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Card */}
            <Card className="border-2 border-transparent hover:border-blue-300 transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  {t("user.type.seller")}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {t("user.type.seller.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Browse crops from all over India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Filter by quality, price, location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Chat directly with farmers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Get fresh produce at best prices</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleUserTypeSelect("seller", "signup")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Create Account
                  </Button>
                  <Button
                    onClick={() => handleUserTypeSelect("seller", "login")}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    size="lg"
                  >
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-8 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                1000+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Active Farmers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                500+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Registered Buyers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                25+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Crop Varieties
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                12
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Languages</div>
            </div>
          </div>
        </div>

        {/* Quick Support Links */}
        <div className="mt-8 sm:mt-12 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
            Need Help or Information?
          </h3>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/help")}
              className="bg-white border border-gray-300 px-3 sm:px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 text-xs sm:text-sm min-h-[44px] flex items-center justify-center"
            >
              🆘 Help Center
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="bg-white border border-gray-300 px-3 sm:px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 text-xs sm:text-sm min-h-[44px] flex items-center justify-center"
            >
              📞 Contact Us
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="bg-white border border-gray-300 px-3 sm:px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 text-xs sm:text-sm min-h-[44px] flex items-center justify-center"
            >
              📋 Terms
            </button>
            <button
              onClick={() => navigate("/privacy-policy")}
              className="bg-white border border-gray-300 px-3 sm:px-4 py-2 rounded-lg shadow hover:shadow-md transition-all duration-200 text-xs sm:text-sm min-h-[44px] flex items-center justify-center"
            >
              🔒 Privacy
            </button>
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

export default UserTypeSelection;
