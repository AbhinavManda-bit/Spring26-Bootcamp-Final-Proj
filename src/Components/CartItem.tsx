/*
Component Description:
- Represents a single item in the cart.
- Displays product info (name, price, location, description) 
*/

import { type Product } from "../types/index";
import LocationTag from "./LocationTag";

interface CartItems {
  product: Product;
  removeItem: (id: string) => void;
}

const CartItem = ({ product, removeItem }: CartItems) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 py-5 shadow-sm max-w-xl">
      {/* image */}
      <div className="flex items-center gap-4">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-18 h-18 object-cover rounded-lg"
        />
        {/* title, size, and location tag */}
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-black text-lg mb-3">{product.title}</p>
          <p className="font-semibold text-sm text-black text-left">Size: {product.size}</p>
          <LocationTag product={product} />
        </div>
      </div>
      {/* price */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-base text-black font-semibold">
          ${product.price.toFixed(2)}
        </p>
      </div>
      {/* remove item from cart button */}
      <button
        onClick={() => removeItem(product.id)}
        className="text-xl"
      > ❌</button>
    </div>
  );
};

export default CartItem;