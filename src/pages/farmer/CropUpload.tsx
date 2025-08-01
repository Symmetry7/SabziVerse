import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Farmer, Language, CropType, QualityGrade, Crop } from "@/types";
import { useTranslation, cropTypes } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import { CropService } from "@/lib/storage";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Upload,
  Camera,
  Calendar,
  Package,
} from "lucide-react";

const CropUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const { t } = useTranslation(selectedLanguage);

  // Check if we're editing
  const editId = searchParams.get("edit");
  const isEditing = !!editId;
  const editCrop = location.state?.crop as Crop;

  const [formData, setFormData] = useState({
    cropType: "" as CropType | "",
    variety: "",
    quantity: "",
    unit: "quintal" as "kg" | "quintal" | "ton",
    pricePerUnit: "",
    quality: "" as QualityGrade | "",
    description: "",
    harvestDate: "",
    availableFrom: "",
    availableUntil: "",
    isOrganic: false,
    images: [] as string[],
    sampleDelivery: {
      available: false,
      sampleSize: "",
      deliveryDays: 3,
      samplePrice: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || currentUser.type !== "farmer") {
      navigate("/");
      return;
    }

    const farmerUser = currentUser as Farmer;
    setFarmer(farmerUser);
    setSelectedLanguage(farmerUser.language);

    // If editing, load existing crop data
    if (isEditing && editCrop) {
      setFormData({
        cropType: editCrop.cropType,
        variety: editCrop.variety || "",
        quantity: editCrop.quantity.toString(),
        unit: editCrop.unit,
        pricePerUnit: editCrop.pricePerUnit.toString(),
        quality: editCrop.quality,
        description: editCrop.description,
        harvestDate: editCrop.harvestDate.split("T")[0], // Format for input[type="date"]
        availableFrom: editCrop.availableFrom?.split("T")[0] || "",
        availableUntil: editCrop.availableUntil.split("T")[0],
        isOrganic: editCrop.isOrganic,
        images: editCrop.images || [],
        sampleDelivery: editCrop.sampleDelivery || {
          available: false,
          sampleSize: "",
          deliveryDays: 3,
          samplePrice: "",
        },
      });
    } else {
      // Set default dates for new crops
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      setFormData((prev) => ({
        ...prev,
        availableFrom: today.toISOString().split("T")[0],
        availableUntil: nextMonth.toISOString().split("T")[0],
      }));
    }
  }, [navigate, isEditing, editCrop]);

  const cropTypeOptions: CropType[] = [
    "wheat",
    "rice",
    "sugarcane",
    "cotton",
    "maize",
    "barley",
    "bajra",
    "jowar",
    "potato",
    "onion",
    "tomato",
    "cabbage",
    "cauliflower",
    "carrot",
    "peas",
    "mango",
    "banana",
    "apple",
    "grapes",
    "orange",
    "pomegranate",
    "turmeric",
    "coriander",
    "cumin",
    "fenugreek",
    "mustard",
  ];

  const qualityOptions: QualityGrade[] = ["premium", "good", "standard"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cropType) {
      newErrors.cropType = t("error.required");
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = t("error.quantity.invalid");
    }

    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = t("error.price.invalid");
    }

    if (!formData.quality) {
      newErrors.quality = t("error.required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("error.required");
    }

    if (!formData.harvestDate) {
      newErrors.harvestDate = t("error.date.invalid");
    }

    if (!formData.availableFrom) {
      newErrors.availableFrom = t("error.date.invalid");
    }

    if (!formData.availableUntil) {
      newErrors.availableUntil = t("error.date.invalid");
    }

    if (
      formData.availableFrom &&
      formData.availableUntil &&
      new Date(formData.availableFrom) >= new Date(formData.availableUntil)
    ) {
      newErrors.availableUntil = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !farmer) return;

    setIsSubmitting(true);

    try {
      const cropData = {
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmerVillage: farmer.village,
        farmerPhone: farmer.phone,
        cropType: formData.cropType as CropType,
        variety: formData.variety || undefined,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        quality: formData.quality as QualityGrade,
        description: formData.description.trim(),
        images:
          formData.images.length > 0 ? formData.images : ["/placeholder.svg"],
        harvestDate: formData.harvestDate,
        availableFrom: formData.availableFrom,
        availableUntil: formData.availableUntil,
        isOrganic: formData.isOrganic,
        sampleDelivery: {
          available: formData.sampleDelivery.available,
          sampleSize: formData.sampleDelivery.sampleSize,
          deliveryDays: formData.sampleDelivery.deliveryDays,
          samplePrice: parseFloat(formData.sampleDelivery.samplePrice) || 0,
        },
      };

      if (isEditing && editId) {
        // Update existing crop
        CropService.updateCrop(editId, cropData);
        navigate("/farmer/my-crops?success=crop-updated");
      } else {
        // Create new crop
        CropService.createCrop(cropData);
        navigate("/farmer/dashboard?success=crop-added");
      }
    } catch (error) {
      console.error("Error saving crop:", error);
      setErrors({
        submit: `Failed to ${isEditing ? "update" : "create"} crop listing. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

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
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">
                  {isEditing ? "Edit Crop" : "Upload New Crop"}
                </h1>
                <p className="text-sm text-green-600">
                  {isEditing
                    ? "Update your crop listing"
                    : "Add your crop to the marketplace"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Upload className="h-6 w-6" />
                {isEditing ? "Edit Crop Details" : t("crop.upload.title")}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update the details of your crop listing"
                  : t("crop.upload.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                  <Alert>
                    <AlertDescription>{errors.submit}</AlertDescription>
                  </Alert>
                )}

                {/* Crop Type */}
                <div className="space-y-2">
                  <Label htmlFor="cropType">{t("crop.type")}</Label>
                  <Select
                    value={formData.cropType}
                    onValueChange={(value: CropType) =>
                      handleInputChange("cropType", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.cropType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypeOptions.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {cropTypes[selectedLanguage]?.[crop] || crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cropType && (
                    <p className="text-sm text-red-600">{errors.cropType}</p>
                  )}
                </div>

                {/* Variety */}
                <div className="space-y-2">
                  <Label htmlFor="variety">{t("crop.variety")}</Label>
                  <Input
                    id="variety"
                    value={formData.variety}
                    onChange={(e) =>
                      handleInputChange("variety", e.target.value)
                    }
                    placeholder="e.g., Basmati, Durum"
                  />
                </div>

                {/* Quantity and Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t("crop.quantity")}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                      placeholder="100"
                      className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-red-600">{errors.quantity}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">{t("crop.unit")}</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value: "kg" | "quintal" | "ton") =>
                        handleInputChange("unit", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="quintal">Quintal</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {t("crop.price")} (₹ per {formData.unit})
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.pricePerUnit}
                    onChange={(e) =>
                      handleInputChange("pricePerUnit", e.target.value)
                    }
                    placeholder="2200"
                    className={errors.pricePerUnit ? "border-red-500" : ""}
                  />
                  {errors.pricePerUnit && (
                    <p className="text-sm text-red-600">
                      {errors.pricePerUnit}
                    </p>
                  )}
                </div>

                {/* Quality */}
                <div className="space-y-2">
                  <Label htmlFor="quality">{t("crop.quality")}</Label>
                  <Select
                    value={formData.quality}
                    onValueChange={(value: QualityGrade) =>
                      handleInputChange("quality", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.quality ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {t(`quality.${quality}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.quality && (
                    <p className="text-sm text-red-600">{errors.quality}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">{t("crop.description")}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe your crop quality, storage conditions, etc."
                    rows={3}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="harvestDate">
                      {t("crop.harvest.date")}
                    </Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      value={formData.harvestDate}
                      onChange={(e) =>
                        handleInputChange("harvestDate", e.target.value)
                      }
                      className={errors.harvestDate ? "border-red-500" : ""}
                    />
                    {errors.harvestDate && (
                      <p className="text-sm text-red-600">
                        {errors.harvestDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">
                      {t("crop.available.from")}
                    </Label>
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) =>
                        handleInputChange("availableFrom", e.target.value)
                      }
                      className={errors.availableFrom ? "border-red-500" : ""}
                    />
                    {errors.availableFrom && (
                      <p className="text-sm text-red-600">
                        {errors.availableFrom}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableUntil">
                      {t("crop.available.until")}
                    </Label>
                    <Input
                      id="availableUntil"
                      type="date"
                      value={formData.availableUntil}
                      onChange={(e) =>
                        handleInputChange("availableUntil", e.target.value)
                      }
                      className={errors.availableUntil ? "border-red-500" : ""}
                    />
                    {errors.availableUntil && (
                      <p className="text-sm text-red-600">
                        {errors.availableUntil}
                      </p>
                    )}
                  </div>
                </div>

                {/* Organic */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="organic"
                      checked={formData.isOrganic}
                      onCheckedChange={(checked) =>
                        handleInputChange("isOrganic", !!checked)
                      }
                    />
                    <Label
                      htmlFor="organic"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("crop.organic")}
                    </Label>
                  </div>
                </div>

                {/* Sample Delivery */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sampleDelivery"
                      checked={formData.sampleDelivery.available}
                      onCheckedChange={(checked) =>
                        handleInputChange("sampleDelivery", {
                          ...formData.sampleDelivery,
                          available: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="sampleDelivery" className="font-medium">
                      Offer Sample Delivery
                    </Label>
                  </div>

                  {formData.sampleDelivery.available && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                      <div className="space-y-2">
                        <Label
                          htmlFor="sampleSize"
                          className="text-sm text-green-700"
                        >
                          Sample Size
                        </Label>
                        <Input
                          id="sampleSize"
                          value={formData.sampleDelivery.sampleSize}
                          onChange={(e) =>
                            handleInputChange("sampleDelivery", {
                              ...formData.sampleDelivery,
                              sampleSize: e.target.value,
                            })
                          }
                          placeholder="1 kg"
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="deliveryDays"
                          className="text-sm text-green-700"
                        >
                          Delivery Time
                        </Label>
                        <Select
                          value={formData.sampleDelivery.deliveryDays.toString()}
                          onValueChange={(value) =>
                            handleInputChange("sampleDelivery", {
                              ...formData.sampleDelivery,
                              deliveryDays: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="2">2 Days</SelectItem>
                            <SelectItem value="3">3 Days</SelectItem>
                            <SelectItem value="5">5 Days</SelectItem>
                            <SelectItem value="7">1 Week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="samplePrice"
                          className="text-sm text-green-700"
                        >
                          Sample Price (₹)
                        </Label>
                        <Input
                          id="samplePrice"
                          type="number"
                          value={formData.sampleDelivery.samplePrice}
                          onChange={(e) =>
                            handleInputChange("sampleDelivery", {
                              ...formData.sampleDelivery,
                              samplePrice: e.target.value,
                            })
                          }
                          placeholder="100"
                          className="bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Upload Placeholder */}
                <div className="space-y-2">
                  <Label>{t("crop.images")}</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload photos of your crop
                    </p>
                    <p className="text-xs text-gray-500">
                      (Image upload feature coming soon)
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating Listing..."
                    : isEditing
                      ? "Update Crop"
                      : t("crop.upload.submit")}
                </Button>
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

export default CropUpload;
