import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const useAuthStatus = () => {
  const [logedIn, setLogedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogedIn(true);
      }
      setChecking(false);
    });
  }, []);
  return {logedIn,checking};
};

export default useAuthStatus;
