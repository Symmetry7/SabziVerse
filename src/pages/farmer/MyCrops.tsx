import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Farmer, Language, Crop } from "@/types";
import { AuthService } from "@/lib/auth";
import { CropService, migrateCropData } from "@/lib/storage";
import FloatingLanguageSelector from "@/components/FloatingLanguageSelector";
import { CropCard } from "@/components/CropCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Leaf, ArrowLeft, Plus, Package } from "lucide-react";

const MyCrops = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [cropToDelete, setCropToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);

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

    // Load crops for this farmer
    const myCrops = CropService.getCropsByFarmerId(farmerUser.id);
    setCrops(myCrops);
  }, [navigate]);

  const loadCrops = () => {
    if (farmer) {
      const myCrops = CropService.getCropsByFarmerId(farmer.id);
      setCrops(myCrops);
    }
  };

  const handleEdit = (crop: Crop) => {
    // Navigate to edit page with crop data
    navigate(`/farmer/crop-upload?edit=${crop.id}`, { state: { crop } });
  };

  const handleDeleteConfirm = (cropId: string) => {
    setCropToDelete(cropId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (cropToDelete) {
      try {
        CropService.deleteCrop(cropToDelete);
        loadCrops(); // Refresh the list
        toast({
          title: "Success",
          description: "Crop deleted successfully.",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete crop. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setCropToDelete(null);
  };

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading crops...</p>
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
                Back to Dashboard
              </Button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">My Crops</h1>
                <p className="text-sm text-green-600">
                  Manage your crop listings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                My Crop Listings
              </h2>
              <p className="text-gray-600">
                {crops.length} crops currently listed
              </p>
            </div>
            <Button
              onClick={() => navigate("/farmer/crop-upload")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Crop
            </Button>
          </div>

          {/* Crops Grid */}
          {crops.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No crops listed yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first crop to connect with buyers
                </p>
                <Button
                  onClick={() => navigate("/farmer/crop-upload")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Crop
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <CropCard
                  key={crop.id}
                  crop={crop}
                  language={selectedLanguage}
                  showContactButton={false}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Crop Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this crop listing? This action
              cannot be undone. All associated messages and data will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />

      {/* Floating Language Selector */}
      <FloatingLanguageSelector
        currentLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </div>
  );
};

export default MyCrops;
