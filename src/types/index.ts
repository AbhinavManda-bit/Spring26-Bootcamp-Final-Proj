export type Location = "Van Munching" | "McKeldin" | "Clarice";

export interface User {
  id: string;
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