import { Carousel, IconButton } from "@material-tailwind/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { useState } from "react";
import Loader from "../component/Loader";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { TbShare3 } from "react-icons/tb";
import { FaBed, FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { MdKeyboardArrowUp } from "react-icons/md";
import { toast } from "react-toastify";
import { BsFillHouseHeartFill } from "react-icons/bs";
import { Accordion, AccordionBody } from "@material-tailwind/react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Listing() {
  // --------------------listing state
  const [listing, setListing] = useState();

  // --------------------userData state
  const [userData, setUserData] = useState("");

  // --------------------message state
  const [message, setMessage] = useState("");

  // --------------------open contact
  const [open, setOpen] = useState(0);

  //  -------------------handelOpen
  const handleOpen = async (value) => {
    setOpen(open === value ? 0 : value);
  };

  // ---------initialze usePramas
  const params = useParams();
  const fetchData = async () => {
    try {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      if (docSnap.exists()) {
        setListing(data);
        const userDocRef = doc(db, "users", data.userRef);
        const UserSnap = await getDoc(userDocRef);
        if (UserSnap.exists()) {
          setUserData(UserSnap.data());
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, [params.listingId]);
  // --------copy item link
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("link copied");
    } catch (err) {
      toast.error("something went wrong");
    }
  }
  return !listing ? (
    <Loader />
  ) : (
    <>
      <div className="w-full h-[50vh] relative">
        <div className="absolute right-9 top-5 p-1 hover:bg-gray-500 cursor-pointer flex z-20 items-center justify-center rounded-[50%]">
        <TbShare3
          onClick={copyLink}
          className="  text-white  text-[20px] "
        /></div>
        <Carousel
          prevArrow={({ handlePrev }) =>
            listing.imgUrls.length > 1 && (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute top-2/4 -translate-y-2/4 left-4"
              >
                <ArrowLeftIcon strokeWidth={2} className="w-6 h-6" />
              </IconButton>
            )
          }
          nextArrow={({ handleNext }) =>
            listing.imgUrls.length > 1 && (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute top-2/4 -translate-y-2/4 !right-4"
              >
                <ArrowRightIcon strokeWidth={2} className="w-6 h-6" />
              </IconButton>
            )
          }
          className="h-full w-full select-none bg-[#3e4652]"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
              {new Array(length).fill("").map(
                (_, i) =>
                  listing.imgUrls.length > 1 && (
                    <span
                      key={i}
                      className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                        activeIndex === i ? "bg-white w-8" : "bg-white/50 w-4"
                      }`}
                      onClick={() => {
                        setActiveIndex(i);
                      }}
                    />
                  )
              )}
            </div>
          )}
        >
          {listing.imgUrls.map((img, index) => (
            <img
              key={index}
              alt={listing.title}
              src={img}
              className="h-full select-none rounded-md object-cover mx-auto"
            />
          ))}
        </Carousel>
      </div>
      <div className="max-w-6xl relative bg-white rounded-md mx-auto my-8 shadow-sm flex Xsmd:flex-row flex-col ">
        <div className=" p-4 relative flex Xsm:m-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-10">
          <div className="flex items-center gap-2 text-[20px]">
            <BsFillHouseHeartFill className=" text-red-500" />
            <h1 className="font-semibold ">{`For ${listing.rentOrSell}`}</h1>
          </div>
          { listing.offer ?
              <div className="flex mx-auto gap-3">
              <p className="text-[20px] text-blue-900 font-semibold">
                $
                {listing.discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {listing.rentOrSell === "rent" ? (
                  <span className="text-[16px] font-bold ml-2">/Mounth</span>
                ) : (
                  ""
                )}
              </p>
              <p className="text-[16px] font-bold self-end line-through  text-red-900 decoration-2">
                
                $
                {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
              </div>
              :
              <p className="text-[20px] text-blue-900 font-semibold">
              $
              {listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.rentOrSell === "rent" ? (
                <span className="text-[16px] font-bold ml-2">/Mounth</span>
              ) : (
                ""
              )}
            </p>
              }
          </div>
          <h2 className="text-[20px] ml-[10px]">{listing.title}</h2>
          <div className="ml-5">
            <div className="flex items-center font-semibold gap-3">
              <div className="flex items-center gap-1 text-[18px]">
                {listing.beds}
                <FaBed />
              </div>
              <div className="flex items-center font-semibold gap-1 text-[18px]">
                {listing.Baths}
                <FaBath />
              </div>
              <div className="flex items-center font-semibold gap-1 text-[18px]">
                {listing.parkingSpot && (
                  <span className="text-black flex items-center gap-1">
                    <FaParking /> parking Spot
                  </span>
                )}
              </div>
            </div>
            <div className="w-[250px] mb-2">
              <h1 className="font-semibold text-[20px] mb-1">discreption</h1>
              <h4>{listing.discreption}</h4>
              {listing.userRef !== auth.currentUser?.uid && (
                <Accordion open={open === 1}>
                  <h1
                    className="flex text-[20px] font-semibold cursor-pointer mt-1 ml-2 items-center"
                    onClick={() => handleOpen(1)}
                  >
                    contact{" "}
                    <MdKeyboardArrowUp
                      className={` ${
                        open === 1 ? "rotate-180 " : "rotate-0 "
                      } duration-300 `}
                    />
                  </h1>
                  <AccordionBody>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="border-2 outline-none border-gray-500 resize-none rounded-md p-[10px] w-full h-[90px]"
                      name="discreption"
                      rows="10"
                      placeholder="Message"
                    ></textarea>
                    <a
                      href={`mailto:${userData.email}?Subject=${listing.title}&body=${message}`}
                    >
                      <button
                        type="submit"
                        className="bg-blue-600 disabled:bg-blue-300 flex w-full justify-center items-center gap-2 select-none mx-auto mt-[!0px] p-[10px] text-white text-[18px] font-semibold hover:bg-blue-500 rounded-md"
                      >
                        Send Message
                      </button>
                    </a>
                  </AccordionBody>
                </Accordion>
              )}
            </div>
          </div>
        </div>
        <div className="Xsmd:w-1/2 Xsmd:my-auto Xsmd:mr-5 h-[200px] Xmd:mr-0 w-[90%] Xmd:w-full mx-auto Xmd:grow Xmd:h-[306px]">
          {" "}
          <MapContainer
            center={[listing.adress.latitude, listing.adress.longitude]}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.adress.latitude, listing.adress.longitude]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
}
