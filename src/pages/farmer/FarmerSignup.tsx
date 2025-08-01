import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Language } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Leaf,
  ArrowLeft,
  UserPlus,
  MapPin,
  Phone,
  CreditCard,
  Sparkles,
} from "lucide-react";

const FarmerSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    (searchParams.get("lang") as Language) || "en",
  );
  const { t } = useTranslation(selectedLanguage);

  const [formData, setFormData] = useState({
    name: "",
    village: "",
    phone: "",
    language: selectedLanguage,
    aadhaarCard: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, language: selectedLanguage }));
  }, [selectedLanguage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("error.required");
    }

    if (!formData.village.trim()) {
      newErrors.village = t("error.required");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("error.required");
    } else if (!/^[\+]?[1-9][\d]{9,14}$/.test(formData.phone)) {
      newErrors.phone = t("error.phone.invalid");
    }

    // Validate Aadhaar if provided
    if (formData.aadhaarCard) {
      const aadhaarDigits = formData.aadhaarCard.replace(/\D/g, "");
      if (aadhaarDigits.length !== 12) {
        newErrors.aadhaarCard = "Aadhaar must be 12 digits";
      } else if (AuthService.isAadhaarRegistered(aadhaarDigits)) {
        newErrors.aadhaarCard = "This Aadhaar number is already registered";
      }
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the Terms and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check if user already exists
      if (AuthService.isPhoneRegistered(formData.phone)) {
        setErrors({ phone: "A user with this phone number already exists" });
        setIsSubmitting(false);
        return;
      }

      // Create farmer account
      AuthService.createFarmer({
        name: formData.name.trim(),
        village: formData.village.trim(),
        phone: formData.phone.trim(),
        language: selectedLanguage,
        ...(formData.aadhaarCard && {
          aadhaarCard: formData.aadhaarCard.trim(),
        }),
      });

      // Redirect to farmer dashboard
      navigate("/farmer/dashboard");
    } catch (error) {
      console.error("Error creating farmer account:", error);
      setErrors({
        submit: "Failed to create account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">
                  {t("app.name")}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Create Farmer Account</CardTitle>
              <CardDescription>
                Join thousands of farmers selling directly to buyers
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.submit && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {errors.submit}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-white"
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Village Field */}
                <div className="space-y-2">
                  <Label htmlFor="village" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Village/Location *
                  </Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) =>
                      handleInputChange("village", e.target.value)
                    }
                    placeholder="Village, District, State"
                    className="bg-white"
                    required
                  />
                  {errors.village && (
                    <p className="text-sm text-red-600">{errors.village}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="bg-white"
                    required
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Aadhaar Field */}
                <div className="space-y-2">
                  <Label htmlFor="aadhaar" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Aadhaar Card Number
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    value={formData.aadhaarCard.replace(
                      /(\d{4})(?=\d)/g,
                      "$1 ",
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        "aadhaarCard",
                        e.target.value.replace(/\D/g, "").slice(0, 12),
                      )
                    }
                    placeholder="1234 5678 9012"
                    className="bg-white font-mono"
                    maxLength={14}
                  />
                  {errors.aadhaarCard && (
                    <p className="text-sm text-red-600">{errors.aadhaarCard}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Add Aadhaar for faster login and verification
                  </p>
                </div>

                {/* Language Field */}
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={(value: Language) => {
                      setSelectedLanguage(value);
                      handleInputChange("language", value);
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="bn">বাংলা</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                      <SelectItem value="te">తెలుగు</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                      <SelectItem value="gu">ગુજરાતી</SelectItem>
                      <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                      <SelectItem value="ml">മലയാളം</SelectItem>
                      <SelectItem value="or">ଓଡ଼ିଆ</SelectItem>
                      <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                      <SelectItem value="as">অসমীয়া</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, acceptTerms: !!checked })
                      }
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      I accept the{" "}
                      <button
                        type="button"
                        onClick={() => window.open("/terms", "_blank")}
                        className="text-green-600 font-medium underline hover:text-green-700"
                      >
                        Terms
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => window.open("/privacy-policy", "_blank")}
                        className="text-green-600 font-medium underline hover:text-green-700"
                      >
                        Privacy Policy
                      </button>
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-600">{errors.acceptTerms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Farmer Account
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/login?type=farmer&lang=${selectedLanguage}`)
                      }
                      className="text-green-600 font-medium hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Language Selector */}
      <FloatingLanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </div>
  );
};

export default FarmerSignup;
