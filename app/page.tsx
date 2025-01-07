"use client";
import React, { useState, useEffect } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from "./firebase";
import UserInfo from "./User";
import {
  MENU_INDEX_PAGE_TITLE,
  MENU_INDEX_PAGE_DESC
} from './constants/constants';
// import { useAuthState } from "react-firebase-hooks/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Meta } from './components/Meta';
import { useAuthContext } from './context/AuthContext';
import { MenuFilter } from './components/MenuFilter';
import { Pagination } from './components/Pagination'
import { MenuCard } from './components/MenuCard'

// type Post = {
//   id: number;
//   title: string;
// };

export default function Homes() {
  const {
    currentUser,
    dbMenusData,
    authLoading,
    filteredData,
    setFilteredData,
  } = useAuthContext()

  const [pageNumber, setPageNumber] = useState(0)
  const itemsPerPage = 12
  const pagesVisited = pageNumber * itemsPerPage

  useEffect(() => {
    if (dbMenusData) {
      setPageNumber(0)
      setFilteredData(dbMenusData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbMenusData])



  // function Home() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {
        user ? (
          <>
            <UserInfo />
            <SignOutButton />
          </>
        ) : (

          // )}
          <>
            <Meta pageTitle={MENU_INDEX_PAGE_TITLE} pageDesc={MENU_INDEX_PAGE_DESC} />
            <>
              <SignInButton />

              <div className="p-4 space-y-4 max-w-7xl mx-auto">
                <MenuFilter dbMenusData={dbMenusData} />

                {filteredData.length === 0 && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm sm:text-base text-gray-700">
                      検索条件に一致するメニューが見つかりませんでした。
                      <br />
                      検索条件を変更してください。
                    </p>
                    {/* <Image
                      src={`${process.env.NEXT_PUBLIC_S3_OBJECT_URL}/utils/plan_not_found_playing_cat.png`}
                      alt={'旅行プランが見つからない時のボールで遊ぶ猫のイラスト'}
                      width={250}
                      height={250}
                    /> */}
                  </div>
                )}

                {filteredData.length !== 0 && (
                  <>
                    <div className="grid grid-cols-auto-fill gap-4">
                      {filteredData
                        .slice()
                        .reverse()
                        .slice(pagesVisited, pagesVisited + itemsPerPage)
                        .map((menu) => (
                          <MenuCard key={menu.id} menu={menu} />
                        ))}
                    </div>

                    <Pagination
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      itemsPerPage={itemsPerPage}
                      dataLength={filteredData.length || 0}
                    />
                  </>
                )}
              </div>
            </>
          </>
        )
      }
    </div>
  );
  //}

  //サインイン
  function SignInButton() {
    const signInWithGoogle = () => {
      //firebaseを使ってGoogleでサインインする
      signInWithPopup(auth, provider);
    };


    return (
      <button onClick={signInWithGoogle} >
        <p>Googleでサインイン </p>
      </button >
    );
  }

  //サインアウト
  function SignOutButton() {
    return (
      <button onClick={() => auth.signOut()
      }>
        <p>サインアウト </p>
      </button>
    );
  }

  // //ユーザ情報
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

  // function Homes() {
  // const [posts, setPosts] = useState<Post[]>([]);
  // const [newTitle, setNewTitle] = useState("");

  // const fetchPosts = async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  //     // const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}/posts`);
  //     if (!response.ok) {
  //       throw new Error("ログインに失敗しました");
  //     }
  //     const data = await response.json();
  //     setPosts(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
  //       //const response = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}/posts`, {

  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ title: newTitle }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("ログイン!!!!!に失敗しました");
  //     }
  //     setNewTitle("");
  //     fetchPosts();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-center p-24">
  //     <h2 className="text-3xl mb-4">記事の一覧</h2>
  //     <form onSubmit={handleSubmit} className="mt-4 mb-4">
  //       <input
  //         type="text"
  //         value={newTitle}
  //         onChange={(e) => setNewTitle(e.target.value)}
  //         placeholder="新しい投稿のタイトル"
  //         className="mr-2 p-2 border"
  //       />
  //       <button type="submit" className="p-2 bg-blue-500 text-white">
  //         投稿する
  //       </button>
  //     </form>
  //     <ul>
  //       {posts.map((post) => (
  //         <li key={post.id}>{post.title}</li>
  //       ))}
  //     </ul>
  //   </main>
  // );
}
