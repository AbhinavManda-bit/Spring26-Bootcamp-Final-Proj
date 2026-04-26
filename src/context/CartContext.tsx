import type { CartContextType } from "../types";
import { useAuth } from "./AuthContext";
import { createContext, useContext, useEffect, useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { getItemPrice, verifyItemIdInCatalog } from "../Utilities/productUtilities";
import { pullUserData } from "../Utilities/userUtilities";
import { pullUserCart } from "../Utilities/cartUtilities";

/*
Context Description:
- Manages the global shopping cart state.
- Stores all items added to the cart and provides functions to add, remove, and clear items, as well as calculate total price.
- Used across ProductPage, CartPage, and checkout flow to keep cart data consistent everywhere.
*/ 

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<string[] | null>(null);
    const [loadingCart, setLoadingCart] = useState(true)
    
    const { currentUser } = useAuth();  
    
    // use effect to update cart when the user changes.
    // if a buyer user is logged in, pull their cart from firestore and set it
    // if a user is not logged in or if a seller is logged in, set the cart to null
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
        const nullifyCart = async () => {
            setLoadingCart(true);
            setItems(null);
            setLoadingCart(false);
        }
        if(currentUser) {
            loadCart();
        } else {
            nullifyCart();
        }
    }, [currentUser])

    // utility function to add item to cart
    // throws error if items is not in product catalog or if user is not logged in or if 
    // current user is a seller
    // and displays error to the user
    const addItem = async (productId: string) => {
        setLoadingCart(true);
        if(!(await verifyItemIdInCatalog(productId))){
            setLoadingCart(false);
            throw new Error("Item with this product id is not in the list of products (product catalog).");
        } 
        if(currentUser){
            const userData = (await pullUserData(currentUser));
            if(userData && userData.role == "seller"){
                setLoadingCart(false);
                throw new Error("The currently logged in user is a seller.");
            }
            if(!items) throw new Error("Cannot add an item to a null cart.");
            setItems([...items, productId]);
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
        if(!verifyItemIdInCatalog(productId)){
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
            if(!items) throw new Error("Cannot remove an item from a null cart.");
            setItems(items.filter(item => item !== productId));
            try{
                await updateDoc(userDataCartDocRef, {
                items: arrayRemove(productId)
                });
            } catch {
                throw new Error("error with db + ");
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
            const userData = (await pullUserData(currentUser));
            if(userData && userData.role == "seller"){
                setLoadingCart(false);
                throw new Error("The currently logged in user is a seller.");
            }
            const userId = currentUser.uid;
            const userDataCartDocRef = doc(db, "carts", userId);
            if(!items) throw new Error("Cannot clear a null cart.");
            setItems([]);
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
            const userData = (await pullUserData(currentUser));
            if(userData && userData.role == "seller"){
                setLoadingCart(false);
                throw new Error("The currently logged in user is a seller.");
            }
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