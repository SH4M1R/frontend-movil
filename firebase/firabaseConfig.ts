// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//const firebaseConfig = {
  
//};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  //getReactNativePersistence,
  initializeAuth
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAT0CHo5XcLvNyratuiue5OyVJ5tyFnuQE",
  authDomain: "prueba-996bf.firebaseapp.com",
  projectId: "prueba-996bf",
  storageBucket: "prueba-996bf.firebasestorage.app",
  messagingSenderId: "604348525092",
  appId: "1:604348525092:web:3199d6c15183642780c6b1",
  measurementId: "G-THTJKNM6TS"
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  //persistence: getReactNativePersistence(AsyncStorage)
});
