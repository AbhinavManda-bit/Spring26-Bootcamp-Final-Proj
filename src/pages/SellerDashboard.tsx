import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import type { Order, Product, SellerStats } from "../types";
import { getDataOfAllItemsInCatalog, getSellersProducts } from "../Utilities/productUtilities";
import { getAllOrderData } from "../Utilities/orderUtilities";
import ProductRow from "../Components/ProductRow";

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
    // state var to hold current seller stats
    const [sellerStats, setSellersStats] = useState<SellerStats | null>(null);
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
            console.log("initial fetch of current sellers products: " + currentSellersProducts);
            const allOrdersData = await getAllOrderData();
            // fold left workflow!!!
            const baseAcc: SellerStats = {totalRevenue: 0, totalProductsSold: 0};
            const sellersCalculatedStats: SellerStats = 
                allOrdersData.reduce((acc: SellerStats, order: Order) => {
                    console.log("[GETSELLERORDERSTATS] order id: " + order.id + " items: " + order.items);
                    const thisSellersItemsInThisOrder = 
                        currentSellersProducts.filter((product) => {
                            order.items.includes(product.id);
                        });
                    console.log("in the grand comparison.");
                    console.log("order.items: " + order.items);
                    console.log("current sellers products: " + currentSellersProducts);
                    console.log("this sellers items in this order: " + thisSellersItemsInThisOrder);
                    let {totalRevenue: accRevenue, totalProductsSold: accProductsSold} = acc;
                    for (const orderItem of thisSellersItemsInThisOrder){
                        accRevenue += orderItem.price;
                        accProductsSold += 1;
                    }
                    console.log("new acc rev: " + accRevenue + ", new acc prod sold: " + accProductsSold);
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
    // then load this seller's stats data into our func comp's
    useEffect(() => {
        const getVendProdData = async () => {
            setLoading(true);
            setSellersProducts(await getSellersProductData());
            setSellersStats(await getSellerOrderStats());
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
        <>
            {currentUserData ? 
            (currentUserData.role == "seller" ? !loading &&
                // div for page
                <div className="min-h-screen w-full bg-terp-cream px-8 py-8">
                    {/* div for content */}
                    <div className="w-full max-w-7xl">
                        {/* seller greeting */}
                        <h1 className="text-5xl font-bold mb-8">
                            Welcome, {currentUserData.name}!
                        </h1>
                        {/* div for top row with stats and add product button */}
                        <div className="flex gap-6 items-end">
                            {/* first statistic card (number of total listing) */}
                            <div className="bg-white rounded-2xl p-6">
                                {/* statistic label */}
                                <p className="text-lg font-bold">
                                    TOTAL LISTINGS
                                </p>
                                <p>
                                    {sellersProducts?.length}
                                </p>
                            </div>
                            {/* second statistic card (total revenue) */}
                            <div className="bg-white rounded-2xl p-6">
                                {/* statistic label */}
                                <p className="text-lg font-bold">
                                    REVENUE
                                </p>
                                <p>
                                    ${sellerStats?.totalRevenue}.00
                                </p>
                            </div>
                            {/* third statistic card (total products sold) */}
                            <div className="bg-white rounded-2xl p-6">
                                {/* statistic label */}
                                <p className="text-lg font-bold">
                                    PRODUCTS SOLD
                                </p>
                                <p>
                                    {sellerStats?.totalProductsSold}
                                </p>
                            </div>
                            {/* button to scroll to the add product view */}
                            <button className="bg-black text-white rounded-xl px-8 py-6">
                                <b>+</b> Add Product
                            </button>
                        </div>
                        {/* div for table of this seller's products */}
                        <div className="bg-white rounded-2xl p-8 mt-8 w-full">
                            {/* row of column headings for product table */}
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.5fr_1fr] border-b pb-4 font-bold pr-2">
                                <p>PRODUCT</p>
                                <p>CATEGORY</p>
                                <p>SIZE</p>
                                <p>PRICE</p>
                                <p>IN-STOCK?</p>
                                <p>PICKUP LOCATION</p>
                                <p>ACTION</p>
                            </div>
                            {/* div to wrap the list of products */}
                            <div className="flex flex-col overflow-y-auto max-h-[70vh] w-full pr-2">
                                {sellersProducts && sellersProducts?.map((prod) => {
                                    return <ProductRow key={prod.id} product={prod} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                : <p>{redirectToPath("/product-catalog")}</p>) 
            : <p>{redirectToPath("/product-catalog")}</p>}
        </>
    )
}

export default SellerDashboard