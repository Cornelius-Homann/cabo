import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyD6d3XpQRiZS6ZX2d_8soi8XfUyCzGt4R4",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "cornelius-cabo.firebaseapp.com",
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || "https://cornelius-cabo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "cornelius-cabo",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "cornelius-cabo.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "817971372989",
  appId: env.VITE_FIREBASE_APP_ID || "1:817971372989:web:3d94b5a5ff3ca225fce8d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Realtime Database
export const rtdb = getDatabase(app);
