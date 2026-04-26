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

    return docsData;
}