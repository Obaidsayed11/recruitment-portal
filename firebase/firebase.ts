// utils/firebase/firebase.ts

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBh74r8e183bVvoRdUmox_034Ucqkh_FAo",
  authDomain: "delivo-78f43.firebaseapp.com",
  projectId: "delivo-78f43",
  storageBucket: "delivo-78f43.firebasestorage.app",
  messagingSenderId: "1062900200972",
  appId: "1:1062900200972:web:a03e85bb077cb2ae422029",
  measurementId: "G-36TSZCYKHR",
};

const firebaseApp = initializeApp(firebaseConfig);

export const messaging = () => getMessaging(firebaseApp);

export default firebaseApp;
