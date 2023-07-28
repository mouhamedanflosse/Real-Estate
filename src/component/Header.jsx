import logo from "../images/logo.jpg"
import { useLocation,useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../config/firebase"

const Header = () => {
  const [pagePath,setPagePath] = useState()
  useEffect(() => {
    onAuthStateChanged(auth,(user) => {
      if (user) {
        setPagePath("profile")
      }
      else {
        setPagePath("sign-in")
      }
    })
  },[auth])
  const navigate = useNavigate()
  const location = useLocation()
  function getLocation(route) {
    if (route === location.pathname) {
      return true
    }
  }
  return (
    <div className="bg-white w-full sticky z-50 top-0">
    <div className="header shadow-sm border-b-1 flex mx-auto justify-between max-w-6xl Xsm:px-[40px] px-3 items-center">
        <img onClick={() => navigate("/")} src={logo} alt="real Estate" className="w-[80px] cursor-pointer" />
        <ul className="flex space-x-10">
            <li className={`cursor-pointer select-none text-[16px]
          ${getLocation("/") && "active font-bold" }`}
          onClick={() => navigate("/")}>home</li>
            <li className={`cursor-pointer select-none text-[16px]
          ${getLocation("/offers") && "active font-bold" }`}
          onClick={() => navigate("/offers")}>offers</li>
            <li className={`cursor-pointer select-none text-[16px]
          ${getLocation(`/${pagePath}`) && "active font-bold" }`}
          onClick={() => navigate(`/${pagePath}`)}>{pagePath}</li>
        </ul>
    </div>
    </div>
  )
}

export default Header
