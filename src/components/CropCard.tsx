import { useState } from "react";
import { Crop, Language } from "@/types";
import { useTranslation, cropTypes } from "@/lib/i18n";
import { AuthService } from "@/lib/auth";
import { MessageService } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Leaf,
  MapPin,
  Calendar,
  Package,
  Phone,
  MessageCircle,
  Star,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CropCardProps {
  crop: Crop;
  language: Language;
  showContactButton?: boolean;
  onEdit?: (crop: Crop) => void;
  onDelete?: (cropId: string) => void;
  className?: string;
}

export const CropCard = ({
  crop,
  language,
  showContactButton = true,
  onEdit,
  onDelete,
  className,
}: CropCardProps) => {
  const { t } = useTranslation(language);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const currentUser = AuthService.getCurrentUser();
  const isOwnCrop = currentUser?.id === crop.farmerId;
  const canContact = currentUser && !isOwnCrop && showContactButton;

  const getCropName = (cropType: string) => {
    return cropTypes[language]?.[cropType] || cropType;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "premium":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    setIsSending(true);
    try {
      MessageService.createMessage({
        senderId: currentUser.id,
        receiverId: crop.farmerId,
        cropId: crop.id,
        message: message.trim(),
      });

      setMessage("");
      setIsContactOpen(false);
      // You could show a success toast here
    } catch (error) {
      console.error("Error sending message:", error);
      // You could show an error toast here
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        language === "hi" ? "hi-IN" : "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      );
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      className={cn(
        "bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300",
        className,
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg capitalize">
                {getCropName(crop.cropType)}
              </CardTitle>
              {crop.variety && (
                <CardDescription className="text-sm text-gray-600">
                  {crop.variety}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getQualityColor(crop.quality)}>
              {t(`quality.${crop.quality}`)}
            </Badge>
            {crop.isOrganic && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                <Leaf className="h-3 w-3 mr-1" />
                Organic
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price and Quantity */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                ₹{crop.pricePerUnit.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-600">per {crop.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {crop.quantity} {crop.unit}
              </p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {crop.description && (
          <div>
            <p className="text-sm text-gray-700 line-clamp-3">
              {crop.description}
            </p>
          </div>
        )}

        {/* Farmer Info */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-200 text-blue-800">
              {crop.farmerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{crop.farmerName}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{crop.farmerVillage}</span>
            </div>
          </div>
        </div>

        {/* Dates and Sample Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <div>
              <p className="font-medium">Harvested</p>
              <p>{formatDate(crop.harvestDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="h-4 w-4" />
            <div>
              <p className="font-medium">Available Until</p>
              <p>{formatDate(crop.availableUntil)}</p>
            </div>
          </div>
        </div>

        {/* Sample Delivery Info */}
        {crop.sampleDelivery?.available && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                Sample Available
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-green-700">
              <div>
                <p className="font-medium">Size</p>
                <p>{crop.sampleDelivery?.sampleSize}</p>
              </div>
              <div>
                <p className="font-medium">Delivery</p>
                <p>{crop.sampleDelivery?.deliveryDays} days</p>
              </div>
              <div>
                <p className="font-medium">Price</p>
                <p>₹{crop.sampleDelivery?.samplePrice}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          {isOwnCrop ? (
            <>
              {onEdit && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onEdit(crop)}
                >
                  {t("edit")}
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => onDelete(crop.id)}
                >
                  {t("delete")}
                </Button>
              )}
            </>
          ) : (
            canContact && (
              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t("contact.farmer")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("chat.with.farmer")}</DialogTitle>
                    <DialogDescription>
                      Send a message to {crop.farmerName} about their{" "}
                      {getCropName(crop.cropType)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">
                        {getCropName(crop.cropType)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{crop.pricePerUnit}/{crop.unit} • {crop.quantity}{" "}
                        {crop.unit} available
                      </p>
                    </div>
                    <Textarea
                      placeholder={t("type.message")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsContactOpen(false)}
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSending}
                      >
                        {isSending ? "Sending..." : t("send.message")}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
