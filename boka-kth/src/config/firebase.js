import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default function App(){

}
const firebaseConfig = {
  apiKey: "AIzaSyBMlkRXHdaF-L9r5U8OD1x52CAAT1lQdYE",
  authDomain: "boka-kth.firebaseapp.com",
  projectId: "boka-kth",
  storageBucket: "boka-kth.appspot.com",
  messagingSenderId: "388518258444",
  appId: "1:388518258444:web:9d9e922ae88f7998ba4b29"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
    auth,
    db
};