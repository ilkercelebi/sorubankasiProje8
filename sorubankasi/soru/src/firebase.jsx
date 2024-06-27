// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc,getDoc, setDoc ,collection,getDocs,deleteDoc,query,where} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD85iBbRhfI3tbhQZEvuG_wsdzTjQwqu6Y",
  authDomain: "soru-16704.firebaseapp.com",
  projectId: "soru-16704",
  storageBucket: "soru-16704.appspot.com",
  messagingSenderId: "316832404493",
  appId: "1:316832404493:web:e05c06349dc3a4fa943144",
  measurementId: "G-K0H1XPN6PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


export { auth, firestore, doc, setDoc,getDoc ,collection,getDocs,deleteDoc,query,where};
