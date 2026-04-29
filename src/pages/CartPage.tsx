/*
Page Description:
- Shows all items in cart
- Displays:
--> Product name
--> Price
--> Pickup location
--> Checkout button
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../Components/CartItem";
import { getDataOfAllItemsInCatalog } from "../Utilities/productUtilities";
import type { Product } from "../types/index";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart } = useCart();
  const { currentUser, currentUserData } = useAuth();

  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

