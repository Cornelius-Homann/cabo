import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "cornelius-cabo.firebaseapp.com",
  databaseURL: "https://cornelius-cabo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cornelius-cabo",
  storageBucket: "cornelius-cabo.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Realtime Database
export const rtdb = getDatabase(app);
