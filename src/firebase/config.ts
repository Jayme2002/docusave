import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCPGYLAOnScfz1ei2thhjySZAESXofSOn0",
  authDomain: "esigner-dd386.firebaseapp.com",
  projectId: "esigner-dd386",
  storageBucket: "esigner-dd386.firebasestorage.app",
  messagingSenderId: "574902167447",
  appId: "1:574902167447:web:9b4f6f79da63b0c42546d2",
  measurementId: "G-CFMHHSCMJ6"
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
