// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAydJedGMiWYzy7fUKgHLWxRzuunmAmsIg",
  authDomain: "togyzkumalak-467e4.firebaseapp.com",
  projectId: "togyzkumalak-467e4",
  storageBucket: "togyzkumalak-467e4.firebasestorage.app",
  messagingSenderId: "316207718358",
  appId: "1:316207718358:web:1ed1800b8e7920f0ad8e77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
