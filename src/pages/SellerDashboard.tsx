import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import type { Order, Product, SellerStats } from "../types";
import { getDataOfAllItemsInCatalog, getSellersProducts } from "../Utilities/productUtilities";
import { getAllOrderData } from "../Utilities/orderUtilities";

/*
Page Description:
- Seller-only page
- Features:
--> View listed products
--> Add new product 
--> View sold items
*/

// HELPER FUNCTIONS
// GET SELLERS PRODUCTS
// (read all products. return an array of products with this user's seller id)

const SellerDashboard = () => {

    const { currentUser, currentUserData } = useAuth();
    const navigate = useNavigate();

    // state var to hold a current product catalog list for this seller's product.
    const [sellersProducts, setSellersProducts] = useState<Product[] | null>(null);
    // state var for loading status
    const [loading, setLoading] = useState(true);

    // HELPER FUNCTIONS

    // GET SELLERS PRODUCTS
    // (read all products. return an array of products with this user's seller id)
    const getSellersProductData = async () => {
        if(currentUserData && currentUser){
            const totalProducts = await getDataOfAllItemsInCatalog();
            const currentSellerId = currentUser.uid;
            const thisSellersProducts = totalProducts.filter(
                (product) => product.sellerId === currentSellerId
            )
            return thisSellersProducts;
        } else {
            navigate("/");
            throw new Error("No user is logged in.");
        }
    }

    // GET SELLERS ORDER STATS
    // - read products and orders
    // return an object:
    // {total revenue made by this seller, total products sold by this seller}
    // (read the state var list of all seller products. 
    // thread an accumulator through an array of all orders.
    // for each order, generates an array which is an intersection of this seller's products
    // and the products in this order by productId. [basically which of these sellers products
    // were in this order]. then for each item in this intersection
    // array, it adds this item's price to the revenue made by this seller. and adds one
    // to products sold by this seller)
    const getSellerOrderStats = async () => {
        setLoading(true);
        if(currentUserData && currentUser){
            const currentSellerId = currentUserData.role;
            const currentSellersProducts = await getSellersProducts(currentSellerId);
            const allOrdersData = await getAllOrderData();
            // fold left workflow!!!
            const baseAcc: SellerStats = {totalRevenue: 0, totalProductsSold: 0};
            const sellersCalculatedStats: SellerStats = 
                allOrdersData.reduce((acc: SellerStats, order: Order) => {
                    const thisSellersItemsInThisOrder = 
                        currentSellersProducts.filter((product) => {
                            order.items.includes(product.id);
                        });
                    let {totalRevenue: accRevenue, totalProductsSold: accProductsSold} = acc;
                    for (const orderItem of thisSellersItemsInThisOrder){
                        accRevenue += orderItem.price;
                        accProductsSold += 1;
                    }
                    return {totalRevenue: accRevenue, totalProductsSold: accProductsSold};
                }, baseAcc);
            setLoading(false);
            return sellersCalculatedStats;
        } else {
            navigate("/");
            throw new Error("No user is logged in.");
        }
    }

    // load this seller's product data into our state seller product list
    useEffect(() => {
        const getVendProdData = async () => {
            setLoading(true);
            setSellersProducts(await getSellersProductData());
        }
        getVendProdData();
    }, [])

    // Redirects to specified path as a side effect. But returns a string we can use
    // in our func comp while redirecting.
    const redirectToPath = (path: string) => {
        navigate(path);
        return "Redirecting..."
    }

    return (
        // only render our func comp when a user is logged in
        // and only if that user is a seller
        <>{
            currentUserData ? 
            (currentUserData.role == "seller" ? 
                "Welcome, " + currentUserData?.name
                : redirectToPath("/product-catalog")) 
            : redirectToPath("/")}</>
    )
}

export default SellerDashboard