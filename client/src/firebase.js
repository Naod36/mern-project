// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-court.firebaseapp.com",
  projectId: "mern-court",
  storageBucket: "mern-court.appspot.com",
  messagingSenderId: "390390402145",
  appId: "1:390390402145:web:dfd6437ed21e0784042e20",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
