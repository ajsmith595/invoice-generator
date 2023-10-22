import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzqg9eeSOdz1OKCzxUgc0bWRFTCesoivY",
  authDomain: "invoice-generator-93275.firebaseapp.com",
  projectId: "invoice-generator-93275",
  storageBucket: "invoice-generator-93275.appspot.com",
  messagingSenderId: "669475880772",
  appId: "1:669475880772:web:1606db0efcfd9391646111",
  measurementId: "G-9TVMN7XFJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export default app;
export {analytics, db, auth};