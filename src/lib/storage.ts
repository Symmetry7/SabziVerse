import {
  Crop,
  ChatMessage,
  FilterOptions,
  CropType,
  QualityGrade,
} from "@/types";

const CROPS_KEY = "sabziverse_crops";
const MESSAGES_KEY = "sabziverse_messages";

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export class CropService {
  static getAllCrops(): Crop[] {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage not available, using empty crops array");
        return [];
      }
      const stored = localStorage.getItem(CROPS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading crops from localStorage:", error);
      return [];
    }
  }

  static getCropsByFarmerId(farmerId: string): Crop[] {
    return this.getAllCrops().filter((crop) => crop.farmerId === farmerId);
  }

  static saveCrop(crop: Crop): void {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage not available, cannot save crop");
        return;
      }

      const crops = this.getAllCrops();
      const existingIndex = crops.findIndex((c) => c.id === crop.id);

      if (existingIndex >= 0) {
        crops[existingIndex] = crop;
      } else {
        crops.push(crop);
      }

      localStorage.setItem(CROPS_KEY, JSON.stringify(crops));
    } catch (error) {
      console.error("Error saving crop to localStorage:", error);
    }
  }

  static createCrop(data: Omit<Crop, "id" | "createdAt" | "updatedAt">): Crop {
    const id = `crop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const crop: Crop = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.saveCrop(crop);
    return crop;
  }

  static updateCrop(id: string, updates: Partial<Crop>): Crop | null {
    const crops = this.getAllCrops();
    const index = crops.findIndex((c) => c.id === id);

    if (index === -1) return null;

    const updatedCrop = {
      ...crops[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    crops[index] = updatedCrop;
    localStorage.setItem(CROPS_KEY, JSON.stringify(crops));
    return updatedCrop;
  }

  static deleteCrop(id: string): boolean {
    const crops = this.getAllCrops();
    const filteredCrops = crops.filter((c) => c.id !== id);

    if (filteredCrops.length !== crops.length) {
      localStorage.setItem(CROPS_KEY, JSON.stringify(filteredCrops));
      return true;
    }

    return false;
  }

  static filterCrops(filters: FilterOptions): Crop[] {
    const crops = this.getAllCrops();

    return crops.filter((crop) => {
      // Filter by crop type
      if (filters.cropType && filters.cropType.length > 0) {
        if (!filters.cropType.includes(crop.cropType)) return false;
      }

      // Filter by price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (crop.pricePerUnit < min || crop.pricePerUnit > max) return false;
      }

      // Filter by regions (villages)
      if (filters.regions && filters.regions.length > 0) {
        if (
          !filters.regions.some((region) =>
            crop.farmerVillage.toLowerCase().includes(region.toLowerCase()),
          )
        )
          return false;
      }

      // Filter by quality
      if (filters.quality && filters.quality.length > 0) {
        if (!filters.quality.includes(crop.quality)) return false;
      }

      // Filter by organic
      if (filters.isOrganic !== undefined) {
        if (crop.isOrganic !== filters.isOrganic) return false;
      }

      // Filter by availability dates
      const now = new Date();
      const availableFrom = new Date(crop.availableFrom);
      const availableUntil = new Date(crop.availableUntil);

      if (filters.availableFrom) {
        const filterFrom = new Date(filters.availableFrom);
        if (availableFrom < filterFrom) return false;
      }

      if (filters.availableUntil) {
        const filterUntil = new Date(filters.availableUntil);
        if (availableUntil > filterUntil) return false;
      }

      // Check if crop is currently available
      if (now < availableFrom || now > availableUntil) return false;

      return true;
    });
  }

  static searchCrops(query: string): Crop[] {
    const crops = this.getAllCrops();
    const searchTerm = query.toLowerCase();

    return crops.filter(
      (crop) =>
        crop.cropType.toLowerCase().includes(searchTerm) ||
        crop.variety?.toLowerCase().includes(searchTerm) ||
        crop.description.toLowerCase().includes(searchTerm) ||
        crop.farmerName.toLowerCase().includes(searchTerm) ||
        crop.farmerVillage.toLowerCase().includes(searchTerm),
    );
  }
}

export class MessageService {
  static getAllMessages(): ChatMessage[] {
    try {
      const stored = localStorage.getItem(MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveMessage(message: ChatMessage): void {
    const messages = this.getAllMessages();
    messages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }

  static createMessage(data: {
    senderId: string;
    receiverId: string;
    cropId?: string;
    message: string;
    messageType?: "text" | "image";
    imageUrl?: string;
  }): ChatMessage {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const message: ChatMessage = {
      id,
      ...data,
      messageType: data.messageType || "text",
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    this.saveMessage(message);
    return message;
  }

  static getConversations(userId: string): Array<{
    otherUserId: string;
    otherUserName: string;
    lastMessage: ChatMessage;
    unreadCount: number;
  }> {
    const messages = this.getAllMessages();
    const userMessages = messages.filter(
      (msg) => msg.senderId === userId || msg.receiverId === userId,
    );

    const conversationMap = new Map<
      string,
      {
        otherUserId: string;
        messages: ChatMessage[];
      }
    >();

    userMessages.forEach((msg) => {
      const otherUserId =
        msg.senderId === userId ? msg.receiverId : msg.senderId;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          otherUserId,
          messages: [],
        });
      }

      conversationMap.get(otherUserId)!.messages.push(msg);
    });

    return Array.from(conversationMap.entries())
      .map(([otherUserId, data]) => {
        const sortedMessages = data.messages.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        const unreadCount = data.messages.filter(
          (msg) => msg.receiverId === userId && !msg.isRead,
        ).length;

        return {
          otherUserId,
          otherUserName: "User", // This would be fetched from user data
          lastMessage: sortedMessages[0],
          unreadCount,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime(),
      );
  }

  static getConversationMessages(
    userId: string,
    otherUserId: string,
  ): ChatMessage[] {
    const messages = this.getAllMessages();
    return messages
      .filter(
        (msg) =>
          (msg.senderId === userId && msg.receiverId === otherUserId) ||
          (msg.senderId === otherUserId && msg.receiverId === userId),
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
  }

  static markMessagesAsRead(userId: string, otherUserId: string): void {
    const messages = this.getAllMessages();
    const updatedMessages = messages.map((msg) => {
      if (
        msg.senderId === otherUserId &&
        msg.receiverId === userId &&
        !msg.isRead
      ) {
        return { ...msg, isRead: true };
      }
      return msg;
    });

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
  }
}

// Data migration utility to ensure all crops have sampleDelivery field
export const migrateCropData = () => {
  const crops = CropService.getAllCrops();
  let hasChanges = false;

  const updatedCrops = crops.map((crop) => {
    if (!crop.sampleDelivery) {
      hasChanges = true;
      return {
        ...crop,
        sampleDelivery: {
          available: false,
          sampleSize: "",
          deliveryDays: 0,
          samplePrice: 0,
        },
      };
    }
    return crop;
  });

  if (hasChanges) {
    localStorage.setItem(CROPS_KEY, JSON.stringify(updatedCrops));
  }
};

// Sample data generator for demo purposes
export const generateSampleData = () => {
  const sampleCrops: Crop[] = [
    {
      id: "crop1",
      farmerId: "farmer1",
      farmerName: "Rajesh Kumar",
      farmerVillage: "Mandawar, Haryana",
      farmerPhone: "+91 9876543210",
      cropType: "wheat",
      variety: "HD-2967",
      quantity: 50,
      unit: "quintal",
      pricePerUnit: 2200,
      quality: "premium",
      description:
        "High quality wheat, properly dried and stored. Perfect for flour making.",
      images: ["/placeholder.svg"],
      harvestDate: "2024-04-15",
      availableFrom: "2024-04-20",
      availableUntil: "2024-08-20",
      isOrganic: false,
      sampleDelivery: {
        available: true,
        sampleSize: "1 kg",
        deliveryDays: 3,
        samplePrice: 50,
      },
      createdAt: "2024-04-20T10:00:00Z",
      updatedAt: "2024-04-20T10:00:00Z",
    },
    {
      id: "crop2",
      farmerId: "farmer2",
      farmerName: "Priya Sharma",
      farmerVillage: "Nashik, Maharashtra",
      farmerPhone: "+91 9876543211",
      cropType: "onion",
      variety: "Pusa Red",
      quantity: 20,
      unit: "quintal",
      pricePerUnit: 1800,
      quality: "good",
      description:
        "Fresh red onions, medium size, good for storage and cooking.",
      images: ["/placeholder.svg"],
      harvestDate: "2024-03-10",
      availableFrom: "2024-03-15",
      availableUntil: "2024-06-15",
      isOrganic: true,
      sampleDelivery: {
        available: true,
        sampleSize: "500g",
        deliveryDays: 2,
        samplePrice: 30,
      },
      createdAt: "2024-03-15T10:00:00Z",
      updatedAt: "2024-03-15T10:00:00Z",
    },
    {
      id: "crop3",
      farmerId: "farmer3",
      farmerName: "Suresh Patel",
      farmerVillage: "Anand, Gujarat",
      farmerPhone: "+91 9876543212",
      cropType: "potato",
      variety: "Kufri Jyoti",
      quantity: 100,
      unit: "quintal",
      pricePerUnit: 1200,
      quality: "standard",
      description: "Fresh potatoes, ideal size for various cooking purposes.",
      images: ["/placeholder.svg"],
      harvestDate: "2024-02-25",
      availableFrom: "2024-03-01",
      availableUntil: "2024-05-01",
      isOrganic: false,
      sampleDelivery: {
        available: false,
        sampleSize: "",
        deliveryDays: 0,
        samplePrice: 0,
      },
      createdAt: "2024-03-01T10:00:00Z",
      updatedAt: "2024-03-01T10:00:00Z",
    },
  ];

  const existingCrops = CropService.getAllCrops();
  if (existingCrops.length === 0) {
    sampleCrops.forEach((crop) => CropService.saveCrop(crop));
  }
};
