// import { Sign } from 'crypto';
import { initializeApp, getApps, getApp } from 'firebase/app'
// import initializeApp from 'firebase/app'

import { getAuth, signInWithPopup } from 'firebase/auth'
import { GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Firebaseの認証情報を設定
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}


// Firebaseの初期化＆Appオブジェクトの作成
// const getFirebaseApp = () => {
//   if (getApps().length === 0) {
//     return initializeApp(firebaseConfig)
//   } else {
//     return getApp()
//   }
// }

// const app = getFirebaseApp();
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

// FirebaseAppに関連するAuthインスタンスを取得
const auth = getAuth(app);
export { auth, provider };


