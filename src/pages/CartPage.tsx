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


  return (
    <div className="min-h-screen bg-[#FAF6F1] px-10 py-6 pb-16">
      <button
        onClick={() => navigate("/products")}
        className="bg-transparent border-none text-black font-bold text-sm cursor-pointer mb-6"
      >
        ← Continue Shopping
      </button>

      <div className="flex gap-8 items-start flex-wrap">
       
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-extrabold text-black mb-5">Your Cart</h1>
          <div className="flex flex-col gap-4">
            {cartProducts.map((product) => (
              <CartItem
                key={product.id}
                product={product}
                removeItem={handleRemoveItem}
              />
            ))}
          </div>
        </div>

       
        <div className="flex flex-col gap-4 w-[360px]">
    
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-black">Subtotal:</span>
              <span className="text-sm font-semibold text-black">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-black">Pick-Up - UMD:</span>
              <span className="text-sm font-bold text-green-700">Free</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-1">
              <span className="text-sm font-bold text-black">Order Summary:</span>
              <span className="text-sm font-bold text-black">${subtotal.toFixed(2)}</span>
            </div>
          </div>

 
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <h2 className="text-lg font-extrabold text-black mb-1">Shopping Card</h2>

            <p className="text-xs font-semibold text-black">Payment Method:</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full border-2 border-green-700 shadow-[inset_0_0_0_3px_#15803d]" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">Credit Card</span>
            </div>

            <label className="text-xs font-semibold text-black">Name On Card</label>
            <input
              type="text"
              placeholder="Enter name on card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black outline-none bg-white"
            />

            <label className="text-xs font-semibold text-black">Card Number</label>
            <input
              type="text"
              placeholder="Enter card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black outline-none bg-white"
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-black block mb-1">Expiration Date</label>
                <input
                  type="text"
                  placeholder="Enter expiration date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black outline-none bg-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-black block mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="Enter CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black outline-none bg-white"
                />
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className={`w-full py-4 rounded-lg text-white font-bold text-base mt-2 cursor-pointer ${checkingOut ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
            >
              {checkingOut ? "Processing..." : "Check Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}