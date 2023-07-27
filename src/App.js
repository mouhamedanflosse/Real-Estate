import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import ForgetPassword from "./pages/ForgetPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import Privateroute from "./component/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Category from "./pages/category";

function App() {
  return (
    <ThemeProvider>
      <div>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-In" element={<SignIn />} />

            {/* ----------private Route */}
            <Route path="/profile" element={<Privateroute/>}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* ------------------------------ */}
            <Route path="/create-listing" element={<Privateroute/>}>
            <Route path="/create-listing" element={<CreateListing />} />
            </Route>
            {/* ------------------------------ */}
            <Route path="/category/:categoryName/:listingId" element={<Listing />} />
            <Route path="/category/:categoryName" element={<Category />} />
            {/* ------------------------------ */}
            <Route path="/edit-listing" element={<Privateroute/>}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
            </Route>
           {/* ------------------------------------------------*/}
            <Route path="/offers" element={<Offers />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </Routes>
          <ToastContainer
            toastClassName="w-[200px] h-[20px] mx-auto -translate-y-[20px] Xsm:translate-y-0 sm:w-[220px] text-[14px]"
            position="bottom-center"
            autoClose={2000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
           pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
