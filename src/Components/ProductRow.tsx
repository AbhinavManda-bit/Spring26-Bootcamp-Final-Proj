import { type Product } from "../types"
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
    return <p>h</p>
}

export default ProductRow