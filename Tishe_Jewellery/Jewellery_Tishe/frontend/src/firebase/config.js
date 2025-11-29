// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyg3zysbnXW5_mNacn55VRfetx-8mmX18",
  authDomain: "tishejewellery.firebaseapp.com",
  projectId: "tishejewellery",
  storageBucket: "tishejewellery.firebasestorage.app",
  messagingSenderId: "761895865872",
  appId: "1:761895865872:web:93edbf754e08a4c6300495",
  measurementId: "G-JQCH5LWGTW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
// googleProvider.setCustomParameters({
//   prompt: 'select_account'
// });

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    // The signed-in user info
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    // If user doesn't exist, create a new document
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        provider: 'google.com'
      });
    }
    
    return { user, token };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export { 
  auth, 
  db, 
  googleProvider, 
  signInWithGoogle, 
  GoogleAuthProvider 
};