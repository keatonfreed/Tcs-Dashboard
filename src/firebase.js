import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyDeyXHjdlr8hyZn2oTS5Xkpdr1sXt6-4oc",
    authDomain: "tcs-dash.firebaseapp.com",
    projectId: "tcs-dash",
    storageBucket: "tcs-dash.appspot.com",
    messagingSenderId: "923783575401",
    appId: "1:923783575401:web:bd70813743dfada1e62ff8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);