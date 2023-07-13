import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0-fx-qVr2jH-PQhCndYtfo5KUDDXW84o",
    authDomain: "real-estate-fc8eb.firebaseapp.com",
    projectId: "real-estate-fc8eb",
    storageBucket: "real-estate-fc8eb.appspot.com",
    messagingSenderId: "79018388974",
    appId: "1:79018388974:web:7ef65a40659924962eb2ff"
};
// apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
// authDomain: `${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}`,
// projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
// storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}`,
// messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSGAING_SENDER}`,
// appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const GoogleProvider = new GoogleAuthProvider();



