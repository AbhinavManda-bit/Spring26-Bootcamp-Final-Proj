/*
Component Description:
- Small visual badge showing the product’s pickup location (e.g., “McKeldin”).
- Used inside ProductCard, ProductPage, and CartItem for quick visibility.
*/

import { type Product } from "../types/index";

interface LocationTags {
    product: Product;
}

const LocationTag = ({ product }: LocationTags) => {
    return (
        <div className="bg-[#E05353] font-semibold text-white text-sm py-1 rounded-full">
            {product.location}
        </div>
    );
};

export default LocationTag;