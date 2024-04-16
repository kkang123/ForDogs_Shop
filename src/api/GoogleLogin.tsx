import { useEffect } from "react";
import { auth, db } from "@/firebase";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const signInWithGoogleRedirect = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  signInWithRedirect(auth, provider);
};

const SignIn = () => {
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const user = result.user;

          await setDoc(
            doc(db, "users", user.uid),
            {
              email: user.email,
              nickname: user.displayName || "익명",
              createdAt: Timestamp.fromDate(new Date()),
              updatedAt: Timestamp.fromDate(new Date()),
              isSeller: false,
            },
            { merge: true }
          );
          console.log(result.user);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <button
        onClick={signInWithGoogleRedirect}
        className="mt-8 p-2 w-full flex justify-center border-2 border-blue-300 rounded-lg hover:bg-blue-300"
        aria-label="Google로 리디렉션으로 로그인"
      >
        Google Login
      </button>
    </div>
  );
};

export default SignIn;
