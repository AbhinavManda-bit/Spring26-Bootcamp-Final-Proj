/*
Component Description:
- Displays a single product in the catalog grid.
- Shows image, title, price, size, and pickup location; clickable to navigate to the full Product page.
*/
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/index";
import LocationTag from "./LocationTag";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="w-full h-56 bg-[#ede8df] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <p className="font-bold text-black text-base leading-tight">{product.title}</p>
        <p className="text-sm text-gray-500">Size: {product.size}</p>
        <LocationTag product={product} />
        <p className="text-lg font-extrabold text-black mt-1">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
