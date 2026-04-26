//utility function to get a data array of all the items in the current product catalog

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product } from "../types";

// (as an array of products)
export const getDataOfAllItemsInCatalog = async () => {
    const collectionRef = collection(db, "products");
    let querySnapshot;
    try{
        querySnapshot = await getDocs(collectionRef);
    } catch {
        throw new Error("DB read for all items in catalog failed.");
    }

    const docsData: Product[] = querySnapshot.docs.map((docSnap) => {
        return ({
            id: docSnap.id,
            ...docSnap.data()
        } as Product);
    });

    return docsData;
}

//helper function to verify that an item is a real item in the catalog
export const verifyItemIdInCatalog = async (productId: string) => {
    const allItemsInCart = await getDataOfAllItemsInCatalog();
    return allItemsInCart.some((product) => (product.id === productId));
}

//helper function to get the price of an item with the given productId
export const getItemPrice = async (productId: string) => {
    const allItemsInCart = await getDataOfAllItemsInCatalog();
    const itemPrice = allItemsInCart.find((product) => (product.id === productId))?.price;
    if(itemPrice){
        return itemPrice
    } else {
        throw new Error("Could not find price of item");
    }
}

//get sellers products
//given an id of a seller, returns a product[] of all products uploaded by this seller
export const getSellersProducts = async (sellerUserId: string) => {
    const collectionRef = collection(db, "products");
    const q = query(collectionRef, where("sellerId", "==", sellerUserId));
    let querySnapshot;
    try {
        querySnapshot = await getDocs(q);
    } catch {
        throw new Error("DB read for a specific seller's products failed");
    }
    const docsData: Product[] = querySnapshot.docs.map((docSnap) => {
        return ({
            id: docSnap.id,
            ...docSnap.data()
        } as Product);
    });

    return docsData;
}