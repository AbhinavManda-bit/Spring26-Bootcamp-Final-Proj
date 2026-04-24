import type { User } from "firebase/auth";
import type { CartContextType, CartData, Product } from "../types";
import { useAuth } from "./AuthContext";
import { createContext, useContext, useEffect, useState } from "react";
import { pullUserData } from "./AuthContext";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

/*
Context Description:
- Manages the global shopping cart state.
- Stores all items added to the cart and provides functions to add, remove, and clear items, as well as calculate total price.
- Used across ProductPage, CartPage, and checkout flow to keep cart data consistent everywhere.
*/ 

const CartContext = createContext<CartContextType | undefined>(undefined);

// helper function to pull this user's cart data. returns null if the user is a vendor. 
// or if the inputted user is null (no user logged in)
// if the first data pull leads to blank data, then 
// retries every 1 second to hit firestore if it can't find the user's entry in firestore
// (in the edge case that we try to pull the data before the cart data insertion is complete
// [this edge case only applies to a new sign up for a buyer user])
const pullUserCart = async (user: User | null) => {
    if(user){
        const currentUserData = await pullUserData(user);
        if(currentUserData && currentUserData.role == "seller"){
            return null;
        }
        const userId = user.uid;
        const userDataCartDocRef = doc(db, "carts", userId);
        let userDataCartSnap = await getDoc(userDataCartDocRef);
        if(!(userDataCartSnap.exists())){
            while(true) {
                await new Promise(r => setTimeout(r, 1000)); 
                userDataCartSnap = await getDoc(userDataCartDocRef);
                if(userDataCartSnap.exists()) break;
            }
        }
        const userCart = userDataCartSnap.data() as CartData;
        return userCart;
    } else {
        return null;
    }
}

//utility function to get a data array of all the items in the current product catalog
// (as an array of products)
const getDataOfAllItemsInCart = async () => {
    const collectionRef = collection(db, "products");
    const querySnapshot = await getDocs(collectionRef);

    const docsData: Product[] = querySnapshot.docs.map((docSnap) => {
        return ({
            id: docSnap.id,
            ...docSnap.data()
        } as Product);
    })

    return docsData;
}

//utility function to verify that an item is a real item in the catalog
const verifyItemIdInCart = async (productId: string) => {
    const allItemsInCart = await getDataOfAllItemsInCart();
    return allItemsInCart.some((product) => (product.id === productId));
}

//utility function to get the price of an item with the given productId
const getItemPrice = async (productId: string) => {
    const allItemsInCart = await getDataOfAllItemsInCart();
    const itemPrice = allItemsInCart.find((product) => (product.id === productId))?.price;
    if(itemPrice){
        return itemPrice
    } else {
        throw new Error("Could not find price of item");
    }
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<string[] | null>(null);
    const [loadingCart, setLoadingCart] = useState(true)
    
    const { currentUser } = useAuth();  
    
    useEffect(() => {
        const loadCart = async () => {
            setLoadingCart(true);
            const thisUsersCartItems = await pullUserCart(currentUser);
            if(thisUsersCartItems){
                setItems(thisUsersCartItems.items);
            } else {
                setItems(null);
            }
            setLoadingCart(false);
        };
        loadCart();
    }, [currentUser])

    // utility function to add item to cart
    // throws error if items is not in product catalog or if user is not logged in or if 
    // current user is a vendor
    // and displays error to the user
    const addItem = async (productId: string) => {
        setLoadingCart(true);
        if(!(await verifyItemIdInCart(productId))){
            setLoadingCart(false);
            throw new Error("Item with this product id is not in the list of products (product catalog).");
        } 
        if(currentUser){
            const userData = (await pullUserData(currentUser));
            if(userData && userData.role == "seller"){
                setLoadingCart(false);
                throw new Error("The currently logged in user is a seller.");
            }
            const userId = currentUser.uid;
            const userDataCartDocRef = doc(db, "carts", userId);
            await updateDoc(userDataCartDocRef, {
                items: arrayUnion(productId)
            });
            setLoadingCart(false);
        } else {
            setLoadingCart(false);
            throw new Error("No user is logged in.");
        }
    }

    // utility function to add item to cart
    // throws error if items is not in product catalog or if user is not logged in
    // and displays error to the user
    // leaves cart unaffected if item is not in the cart
    const removeItem = async (productId: string) => {
        setLoadingCart(true);
        if(!verifyItemIdInCart(productId)){
            setLoadingCart(false);
            throw new Error("Item with this product id is not in the list of products (product catalog).");
        } 
        if(currentUser){
            const userId = currentUser.uid;
            const userDataCartDocRef = doc(db, "carts", userId);
            try{
                await updateDoc(userDataCartDocRef, {
                items: arrayRemove(productId)
                });
            } catch {
                throw new Error("db write failed");
            }
            setLoadingCart(false);
        } else {
            setLoadingCart(false);
            throw new Error("No user is logged in.");
        }
    }

    // utility function to clear items in cart
    // no matter what the cart is, clears the items in the currently logged in users cart
    // to be blank. throws error if no user is logged in
    const clearCart = async () => {
        setLoadingCart(true);
        if(currentUser){
            const userId = currentUser.uid;
            const userDataCartDocRef = doc(db, "carts", userId);
            await updateDoc(userDataCartDocRef, {
                items: []
            });
            setItems([]);
            setLoadingCart(false);
        } else {
            setLoadingCart(false);
            throw new Error("No user is logged in.");
        }
    }

    // utility function to calculate and return the total price of the items in the cart. throws error if no user
    // is logged in or if there is a failure in fetching the current user's cart contents
    const calcTotalPrice = async () => {
        setLoadingCart(true);
        if(currentUser){
            const currentUserCart = await pullUserCart(currentUser);
            if(currentUserCart){
                const cartIdList = currentUserCart.items;
                let totalPrice: number = 0;
                for(const currId of cartIdList){
                    totalPrice += await getItemPrice(currId.toString());
                }
                setLoadingCart(false);
                return totalPrice;
            } else {
                setLoadingCart(false);
                throw new Error("Could not fetch this users cart. " + 
                   "*This error should not reall happen unless firestore is down.")
            }
        } else {
            setLoadingCart(false);
            throw new Error("No user is logged in.");
        }
    }

    const value = { items, loadingCart, addItem, removeItem, clearCart, calcTotalPrice };

    return (
    <CartContext.Provider value={value}>
      {!loadingCart && children}
    </CartContext.Provider>
  );
}