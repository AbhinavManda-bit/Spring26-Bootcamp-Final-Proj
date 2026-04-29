/*
Page Description:
•⁠  ⁠Displays full product details:
--> Images
--> Title
--> Price
--> Size
--> Description
--> Pickup location
--> "Add to Cart" button
*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import LocationTag from "../Components/LocationTag";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const { addItem, items, loadingCart } = useCart();
  const { currentUser, currentUserData } = useAuth();

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const productDocRef = doc(db, "products", productId);
        const productSnap = await getDoc(productDocRef);
        if (productSnap.exists()) {
          setProduct({ id: productSnap.id, ...productSnap.data() } as Product);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      }
      setLoadingProduct(false);
    };
    fetchProduct();
  }, [productId]);

  const isInCart = items && productId ? items.includes(productId) : false;
  const isSeller = currentUserData?.role === "seller";
  const notLoggedIn = !currentUser;

  const handleAddToCart = async () => {
    if (!product) return;
    // wait for cart to finish loading before trying to add
    if (loadingCart || items === null) {
      setCartError("Cart is still loading, please try again in a moment.");
      return;
    }
    setCartError(null);
    setAddingToCart(true);
    try {
      await addItem(product.id);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add to cart.";
      setCartError(msg);
    }
    setAddingToCart(false);
  };

  // Loading
  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading product...</p>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF6F1] flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold text-red-600">Product not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF6F1] px-8 py-6 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none text-black font-bold text-sm cursor-pointer mb-6 block"
        >
           Continue Shopping
        </button>

        {/* Product layout */}
        <div className="flex gap-12 items-start flex-wrap">
          {/* Image */}
          <div className="flex-shrink-0 w-[440px] max-w-full rounded-md overflow-hidden bg-[#ede8df]">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-[240px] pt-2 flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-black leading-tight">{product.title}</h1>

            <p className="text-sm font-bold text-black">
              Free Pickup - {product.location}
            </p>

            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold tracking-widest text-gray-500 w-24">SIZE:</span>
              <span className="text-sm text-black font-medium">{product.size}</span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold tracking-widest text-gray-500 w-24">CATEGORY:</span>
              <span className="text-sm text-black font-medium">{product.category}</span>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold tracking-widest text-gray-500 w-24">GENDER:</span>
              <span className="text-sm text-black font-medium">{product.gender}</span>
            </div>

            <div className="mt-1">
              <LocationTag product={product} />
            </div>

            <p className="text-4xl font-bold text-black mt-4">${product.price.toFixed(2)}</p>

            {/* Feedback banners */}
            {addedToCart && (
              <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-2 text-sm font-semibold">
                Added to cart!
              </div>
            )}
            {cartError && (
              <div className="bg-red-50 border border-red-300 text-red-600 rounded-lg px-4 py-2 text-sm">
                {cartError}
              </div>
            )}

            {/* Add to Cart button */}
            {notLoggedIn ? (
              <div className="flex flex-col gap-2">
                <button
                  disabled
                  className="bg-gray-400 text-white px-7 py-3 rounded-lg font-bold text-base cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <p className="text-xs text-gray-500">
                  Please{" "}
                  <span
                    className="text-[#E05353] font-bold underline cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    log in
                  </span>{" "}
                  to add items to your cart.
                </p>
              </div>
            ) : isSeller ? (
              <div className="flex flex-col gap-2">
                <button
                  disabled
                  className="bg-gray-400 text-white px-7 py-3 rounded-lg font-bold text-base cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <p className="text-xs text-gray-500">Seller accounts cannot add items to a cart.</p>
              </div>
            ) : isInCart ? (
              <div className="flex flex-col gap-2">
                <button
                  disabled
                  className="bg-green-700 text-white px-7 py-3 rounded-lg font-bold text-base cursor-default"
                >
                  Already in Cart
                </button>
                <p className="text-xs text-gray-500">
                  <span
                    className="text-[#E05353] font-bold underline cursor-pointer"
                    onClick={() => navigate("/cart")}
                  >
                    View your cart
                  </span>
                </p>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || loadingCart}
                className={`px-7 py-3 rounded-lg font-bold text-base text-white cursor-pointer transition-colors ${
                  addingToCart || loadingCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#E05353] hover:bg-[#c0392b]"
                }`}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold tracking-widest text-[#E05353] mb-4">DESCRIPTION</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">{product.description}</p>
        </div>
      </div>
    </div>
  );
}