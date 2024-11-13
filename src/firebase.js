// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDp-28BFCEq4KEpf0xXYK1A9MIj1VjgfpY",
    authDomain: "saferstory-cc73d.firebaseapp.com",
    databaseURL: "https://saferstory-cc73d-default-rtdb.firebaseio.com/",
    projectId: "saferstory-cc73d",
    storageBucket: "saferstory-cc73d.firebasestorage.app",
    messagingSenderId: "696108419537",
    appId: "1:696108419537:web:9be84278182951689e38f0",
    measurementId: "G-L7JW8YB1V2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db }; // Named exports for auth and db
export default app;   // Default export for the app