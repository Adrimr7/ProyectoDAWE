import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-FVratym35SmLtUl0R5iEmvRpZ6oJfKU",
  authDomain: "dawe-8cc3d.firebaseapp.com",
  projectId: "dawe-8cc3d",
  storageBucket: "dawe-8cc3d.firebasestorage.app",
  messagingSenderId: "599626439744",
  appId: "1:599626439744:web:b70b0bb30127cdf561d3a5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
