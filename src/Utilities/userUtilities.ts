import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import type { UserData } from "../types";

// helper function to pull userdata from firestore given a user. return null if user passed in is null
// or if the user's data cannot be found in firestore
// if it can't find the data, then it retries after 1 second delays repeated until it is found
// (in the edge case that we try to look up (in the auth change listener function) 
// the data before it has been inserted on account sign up)
export const pullUserData = async (user: User) => {
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