import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4XUvKGl0aYwZ7bm1mI0CzvI_Cl-cBBec",
  authDomain: "permisosco.firebaseapp.com",
  projectId: "permisosco",
  storageBucket: "permisosco.firebasestorage.app",
  messagingSenderId: "494067164492",
  appId: "1:494067164492:web:771b2171aadaf40f1f5be9"
};

const app = initializeApp(firebaseConfig);

// ¡Asegúrate de exportar 'db'!
export const db = getFirestore(app);