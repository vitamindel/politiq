import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJW20FjqM4RnFyyPW1UPQv9866-VsLiBE",
  authDomain: "politiq-759eb.firebaseapp.com",
  projectId: "politiq-759eb",
  storageBucket: "politiq-759eb.firebasestorage.app",
  messagingSenderId: "489031486173",
  appId: "1:489031486173:web:81c02a8b8a42b9c0316934",
  measurementId: "G-F4E4Y6GN71"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;