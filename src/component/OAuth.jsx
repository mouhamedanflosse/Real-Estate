import { FcGoogle } from "react-icons/fc";
import { auth, db, GoogleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  // ----------Initialize useNavigate
  const navigate = useNavigate();

  // ----------sign up with google account
  async function signUpWithGoogle() {
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/profile");
    } catch (err) {
      if (JSON.stringify(err).includes("auth/internal-error")) {
        toast.error("check your internet");
      } else if (JSON.stringify(err).includes("auth/network-request-failed")) {
        toast.error("terrible connection");
      } else {
        toast.error("something went wrong");
      }
    }
  }
  return (
    <button
      onClick={signUpWithGoogle}
      type="button"
      className="flex items-center gap-3 w-[250px] mx-auto bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      <FcGoogle className="text-[20px] mr-1 my-0" />
      <span>Continue with Google</span>
    </button>
  );
};

export default OAuth;
