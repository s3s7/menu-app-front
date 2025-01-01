import { Sign } from 'crypto';
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, signInWithPopup } from 'firebase/auth'
import { GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Firebaseの認証情報を設定
const firebaseConfig = {
  // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSEGING_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_AMEASUREMENTID
}

function Home() {
  const [user] = useAuthState(auth);
  return (
    <div>
    {
      user?(
      <>
    <UserInfo />
    < SignOutButton />
    </>
  ): (

    // )}
    <SignInButton />
  )
}
</div>
  );
}
// Firebaseの初期化＆Appオブジェクトの作成
const getFirebaseApp = () => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig)
  } else {
    return getApp()
  }
}

const app = getFirebaseApp();
const provider = new GoogleAuthProvider();

// FirebaseAppに関連するAuthインスタンスを取得
const auth = getAuth(app);
export { auth, provider };

//サインイン
function SignInBUtton() {
  const signInWithGoogle = () => {
    //firebaseを使ってGoogleでサインインする
    signInWithPopup(auth, provider);
  };


  return (
    <button onClick= (signInWithGoogle) =>
      <p>Googleでサインイン </p>
      </button> 
  );
}

//サインアウト
function SignOutBUtton() {
  return (
    <button onClick = {() => auth.signOut()
}>
  <p>サインアウト </p>
  </button> 
  );
}

//サインアウト
function UserInfo() {
  return
  (
    <div classname= "userInfo" >
    <img src={ auth.currentUser?.photoURL } alt = "" />
      </div>
  )
}
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// //import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBkmfK0yqCe9GOiORdhnNTAPNqrAnrAWjY",
//   authDomain: "menu-app-dbbdb.firebaseapp.com",
//   projectId: "menu-app-dbbdb",
//   storageBucket: "menu-app-dbbdb.firebasestorage.app",
//   messagingSenderId: "1045247537542",
//   appId: "1:1045247537542:web:cf414be77be011c7857c07",
//   measurementId: "G-5YTPDTMSQX"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// //const analytics = getAnalytics(app);
