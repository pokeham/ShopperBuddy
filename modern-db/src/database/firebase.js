import { initializeApp } from "firebase/app";
import { getAuth,setPersistence,browserSessionPersistence } from 'firebase/auth';
import 'firebase/auth';
import {getDatabase} from 'firebase/database';
import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBY-8tgkhZWTxUVx8BQI1IlQ5OKS3l_tuk",
    authDomain: "moderndb-2d1a4.firebaseapp.com",
    projectId: "moderndb-2d1a4",
    storageBucket: "moderndb-2d1a4.appspot.com",
    messagingSenderId: "224881348063",
    appId: "1:224881348063:web:0e538048da6c584298486a",
    measurementId: "G-CPR046F3BP"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth();

const database = getDatabase(app);

export { auth , database};
//export const auth = auth();
//export default firebase;