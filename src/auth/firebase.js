import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAVPjuJBSnRI31OaDeRIGtvYcgRubdaHFg",
    authDomain: "bookmyevent-2d1e9.firebaseapp.com",
    projectId: "bookmyevent-2d1e9",
    storageBucket: "bookmyevent-2d1e9.appspot.com",
    messagingSenderId: "67971930501",
    appId: "1:67971930501:web:343ca5df0c0661fcc98cec"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;