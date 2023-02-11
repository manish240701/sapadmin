import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBr3QU54ykZvRZJoP_Dd-uqbC-U6cpPh4c",
  authDomain: "activity-points-685b8.firebaseapp.com",
  projectId: "activity-points-685b8",
  storageBucket: "activity-points-685b8.appspot.com",
  messagingSenderId: "155441502987",
  appId: "1:155441502987:web:776cddd1b6949c7a31600e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);