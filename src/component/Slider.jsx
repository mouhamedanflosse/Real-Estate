import { Carousel, IconButton } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import Loader from "../component/Loader";
import { useNavigate } from "react-router-dom";

export default function Slider() {
  // -----------------initialize useNavigate
  const navigate = useNavigate("");
  // --------------------listing
  const [listing, setListing] = useState();
  // ------fetching imagesö
  useEffect(() => {
    const fetchingData = async () => {
      const docRef = collection(db, "listings");
      const Q = query(docRef, orderBy("timestamp", "desc"), limit(5));
      const data = await getDocs(Q);
      const listings = [];
      data.forEach((doc) => {
        listings.push({
          data: doc.data(),
          id: doc.id,
        });
      });
      setListing(listings);
    };
    fetchingData();
  }, []);
  return !listing ? (
    <Loader />
  ) : (
    <div className="w-full h-[45vh] relative">
      <Carousel
        autoplay={true}
        loop={true}
        prevArrow={({ handlePrev }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={handlePrev}
            className="!absolute  top-2/4 -translate-y-2/4 left-4"
          >
            <ArrowLeftIcon strokeWidth={2} className="w-6 h-6" />
          </IconButton>
        )}
        nextArrow={({ handleNext }) => (
          <IconButton
            variant="text"
            color="white"
            size="lg"
            onClick={handleNext}
            className="!absolute top-2/4 -translate-y-2/4 !right-4"
          >
            <ArrowRightIcon strokeWidth={2} className="w-6 h-6" />
          </IconButton>
        )}
        className="h-full relative w-full select-none bg-[#3e4652]"
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute p-2 bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "bg-white w-8" : "bg-white/50 w-4"
                }`}
                onClick={() => {
                  setActiveIndex(i);
                }}
              />
            ))}
          </div>
        )}
      >
        {listing.map((img, index) => (
          <div
            key={index}
            className="h-full relative select-none   bg-center rounded-md object-cover mx-auto"
          >
            <img
              alt={img.title}
              src={img.data.imgUrls[0]}
              className="h-full select-none w-full cursor-pointer bg-center rounded-md object-cover mx-auto"
              onClick={() =>
                navigate(`/category/${img.data.rentOrSell}/${img.id}`)
              }
            />

            {img.data.offer ? (
              <div className="flex absolute top-5 left-3 z-30 bg-blue-600 rounded-md p-[10px]  gap-3">
                <p className="text-[20px] text-white font-semibold">
                  $
                  {img.data.discount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {img.data.rentOrSell === "rent" ? (
                    <span className="text-[16px] font-bold ml-2">/Mounth</span>
                  ) : (
                    ""
                  )}
                </p>
                <p className="text-[16px] font-bold self-end line-through  text-gray-800 decoration-2">
                  $
                  {img.data.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
              </div>
            ) : (
              <p className="text-[20px] flex absolute p-[10px] top-5 left-3 z-30 rounded-md bg-blue-600 text-white p- font-semibold">
                $
                {img.data.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                {img.data.rentOrSell === "rent" ? (
                  <span className="text-[16px] mt-1 font-bold ml-2">
                    /Mounth
                  </span>
                ) : (
                  ""
                )}
              </p>
            )}
            <p className="absolute bottom-1 left-3 z-30 bg-blue-600 rounded-md p-[10px]  text-white">
              {img.data.title}
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
