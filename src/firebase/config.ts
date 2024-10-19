import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAo6frBQVidKaNrzGheJeE8uXadiRWRU0Q",
  authDomain: "lifeforge-c4f74.firebaseapp.com",
  projectId: "lifeforge-c4f74",
  storageBucket: "lifeforge-c4f74.appspot.com",
  messagingSenderId: "107308569951",
  appId: "1:107308569951:web:99c7c02d911d4ea760d2ea",
  measurementId: "G-SKCHFMJSJR"
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


export { app, auth, analytics };
