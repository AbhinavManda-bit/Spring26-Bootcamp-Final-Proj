/*
Page Description:
- Displays all products in a grid
- Features:
--> Search bar
--> Filters:
---> Category
---> Size
---> Pickup location
--> Clicking a product → ProductPage
*/

import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const CatalogPage = () => {
    
    const { currentUser, currentUserData } = useAuth();
    const navigate = useNavigate();

    const [catalogProducts, setCatalogProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);

    // Redirects to specified path as a side effect. But returns a string we can use
    // in our func comp while redirecting.
    const redirectToPath = (path: string) => {
        navigate(path);
        return "Redirecting..."
    }

    return (
        // only render our func comp when a user is logged in
        // and only if that user is a buyer
        <>{
            currentUserData ? 
            (currentUserData.role == "seller" ? 
                "Welcome, " + currentUserData?.name
                : redirectToPath("seller-dash")) 
            : redirectToPath("/")}</>
    )
}

// current user

// useState var for current filter (of type )
// useState var for current product items (that will be displayed to user)
// useState var for loading

// useEffect, when filter changes, we should set loading to true
// set the current product items to 
// a new filtered list based on that filter
// then set loading to false

// functions
// - searching query (input: string, output: product list)
// - apply filters (input: filter[], output: product list)

// func comp
// if user is not logged in, navigate to login page
// if user is logged in as seller, navigate to seller dashboard

export default CatalogPage;