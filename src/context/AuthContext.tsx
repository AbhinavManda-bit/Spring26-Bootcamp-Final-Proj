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
    // (in the edge case that we try to look up the data before it has been inserted on account sign up)
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
        // async function inside the use effect that fetches data for the user, sets 
        // the userdata context to it, and then sets loading context to false once the data
        // is initiated
        const pullThisUsersData = async (user: User) => {
            const usersData = await pullUserData(user);
            setCurrentUserData(usersData);
            setLoading(false);
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
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

    const signupAndLogin = async (name: string, email: string, password: string, role: Role) => {
        setLoading(true);
        const innerSignupAndLoginFunc = async () => {
            // validate parameters
            if(password.length < 8) throw new Error("Password must be at least 8 characters long");
            if(name.length === 0) throw new Error("Name must not be empty.");
            if(!((role.toString() === "buyer") || (role.toString() === "seller"))) throw new Error("Please enter a valid role ('buyer' or 'seller')");
            return await createUserWithEmailAndPassword(auth, email, password);
        };
        try {
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
            alert("Sign up error: " + errorMessage);
        }
    }

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let errorMessage: string = "Unknown error."
            if(error instanceof Error){
                errorMessage = error.message;
            }
            alert("Sign in error: " + errorMessage);
        }
    }

    const logout = async () => {
        setLoading(true);
        try { 
            await signOut(auth);
        } catch (error) {
            let errorMessage: string = "Unknown error."
            if(error instanceof Error){
                errorMessage = error.message;
            }
            alert("Sign out error: " + errorMessage);
        }
    }

    const sendResetPWEmail = async (email: string) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            let errorMessage: string = "Unknown error."
            if(error instanceof Error){
                errorMessage = error.message;
            }
            alert("Password reset email error: " + errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const value = { currentUser, currentUserData, loading, signupAndLogin, login, logout, sendResetPWEmail };

    return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
