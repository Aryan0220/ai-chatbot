import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDsAWWS68IHkSSP-N2MlpEkSgbd4utMyRU",
  authDomain: "ai-chatbot-28c72.firebaseapp.com",
  projectId: "ai-chatbot-28c72",
  storageBucket: "ai-chatbot-28c72.appspot.com",
  messagingSenderId: "365626180868",
  appId: "1:365626180868:web:d5cc11e5281bfcab19bc51",
  measurementId: "G-WM1SS1W80X"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const emailProvider = new EmailAuthProvider();

export { auth, googleProvider, emailProvider };