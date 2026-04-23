import { auth } from "../services/firebase";
import { type AuthContextType } from "../types/index";
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

/*
Context Description:
- Manages global authentication state across the app.
- Stores the current user, their role (buyer/seller), and provides functions for login, signup, and logout.
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, [])

    const value = { currentUser, loading };

    return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
