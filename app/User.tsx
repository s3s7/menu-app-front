import { auth } from "./firebase";


//ユーザ情報
export default function UserInfo() {
  return
  (
    <div className="userInfo">
      <img src={auth.currentUser.photoURL} alt="" />
      {/* <Image src={auth.currentUser.photoURL} alt="" /> */}

      <p>{auth.currentUser.displayName}</p>
    </div>
  );
}
// export default UserInfo;
// import { signInWithPopup } from 'firebase/auth'
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, provider } from "./firebase";

// // export default function Home() {
// function Home() {
//   const [user] = useAuthState(auth);
//   return (
//     <div>
//       {
//         user ? (
//           <>
//             <UserInfo />
//             < SignOutButton />
//           </>
//         ) : (

//           // )}
//           <SignInButton />
//         )
//       }
//     </div>
//   );
// }


// //サインイン
// function SignInButton() {
//   const signInWithGoogle = () => {
//     //firebaseを使ってGoogleでサインインする
//     signInWithPopup(auth, provider);
//   };


//   return (
//     <button onClick={signInWithGoogle} >
//       <p>Googleでサインイン </p>
//     </button >
//   );
// }

// //サインアウト
// function SignOutButton() {
//   return (
//     <button onClick={() => auth.signOut()
//     }>
//       <p>サインアウト </p>
//     </button>
//   );
// }

// //サインアウト
// function UserInfo() {
//   return
//   (
//     <div className="userInfo">
//       <img src={auth.currentUser.photoURL} alt="" />
//       {/* <Image src={auth.currentUser.photoURL} alt="" /> */}

//       <p>{auth.currentUser.displayName}</p>
//     </div>
//   );
// }
