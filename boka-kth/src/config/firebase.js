import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default function App(){

}
const firebaseConfig = {
    apiKey: "AIzaSyBBBYQgVdtO7vS-OsTUL_F2IhldRXjnUNc",
    authDomain: "boka-room.firebaseapp.com",
    projectId: "boka-room",
    storageBucket: "boka-room.appspot.com",
    messagingSenderId: "47166798536",
    appId: "1:47166798536:web:68e73733fa5990ec9603fd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
    auth,
    db
};