import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAw0VIqnYelP-H3N2BIrji1Z-lcSQRhoi4",
  authDomain: "auth-5e92f.firebaseapp.com",
  projectId: "auth-5e92f",
  storageBucket: "auth-5e92f.appspot.com",
  messagingSenderId: "266416790731",
  appId: "1:266416790731:web:33d68dfc217e7e7faf4f4e",
  measurementId: "G-9YE2FHZWP1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
