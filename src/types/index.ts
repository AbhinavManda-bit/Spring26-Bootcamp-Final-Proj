import type { User } from "firebase/auth";

export type Location = "Van Munching" | "McKeldin" | "Clarice";

export type Role = "buyer" | "seller";

export interface AuthContextType {
  currentUser: User | null;
  currentUserData: UserData | null;
  loading: boolean;
  signupAndLogin: (name: string, email: string, password: string, role: Role) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendResetPWEmail: (email: string) => Promise<void>;
}

export interface UserData {
  name: string;
  email: string;
  role: Role;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  size: string;
  category: string;
  location: Location;
  imageUrl: string;
  vendorId: number;
}

export interface Order {
  id: string;
  items: Product[];
  total: number;
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