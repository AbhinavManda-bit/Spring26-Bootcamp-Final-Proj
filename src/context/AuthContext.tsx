import { auth } from "../services/firebase";
import { type AuthContextType, type Role, type UserData } from "../types/index";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, 
        type User, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword,
        signOut,
        sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

/*
Context Description:
- Manages global authentication state across the app.
- Stores the current user, their role (buyer/seller), and provides functions for login, signup, logout, and password reset via email.
- Also handles persisting auth state (so users stay logged in on refresh) and is used to protect routes like 
Profile and Seller Dashboard.
*/

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // helper function to pull userdata from firestore given a user. return null if user passed in is null
    // or if the user's data cannot be found in firestore
    // if it can't find the data, then it retries after 1 second delays repeated until it is found
    // (in the edge case that we try to look up (in the auth change listener function) 
    // the data before it has been inserted on account sign up)
    const pullUserData = async (user: User) => {
        if(user){
            const userId = user.uid;
            const userDataDocRef = doc(db, "users", userId);
            let userDataSnap = await getDoc(userDataDocRef);
            if(!userDataSnap.exists()){
                while(true) {
                    await new Promise(r => setTimeout(r, 1000)); 
                    userDataSnap = await getDoc(userDataDocRef);
                    if(userDataSnap.exists()) break;
                }
            }
            const userData = userDataSnap.data() as UserData;
            return userData;
        } else {
            return null;
        }
    }

    // use effect that attaches an auth state change listener to update our context for the user
    // when the user changes on the auth
    useEffect(() => {
        console.log("use effect ran");

        // async function inside the use effect that fetches data for the user, sets 
        // the userdata context to it, and then sets loading context to false once the data
        // is initiated
        const pullThisUsersData = async (user: User) => {
            const usersData = await pullUserData(user);
            setCurrentUserData(usersData);
            setLoading(false);
        };

        // attaches listener to auth that updates user and user data context when the auth is changed
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("auth listener function ran. auth has been changed");
            setCurrentUser(user);
            if(!user){
                setCurrentUserData(null);
                setLoading(false);
            } else {
                pullThisUsersData(user);
            }
        });

        return unsubscribe;
    }, []);

    // ALL 4 UTILITY FUNCTIONS BELOW DISPLAY ANY ERRORS THEY EXPERIENCE AS POPUPS TO THE USER
    // THESE FUNCTIONS ARE PASSED DOWN TO CHILD COMPONENTS AS A CONTEXT

    // utility function for sign up. validates input parameters (throwing error if not valid), 
    // creates a new user in the auth, and inserts their user data into firestore.
    const signupAndLogin = async (name: string, email: string, password: string, role: Role) => {
        setLoading(true);
        const innerSignupAndLoginFunc = async () => {
            // validate parameters
            let paramErrorMessage: string = "";
            let invalidParams: boolean = false;
            // name must not be an empty string
            if(name.length === 0){
                paramErrorMessage = paramErrorMessage + "•Name must not be empty.\n";
                invalidParams = true;
            }
            // email must be a valid email (checked through regex)
            if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))){
                paramErrorMessage = paramErrorMessage + "•Enter a valid email.\n";
                invalidParams = true;
            }
            // password must be 8 chars or longer
            if(password.length < 8){
                paramErrorMessage = paramErrorMessage + "•Password must be at least 8 characters long.\n";
                invalidParams = true;
            }
            // 
            if(!((role.toString() === "buyer") || (role.toString() === "seller"))){
                paramErrorMessage = paramErrorMessage + "•Input a valid role ('buyer' or 'seller').";
                invalidParams = true;
            }
            // throw an error if any parameter is invalid
            if(invalidParams){
                setLoading(false);
                throw new Error(paramErrorMessage);
            }
            return await createUserWithEmailAndPassword(auth, email, password);
        };
        try {
            // build and insert this user's data into firestore
            const newUserCreds = await innerSignupAndLoginFunc();
            const newUserId = newUserCreds.user.uid;
            const newUserDocRef = doc(db, "users", newUserId);
            const newUserDataToInsert: UserData = {
                name: name,
                email: email,
                role: role
            };
            await setDoc(newUserDocRef, newUserDataToInsert);
        } catch (error) {
            let errorMessage: string = "Unknown error."
            if(error instanceof Error){
                errorMessage = error.message;
            }
            setLoading(false);
            alert("Sign up error: \n\n" + errorMessage);
        }
    }

    // utility function to log in a user
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let errorMessage: string = "Unknown error."
            if(error instanceof Error){
                errorMessage = error.message;
            }
            setLoading(false);
            alert("Sign in error: " + errorMessage);
        }
    }

    // utility function to logout a user
    const logout = async () => {
        setLoading(true);
        try { 
            await signOut(auth);
        } catch (error) {
            let errorMessage: string = "Unknown error."
            if(error instanceof Error){
                errorMessage = error.message;
            }
            setLoading(false);
            alert("Sign out error: " + errorMessage);
        }
        setLoading(false);
    }

    // utility function to send a reset password email to a user's email
    const sendResetPWEmail = async (email: string) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            let errorMessage: string = "Unknown error."
            if(error instanceof Error){
                errorMessage = error.message;
            }
            setLoading(false);
            alert("Password reset email error: " + errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const value = { currentUser, currentUserData, loading, signupAndLogin, login, logout, sendResetPWEmail };

    return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};