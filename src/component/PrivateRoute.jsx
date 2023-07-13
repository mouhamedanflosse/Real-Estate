import { Outlet, Navigate } from "react-router-dom";
import useAuthStatus from "./useAuthStatus";
import Loader from "./Loader";


const Privateroute = () => {
  const { logedIn, checking } = useAuthStatus();
  if (checking) {
    return <Loader />
  }
  return logedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default Privateroute;
