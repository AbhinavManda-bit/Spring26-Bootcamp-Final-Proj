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

 useEffect(() => {
    const fetchCartProducts = async () => {
      setLoading(true);
      if (!items || items.length === 0) {
        setCartProducts([]);
        setSubtotal(0);
        setLoading(false);
        return;
      }
      try {
        const allProducts = await getDataOfAllItemsInCatalog();
        const cartItems = allProducts.filter((p) => items.includes(p.id));
        setCartProducts(cartItems);
        const total = cartItems.reduce((sum, p) => sum + p.price, 0);
        setSubtotal(total);
      } catch (err) {
        console.error("Error fetching cart products  ", err);
      }
      setLoading(false);
    };
    fetchCartProducts();
  }, [items]);

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
    } catch (err) {
      console.error("Error removing item  ", err);
    }
  };

  const handleCheckout = async () => {
    if (!nameOnCard || !cardNumber || !expDate || !cvv) {
      alert("Please fill in all payment fields.");
      return;
    }
    setCheckingOut(true);
    try {
      await clearCart();
      setCheckoutSuccess(true);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout :( Please try again.");
    }
    setCheckingOut(false);
  };