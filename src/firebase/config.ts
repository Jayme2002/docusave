import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyB0N1HRIB14nG7TWaFgoy7NEyG4RbGUQic",
  authDomain: "esign-6a77b.firebaseapp.com",
  projectId: "esign-6a77b",
  storageBucket: "esign-6a77b.firebasestorage.app",
  messagingSenderId: "798606690183",
  appId: "1:798606690183:web:dcdd9a5cf8796f1e9a3522",
  measurementId: "G-X0W3LJREBZ"
};


const app = initializeApp(firebaseConfig);
let analytics;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { app, auth, analytics, db, storage };
