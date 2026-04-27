import type { User } from "firebase/auth";

export type Location = "Van Munching" | "McKeldin" | "Clarice" | "";
export type Gender = "Men" | "Women" | "Unisex" | "";
export type Category = "Tops" | "Bottoms" | "Accessories" | "";
export type Size = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "";

export type Role = "buyer" | "seller";

export interface AuthContextType {
  currentUser: User | null;
  currentUserData: UserData | null;
  loading: boolean;
  signupAndLogin: (
    name: string,
    email: string,
    password: string,
    role: Role,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendResetPWEmail: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export interface UserData {
  name: string;
  email: string;
  role: Role;
  // fields to add when user saves profile info
  bio?: string;
  favStyle?: string;
  profilePicture?: string;
  productsAttemptedToUpload?: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  size: Size;
  category: Category;
  gender: Gender;
  location: Location;
  imageUrl: string;
  sellerId: string;
  sold: boolean;
  editByDefault?: boolean;
}

export interface Order {
  id: string;
  buyerId: string;
  items: string[]; //array of product id's in an order
}

export interface CartContextType {
  items: string[] | null; //array of product ID's
  loadingCart: boolean;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  calcTotalPrice: () => Promise<number>;
}

export interface CartData {
  items: string[];
}

export interface SellerStats {
  totalRevenue: number;
  totalProductsSold: number;
}
