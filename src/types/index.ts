export type Location = "Clarice" | "Van Munching" | "McKeldin Library";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller";
}

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  price: number;
  size: string;
  gender?: "Men" | "Women";
  category: string;
  location: Location;
  imageUrl: string;
}

export interface Order {
  id: string;
  items: Record<string, Product>;
  total: number;
  location: Location;
}
