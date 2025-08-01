import { User, Farmer, Seller, UserType, Language } from "@/types";

const STORAGE_KEY = "sabziverse_current_user";
const USERS_KEY = "sabziverse_users";

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

export class AuthService {
  private static readonly STORAGE_KEY = "sabziverse_current_user";
  private static readonly USERS_KEY = "sabziverse_users";

  // Get all registered users
  private static getAllUsers(): User[] {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage not available, using empty users array");
        return [];
      }
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error reading users from localStorage:", error);
      return [];
    }
  }

  // Save user to storage
  private static saveUser(user: User): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);

    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Update user profile
  static updateProfile(updatedUser: User): boolean {
    try {
      // Update in users storage
      this.saveUser(updatedUser);

      // Update current user session if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
      }

      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      return false;
    }
  }

  static createFarmer(data: {
    name: string;
    village: string;
    phone: string;
    language: Language;
    aadhaarCard?: string;
  }): Farmer {
    const id = `farmer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const farmer: Farmer = {
      id,
      name: data.name,
      type: "farmer",
      phone: data.phone,
      village: data.village,
      language: data.language,
      createdAt: new Date().toISOString(),
      ...(data.aadhaarCard && { aadhaarCard: data.aadhaarCard }),
    };

    this.saveUser(farmer);
    return farmer;
  }

  static createSeller(data: {
    name: string;
    phone: string;
    language: Language;
    businessName?: string;
    location?: string;
    aadhaarCard?: string;
  }): Seller {
    const id = `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const seller: Seller = {
      id,
      name: data.name,
      type: "seller",
      phone: data.phone,
      language: data.language,
      businessName: data.businessName,
      location: data.location,
      createdAt: new Date().toISOString(),
      ...(data.aadhaarCard && { aadhaarCard: data.aadhaarCard }),
    };

    this.saveUser(seller);
    return seller;
  }

  // Login user with phone
  static login(phone: string, userType: UserType): User | null {
    const users = this.getAllUsers();
    const user = users.find((u) => u.phone === phone && u.type === userType);

    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    return null;
  }

  // Login user with Aadhaar
  static loginWithAadhaar(aadhaar: string, userType: UserType): User | null {
    const users = this.getAllUsers();
    const user = users.find(
      (u) => (u as any).aadhaarCard === aadhaar && u.type === userType,
    );

    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    return null;
  }

  // Check if Aadhaar is already registered
  static isAadhaarRegistered(aadhaar: string): boolean {
    const users = this.getAllUsers();
    return users.some((u) => (u as any).aadhaarCard === aadhaar);
  }

  // Check if phone is already registered
  static isPhoneRegistered(phone: string): boolean {
    const users = this.getAllUsers();
    return users.some((u) => u.phone === phone);
  }

  // Get current user
  static getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem(this.STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  // Logout
  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
