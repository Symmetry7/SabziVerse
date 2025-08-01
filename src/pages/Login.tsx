import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Language, UserType } from "@/types";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf,
  ShoppingCart,
  ArrowLeft,
  LogIn,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  CreditCard,
  Shield,
} from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    (searchParams.get("lang") as Language) || "en",
  );
  const { t } = useTranslation(selectedLanguage);
  const userType = (searchParams.get("type") as UserType) || "farmer";

  const [loginMethod, setLoginMethod] = useState<"phone" | "aadhaar">("phone");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const validatePhone = () => {
    const newErrors: Record<string, string> = {};

    if (!phone.trim()) {
      newErrors.phone = t("error.required");
      setErrors(newErrors);
      return false;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const validateAadhaar = () => {
    const newErrors: Record<string, string> = {};

    if (!aadhaar.trim()) {
      newErrors.aadhaar = "Aadhaar number is required";
      setErrors(newErrors);
      return false;
    }

    const aadhaarDigits = aadhaar.replace(/\D/g, "");
    if (aadhaarDigits.length !== 12) {
      newErrors.aadhaar = "Please enter a valid 12-digit Aadhaar number";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = false;
    if (loginMethod === "phone") {
      isValid = validatePhone();
    } else {
      isValid = validateAadhaar();
    }

    if (!isValid) return;

    setIsLoggingIn(true);

    try {
      let user = null;

      if (loginMethod === "phone") {
        user = AuthService.login(phone.replace(/\D/g, ""), userType);
      } else {
        user = AuthService.loginWithAadhaar(
          aadhaar.replace(/\D/g, ""),
          userType,
        );
      }

      if (user) {
        if (userType === "farmer") {
          navigate("/farmer/dashboard");
        } else {
          navigate("/seller/dashboard");
        }
      } else {
        setErrors({
          [loginMethod]: `No account found with this ${loginMethod === "phone" ? "phone number" : "Aadhaar number"}`,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        [loginMethod]: "Login failed. Please try again.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 10) {
      return digits.replace(/(\d{5})(\d{5})/, "$1 $2");
    }
    return digits.slice(0, 10).replace(/(\d{5})(\d{5})/, "$1 $2");
  };

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleGoBack}
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
              <p className="text-sm text-green-600">{t("app.tagline")}</p>
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
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    userType === "farmer" ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  {userType === "farmer" ? (
                    <Leaf className="h-8 w-8 text-green-600" />
                  ) : (
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  )}
                </div>
              </div>
              <CardTitle className="text-2xl">
                {userType === "farmer" ? "Farmer" : "Buyer"} Login
              </CardTitle>
              <CardDescription>
                Sign in to your {userType === "farmer" ? "farmer" : "buyer"}{" "}
                account
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Login Method Tabs */}
              <Tabs
                value={loginMethod}
                onValueChange={(value: "phone" | "aadhaar") => {
                  setLoginMethod(value);
                  setErrors({});
                }}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="phone"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Phone
                  </TabsTrigger>
                  <TabsTrigger
                    value="aadhaar"
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Aadhaar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phone" className="space-y-4 mt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {errors.phone && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                          {errors.phone}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formatPhone(phone)}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="98765 43210"
                        maxLength={11}
                        className="text-lg"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className={`w-full ${
                        userType === "farmer"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      size="lg"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In with Phone
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="aadhaar" className="space-y-4 mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>Secure Aadhaar Login - Your data is protected</span>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {errors.aadhaar && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                          {errors.aadhaar}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label
                        htmlFor="aadhaar"
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Aadhaar Number
                      </Label>
                      <Input
                        id="aadhaar"
                        type="text"
                        value={formatAadhaar(aadhaar)}
                        onChange={(e) =>
                          setAadhaar(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="1234 5678 9012"
                        maxLength={14}
                        className="text-lg font-mono"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className={`w-full ${
                        userType === "farmer"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      size="lg"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Sign In with Aadhaar
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Sign Up Link */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Don't have an account?</p>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      userType === "farmer"
                        ? `/farmer/signup?lang=${selectedLanguage}`
                        : `/seller/signup?lang=${selectedLanguage}`,
                    )
                  }
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create New Account
                </Button>
              </div>
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

export default Login;
