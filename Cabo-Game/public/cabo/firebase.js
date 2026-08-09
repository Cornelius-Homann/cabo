import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6d3XpQRiZS6ZX2d_8soi8XfUyCzGt4R4",
  authDomain: "cornelius-cabo.firebaseapp.com",
  databaseURL: "https://cornelius-cabo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cornelius-cabo",
  storageBucket: "cornelius-cabo.firebasestorage.app",
  messagingSenderId: "817971372989",
  appId: "1:817971372989:web:3d94b5a5ff3ca225fce8d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Realtime Database
export const rtdb = getDatabase(app);
