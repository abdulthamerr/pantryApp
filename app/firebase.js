// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore  } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6FdOTAXXf7heUqiudTfYcWYbAGjJhU_Y",
  authDomain: "pantryapp-e16fe.firebaseapp.com",
  projectId: "pantryapp-e16fe",
  storageBucket: "pantryapp-e16fe.appspot.com",
  messagingSenderId: "636632164655",
  appId: "1:636632164655:web:f847127f3f77328cf699da",
  measurementId: "G-R00KCLT9BG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);