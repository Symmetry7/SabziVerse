import { useState, useEffect } from "react";
import { Crop, CropType, Language } from "@/types";
import { useTranslation, cropTypes } from "@/lib/i18n";
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
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  DollarSign,
  Target,
} from "lucide-react";

interface PriceAlert {
  id: string;
  cropType: CropType;
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: string;
}

interface PriceAlertsProps {
  crops: Crop[];
  language: Language;
}

export const PriceAlerts = ({ crops, language }: PriceAlertsProps) => {
  const { t } = useTranslation(language);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState<{
    cropType: CropType | "";
    targetPrice: string;
  }>({
    cropType: "",
    targetPrice: "",
  });

  // Load alerts from localStorage on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem("sabziverse_price_alerts");
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage whenever alerts change
  useEffect(() => {
    localStorage.setItem("sabziverse_price_alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Check for triggered alerts whenever crops change
  useEffect(() => {
    if (crops.length === 0) return;

    const updatedAlerts = alerts.map((alert) => {
      if (!alert.isActive || alert.triggered) return alert;

      const relevantCrops = crops.filter((c) => c.cropType === alert.cropType);
      if (relevantCrops.length === 0) return alert;

      const avgPrice =
        relevantCrops.reduce((sum, c) => sum + c.pricePerUnit, 0) /
        relevantCrops.length;

      const minPrice = Math.min(...relevantCrops.map((c) => c.pricePerUnit));

      // Alert triggers if minimum price is at or below target
      if (minPrice <= alert.targetPrice) {
        return {
          ...alert,
          triggered: true,
          currentPrice: minPrice,
        };
      }

      return {
        ...alert,
        currentPrice: avgPrice,
      };
    });

    setAlerts(updatedAlerts);
  }, [crops, alerts]);

  const createAlert = () => {
    if (!newAlert.cropType || !newAlert.targetPrice) return;

    const relevantCrops = crops.filter((c) => c.cropType === newAlert.cropType);
    const currentPrice =
      relevantCrops.length > 0
        ? relevantCrops.reduce((sum, c) => sum + c.pricePerUnit, 0) /
          relevantCrops.length
        : 0;

    const alert: PriceAlert = {
      id: `alert_${Date.now()}`,
      cropType: newAlert.cropType as CropType,
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice,
      isActive: true,
      triggered: false,
      createdAt: new Date().toISOString(),
    };

    setAlerts((prev) => [...prev, alert]);
    setNewAlert({ cropType: "", targetPrice: "" });
  };

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert,
      ),
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, triggered: false } : alert,
      ),
    );
  };

  const activeAlerts = alerts.filter((a) => a.isActive);
  const triggeredAlerts = alerts.filter((a) => a.triggered && a.isActive);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Price Alerts</CardTitle>
              <CardDescription>
                Get notified when prices drop to your target levels
              </CardDescription>
            </div>
          </div>
          {triggeredAlerts.length > 0 && (
            <div className="mt-4">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                {triggeredAlerts.length} Alert(s) Triggered!
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Price Targets Reached!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {triggeredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium capitalize">
                        {cropTypes[language]?.[alert.cropType] ||
                          alert.cropType}
                      </p>
                      <p className="text-sm text-green-700">
                        Target: ₹{alert.targetPrice} | Current: ₹
                        {Math.round(alert.currentPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      ₹{alert.targetPrice - alert.currentPrice} saved
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Create Price Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Crop Type</Label>
              <Select
                value={newAlert.cropType}
                onValueChange={(value: CropType) =>
                  setNewAlert((prev) => ({ ...prev, cropType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
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

            <div className="space-y-2">
              <Label>Target Price (₹ per quintal)</Label>
              <Input
                type="number"
                value={newAlert.targetPrice}
                onChange={(e) =>
                  setNewAlert((prev) => ({
                    ...prev,
                    targetPrice: e.target.value,
                  }))
                }
                placeholder="2000"
              />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={createAlert}
                className="w-full"
                disabled={!newAlert.cropType || !newAlert.targetPrice}
              >
                <Bell className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </div>
          </div>

          {newAlert.cropType && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">
                  Current market price for{" "}
                  {cropTypes[language]?.[newAlert.cropType] ||
                    newAlert.cropType}
                  :{" "}
                  <strong>
                    ₹
                    {Math.round(
                      crops
                        .filter((c) => c.cropType === newAlert.cropType)
                        .reduce((sum, c) => sum + c.pricePerUnit, 0) /
                        (crops.filter((c) => c.cropType === newAlert.cropType)
                          .length || 1),
                    )}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts ({activeAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    alert.triggered
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.triggered ? "bg-green-500" : "bg-orange-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium capitalize">
                        {cropTypes[language]?.[alert.cropType] ||
                          alert.cropType}
                      </p>
                      <p className="text-sm text-gray-600">
                        Target: ₹{alert.targetPrice} | Current: ₹
                        {Math.round(alert.currentPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.currentPrice <= alert.targetPrice ? (
                      <Badge className="bg-green-100 text-green-800">
                        Target Reached!
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        ₹{Math.round(alert.currentPrice - alert.targetPrice)}{" "}
                        above
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAlert(alert.id)}
                    >
                      {alert.isActive ? "Pause" : "Resume"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {alerts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No price alerts set up yet</p>
              <p className="text-sm">
                Create alerts to get notified when prices drop to your target
                levels
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
