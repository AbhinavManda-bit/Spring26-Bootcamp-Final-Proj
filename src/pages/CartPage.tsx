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


  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF6F1] gap-4">
        <p className="text-gray-500 text-base">Please log in to view your cart.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    );
  }


  if (currentUserData?.role === "seller") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF6F1] gap-4">
        <p className="text-gray-500 text-base">Seller accounts do not have a cart.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
        >
          Go to Catalog
        </button>
      </div>
    );
  }


  if (checkoutSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF6F1] gap-4 text-center">
        <p className="text-3xl font-extrabold text-black">Order placed!</p>
        <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
          Thanks for your purchase. Pick up your items at the listed UMD locations.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF6F1]">
        <p className="text-gray-400 text-sm">Loading cart...</p>
      </div>
    );
  }

  
  if (cartProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF6F1] gap-5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <p className="text-xl font-bold text-black">Your cart is empty</p>
        <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
        >
          Browse Products
        </button>
      </div>
    );
  }

