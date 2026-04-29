import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Order } from "../types";

export const getAllOrderData = async () => {
    const collectionRef = collection(db, "orders");
    let querySnapshot;
    try{
        querySnapshot = await getDocs(collectionRef);
    } catch {
        throw new Error("DB read for all orders failed.");
    }

    const docsData: Order[] = querySnapshot.docs.map((docSnap) => {
        return ({
                    id: docSnap.id,
                    ...docSnap.data()
                } as Order);
    });
    for(const order of docsData){
        console.log("[GETALLORDERDATA] order id: " + order.id + " items: " + order.items);
    }
    return docsData;
}

// utility function to check if a product has been ordered yet
export const hasBeenOrderedYet = async (productId: string) => {
    const allOrderData = await getAllOrderData();
    const containsItem = allOrderData.find((order) => {
        return order.items.find((item) => {return item === productId});
    })
    return containsItem;
}