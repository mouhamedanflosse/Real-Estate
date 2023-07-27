import user from "../images/user.png";
import EditUserInfo from "../component/EditUserInfo";
import Signout from "../component/Signout";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FaHome } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import ListingItems from "../component/ListingItems";
import { motion } from "framer-motion";
import {toast} from "react-toastify"

function Profile() {
  // -------------initialize useNavigate
  const navigate = useNavigate();
  //-------------------listings state
  const [listings, setListings] = useState([]);

  // ---------------------------fetch listings
  const fetchUserListing = async () => {
    const listingRef = collection(db, "listings");
    const Q = query(
      listingRef,
      where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const querySnap = await getDocs(Q);
    let listings = [];
    querySnap.forEach((listing) => {
      return listings.push({
        id: listing.id,
        data: listing.data(),
      });
    });
    setListings(listings);
  };
  useEffect(() => {
    fetchUserListing();
  }, []);
  // -------------------------------delete listing item
  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db,"listings",id))
      fetchUserListing()
    } catch (err) {
      console.log(err)
      if (JSON.stringify(err).includes("auth/network-request-failed")) {
        toast.error("terrible connection");
      } else {
        toast.error("something went wrong");
      }
    }
  }
  // -------------------------------edit listing item
  const onEdite = async (id) => {
    navigate(`/edit-listing/${id}`)
  }

  return (
    <div>
      <div className="w-[200px] mx-auto relative">
        <EditUserInfo />
        <img className="w-[80px] mx-auto rounded-[50%] mt-3" src={auth.currentUser?.photoURL ? auth.currentUser?.photoURL : user} referrerPolicy="no-referrer" alt="user" />
        <h1 className="font-bold  flex justify-center items-center text-[19px] gap-1">
          {auth.currentUser?.displayName}
        </h1>
        <Signout />
      </div>
      <div>
        <Button
          onClick={() => navigate("/create-listing")}
          size="lg"
          className="group mt-10 bg-blue-800 hover:bg-blue-700 hover:shadow-none shadow-none relative mx-auto flex items-center gap-3 overflow-hidden pr-[72px]"
        >
          list your home
          <span className="absolute right-0 grid h-full w-12 place-items-center">
            <FaHome className="text-[20px]" />
          </span>
        </Button>
      </div>
      <h1 className="text-center text-[50px] mt-[30px] mb-9 font-light">My Listing</h1>
      <div className="px-[40px] flex flex-wrap gap-8">
          {listings.map((listing,index) => (
            <motion.div
            transition={{delay : 0.1 * index}}
            initial={{opacity : 0, y : 30}}
            animate={{opacity : 1, y : 0}}
            exit={{opacity: 0, y : 30}}
            key={listing.id}
            className="mx-auto"
            >
            <ListingItems
              onDelete={() => onDelete(listing.id)}
              onEdite={() => onEdite(listing.id)}
              listing={listing.data}
              id={listing.id}
            />
            </motion.div>
          ))}
      </div>
    </div>
  );
}

export default Profile;
