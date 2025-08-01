export type UserType = "farmer" | "seller";

export type Language =
  | "en"
  | "hi"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "or"
  | "pa"
  | "as";

export interface User {
  id: string;
  name: string;
  type: UserType;
  phone: string;
  village?: string;
  language: Language;
  createdAt: string;
}

export interface Farmer extends User {
  type: "farmer";
  village: string;
}

export interface Seller extends User {
  type: "seller";
  businessName?: string;
  location?: string;
}

export type CropType =
  | "wheat"
  | "rice"
  | "sugarcane"
  | "cotton"
  | "maize"
  | "barley"
  | "bajra"
  | "jowar"
  | "potato"
  | "onion"
  | "tomato"
  | "cabbage"
  | "cauliflower"
  | "carrot"
  | "peas"
  | "mango"
  | "banana"
  | "apple"
  | "grapes"
  | "orange"
  | "pomegranate"
  | "turmeric"
  | "coriander"
  | "cumin"
  | "fenugreek"
  | "mustard";

export type QualityGrade = "premium" | "good" | "standard";

export interface Crop {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerPhone: string;
  cropType: CropType;
  variety?: string;
  quantity: number;
  unit: "kg" | "quintal" | "ton";
  pricePerUnit: number;
  quality: QualityGrade;
  description: string;
  images: string[];
  harvestDate: string;
  availableFrom: string;
  availableUntil: string;
  isOrganic: boolean;
  sampleDelivery: {
    available: boolean;
    sampleSize: string;
    deliveryDays: number;
    samplePrice: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  cropId?: string;
  message: string;
  messageType: "text" | "image";
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface FilterOptions {
  cropType?: CropType[];
  priceRange?: [number, number];
  regions?: string[];
  quality?: QualityGrade[];
  isOrganic?: boolean;
  availableFrom?: string;
  availableUntil?: string;
}
