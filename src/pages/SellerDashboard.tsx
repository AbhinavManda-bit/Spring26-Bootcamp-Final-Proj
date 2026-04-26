import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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

// read current User through useAuth()
// page func comp only renders if user logged in is seller. 
// if they are a buyer, redirect to product catalog

// state var to hold a current product catalog list for this seller's product.

// HELPER FUNCTIONS
// GET SELLERS PRODUCTS
// (read all products. return an array of products with this user's seller id)

// - fetch products that belong to the currently logged in seller
// - fetch sold items for a given seller

const SellerDashboard = () => {

    const { currentUser, currentUserData } = useAuth();
    const navigate = useNavigate();

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
            throw new Error("No user is logged in.");
        }
    }

    const [sellersProducts, setSellersProducts] = useState<Product[] | null>(null);

    // load this seller's product data into our state seller product list
    useEffect(() => {
        const getVendProdData = async () => {
            setSellersProducts(await getSellersProductData());
        }
        getVendProdData();
    }, [])

    // GET SELLERS ORDER STATS
    // - read products and orders
    // return an object:
    // {total revenue made by this seller, total products sold by this seller}
    // (read the state var list of all orders. thread an accumulator through the array of all orders.
    // for each order, generates an array which is an intersection of this seller's products
    // and the products in this order by productId. then for each item in this intersection
    // array, it adds this item's price to the revenue made by this seller. and adds one
    // to products sold by this seller)
    const getSellerOrderStats = async () => {
        if(currentUserData && currentUser){
            const currentSellerId = currentUserData.role;
            const currentSellersProducts = await getSellersProducts(currentSellerId);
            const allOrdersData = await getAllOrderData();
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
            return sellersCalculatedStats;
        } else {
            throw new Error("No user is logged in.");
        }
    }

    // Redirects to product catalog as a side effect. But returns a string we can use
    // in our func comp while redirecting.
    const redirectToCatalog = () => {
        navigate("/product_catalog");
        return "Redirecting to catalog..."
    }

    return (
        <>{
            currentUserData ? 
            (currentUserData.role == "seller" ? 
                redirectToCatalog()
                : "Welcome, " + currentUserData?.name) 
            : redirectToCatalog()}</>
    )
}

export default SellerDashboard