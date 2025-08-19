// lib/firebase.js

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMUTwkgBNWcUh382nyuArwdypIFZTm5tE",
  authDomain: "uriford-b57b6.firebaseapp.com",
  projectId: "uriford-b57b6",
  storageBucket: "uriford-b57b6.appspot.com", //
  messagingSenderId: "133990135018",
  appId: "1:133990135018:web:4981c93d74f31571fa9393",
  measurementId: "G-GJYELKVYJ0",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Export auth
export const auth = getAuth(app);
