import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getStorage} from 'firebase/storage';


const creditenials = import.meta.env

const firebaseConfig = {
    apiKey: creditenials.VITE_REACT_API_KEY,
    authDomain: creditenials.VITE_REACT_AUTH_DOMAIN,
    projectId: creditenials.VITE_REACT_PROJECTID,
    storageBucket: creditenials.VITE_REACT_STORAGEBUCKET,
    messagingSenderId: creditenials.VITE_REACT_MESSAGING_SENDER_ID,
    appId: creditenials.VITE_REACT_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;