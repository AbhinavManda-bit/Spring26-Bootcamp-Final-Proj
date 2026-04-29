import type { User } from "firebase/auth";
import { pullUserData } from "./userUtilities";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { CartData } from "../types";

// helper function to pull this user's cart data. returns null if the user is a seller. 
// or if the inputted user is null (no user logged in)
// if the first data pull leads to blank data, then 
// retries every 1 second to hit firestore if it can't find the user's entry in firestore
// (in the edge case that we try to pull the data before the cart data insertion is complete

// [this edge case only applies to a new sign up for a buyer user])
export const pullUserCart = async (user: User | null) => {
    if(user){
        const currentUserData = await pullUserData(user);
        if(currentUserData && currentUserData.role == "seller"){
            return null;
        }
        const userId = user.uid;
        const userDataCartDocRef = doc(db, "carts", userId);
        let userDataCartSnap = await getDoc(userDataCartDocRef);
        if (!userDataCartSnap.exists()) {
            await setDoc(userDataCartDocRef, { items: [] });
            return { items: [] } as CartData;
        }
        const userCart = userDataCartSnap.data() as CartData;
        return userCart;
    } else {
        return null;
    }
}