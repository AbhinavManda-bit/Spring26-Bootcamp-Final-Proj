import type { User } from "firebase/auth";

export type Location = "Van Munching" | "McKeldin" | "Clarice";

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

export interface UserData {
  name: string;
  email: string;
  role: "buyer" | "seller";
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
}

export interface Order {
  id: string;
  items: Product[];
  total: number;
  location: Location;
}