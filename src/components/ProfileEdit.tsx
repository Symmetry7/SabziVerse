import React, { useState } from "react";
import { User, Language } from "@/types";
import { useTranslation } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Edit,
  Save,
  X,
  Check,
  AlertCircle,
  Phone,
  CreditCard,
  MapPin,
  Globe,
} from "lucide-react";

interface ProfileEditProps {
  user: User;
  language: Language;
  onProfileUpdate: (updatedUser: User) => void;
}

export const ProfileEdit = ({
  user,
  language,
  onProfileUpdate,
}: ProfileEditProps) => {
  const { t } = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    village: user.village || "",
    language: user.language,
    aadhaarCard: (user as any).aadhaarCard || "",
    businessName: (user as any).businessName || "",
    location: (user as any).location || "",
  });

  const languages = {
    en: "English",
    hi: "हिंदी",
    bn: "বাংলা",
    ta: "தமிழ்",
    te: "తెలుగు",
    mr: "मराठी",
    gu: "ગુજરાતી",
    kn: "ಕನ್ನಡ",
    ml: "മലയാളം",
    or: "ଓଡ଼ିଆ",
    pa: "ਪੰਜਾਬੀ",
    as: "অসমীয়া",
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (
      formData.aadhaarCard &&
      !/^[0-9]{12}$/.test(formData.aadhaarCard.replace(/\D/g, ""))
    ) {
      setError("Aadhaar card must be 12 digits");
      return false;
    }
    if (user.type === "farmer" && !formData.village.trim()) {
      setError("Village is required for farmers");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create updated user object
      const updatedUser: User = {
        ...user,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        language: formData.language as Language,
        ...(user.type === "farmer" && { village: formData.village.trim() }),
        ...(formData.aadhaarCard && {
          aadhaarCard: formData.aadhaarCard.trim(),
        }),
        ...(user.type === "seller" && {
          businessName: formData.businessName.trim(),
          location: formData.location.trim(),
        }),
      };

      // Update in auth service
      const success = AuthService.updateProfile(updatedUser);

      if (success) {
        setSuccess(true);
        onProfileUpdate(updatedUser);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
        }, 2000);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 10) {
      return digits.replace(/(\d{5})(\d{5})/, "$1 $2");
    }
    return digits.slice(0, 10).replace(/(\d{5})(\d{5})/, "$1 $2");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Type Badge */}
          <div className="flex items-center justify-center">
            <Badge
              className={
                user.type === "farmer"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }
            >
              {user.type === "farmer" ? "🌾 Farmer" : "🛒 Seller/Buyer"}
            </Badge>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              value={formatPhone(formData.phone)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: e.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder="98765 43210"
              maxLength={11}
              required
            />
          </div>

          {/* Aadhaar Card */}
          <div className="space-y-2">
            <Label htmlFor="aadhaar" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Aadhaar Card Number
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            </Label>
            <Input
              id="aadhaar"
              value={formatAadhaar(formData.aadhaarCard)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  aadhaarCard: e.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder="1234 5678 9012"
              maxLength={14}
            />
            <p className="text-xs text-gray-500">
              Adding Aadhaar enables faster login and verification
            </p>
          </div>

          {/* Farmer-specific fields */}
          {user.type === "farmer" && (
            <div className="space-y-2">
              <Label htmlFor="village" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Village/Location *
              </Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, village: e.target.value }))
                }
                placeholder="Village, District, State"
                required
              />
            </div>
          )}

          {/* Seller-specific fields */}
          {user.type === "seller" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="business">Business Name</Label>
                <Input
                  id="business"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessName: e.target.value,
                    }))
                  }
                  placeholder="Your business name (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="City, State"
                />
              </div>
            </>
          )}

          {/* Language */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Preferred Language
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value: Language) =>
                setFormData((prev) => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
