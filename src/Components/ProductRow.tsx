import { type Product } from "../types"
import TrashIcon from "../assets/trash_icon.png"
import PenIcon from "../assets/pen_icon.png"
{/* need an array of func comps to be rendered here */}
{/* export interface Product {
id: string;
title: string;
description: string;
price: number;
size: string;
category: string;
location: Location;
imageUrl: string;
sellerId: string;
sold: boolean;
} */}
// takes in a product
{/* extracts from param product 
id, title, description, price, size, 
gender, category, location, imageurl, sold*/}
{/* renders a div with the same tailwind classes as the above grid */}
{/* for one section it puts the product image (small and then product name) */}
{/* for next section it will display gender and category */}
{/* for next section it will display price wtih $ and two decimal points */}
{/* for next section it will display yes or no (green and red) for sold status */}
{/* last section will be two icons. an edit and a trash.
after editing or removing an item successfully (parameters pass validation)
loading will be set to true and the state vars will be manually recalculated */}

const ProductRow = ({ product }: { product: Product  }) => {
    return (
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.5fr_1fr] py-6 border-b items-center">
            {/* div for the product image and product title (going in product column) */}
            <div className="flex items-center gap-4">
                <img className="w-20 h-20 object-contain" src={product.imageUrl} />
                <p>{product.title}</p>
            </div>
            {/* category and gender (going in category column) */}
            <p>{product.gender} - {product.category}</p>
            {/* product size */}
            <p>{product.size}</p>
            {/* product price */}
            <p>{/^[0-9]+\.[0-9]{2}$/.test(product.price.toString()) 
                ? "$" + product.price : "$" + product.price + ".00"}</p>
            {/* product availability (in stock or not) */}
            {product.sold ? 
            <p className="text-red-500">NO</p> : <p className="text-green-500">YES</p>}
            {/* product pickup location */}
            <p>{product.location.toUpperCase()}</p>
            {/* div to hold images for editing and removing an item */}
            <div className="flex gap-4">
                <img className="w-6 h-6" src={PenIcon} />
                <img className="w-6 h-6" src={TrashIcon} />
            </div>
        </div>
    )
}

export default ProductRow