import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlnYATwfKDHrUyQSJ7gUigkOyHFFRc4Ng",
  authDomain: "car-parking-lots.firebaseapp.com",
  projectId: "car-parking-lots",
  storageBucket: "car-parking-lots.firebasestorage.app",
  messagingSenderId: "165903474711",
  appId: "1:165903474711:web:88c389c1ff445df403bc52",
  measurementId: "G-E0YGL7TZ22"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;