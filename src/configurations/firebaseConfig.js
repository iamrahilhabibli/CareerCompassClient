import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIGAlCGiwjUhjYEvsnXqR1oLmbXbdkseA",
  authDomain: "careercompass-cb73c.firebaseapp.com",
  projectId: "careercompass-cb73c",
  storageBucket: "careercompass-cb73c.appspot.com",
  messagingSenderId: "1019418603880",
  appId: "1:1019418603880:web:bb7e77d3c56837254126dd",
  measurementId: "G-GPM4585T6S",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
