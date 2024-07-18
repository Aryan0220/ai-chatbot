import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth";
import { auth } from "@/firebaseConfig";

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error('Error logging in with Google', error);
      }
};

export const logout = async () => {
    try{
        await signOut(auth);
    }
    catch(error){
        console.error('Error signing out', error);
    }
};
