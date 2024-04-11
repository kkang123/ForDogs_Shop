import { auth, db } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        await setDoc(
          doc(db, 'users', user.uid),
          {
            email: user.email,
            nickname: user.displayName || '익명',
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
            isSeller: false,
          },
          { merge: true }
        );
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="mt-8 p-2 w-full flex justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-300"
      aria-label="Google로 로그인"
    >
      Google Login
    </button>
  );
};

export default SignIn;
