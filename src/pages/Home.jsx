import { useEffect, useState } from "react";
import Slider from "../component/Slider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { BiRightArrowAlt } from "react-icons/bi";
import Loader from "../component/Loader";
import { motion } from "framer-motion";

function Home() {
  // -------------- offer listing
  const [offerListing, setOfferListing] = useState("");
  // -------------- Rent listing
  const [RentListing, setRentListing] = useState("");

  // -------------- Rent listing
  const [SellListing, setSellListing] = useState("");

  // ----fetching offer listing
  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const Q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(Q);
        let listings = [];
        querySnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setOfferListing(listings);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOfferListing();
  }, []);
  // ----fetching sell listing
  useEffect(() => {
    const fetchSellListing = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const Q = query(
          listingsRef,
          where("rentOrSell", "==", "sell"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(Q);
        let listings = [];
        querySnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setSellListing(listings);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSellListing();
  }, []);
  // ----fetching Rent listing
  useEffect(() => {
    const fetchRentListing = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const Q = query(
          listingsRef,
          where("rentOrSell", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(Q);
        let listings = [];
        querySnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setRentListing(listings);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRentListing();
  }, []);
  return !offerListing || !SellListing || !RentListing ? (
    <Loader />
  ) : (
    <>
      <Slider />
      <div className="m-7">
        <div className="flex max-w-6xl justify-between items-center">
          <h1 className="text-[29px] font-semibold">Recent offers</h1>
          <Link to="/offers">
            <p className="text-blue-500 text-[18px] flex items-center font-semibold hover:text-blue-400 ">
              more
              <BiRightArrowAlt className="pt-1 text-[25px]" />
            </p>
          </Link>
        </div>
        <div className="flex justify-center gap-5 flex-wrap mt-3">
          {offerListing.map((offer, index) => (
              <motion.div
              transition={{delay : 0.2 * index}}
              initial={{opacity : 0, y : 30}}
              animate={{opacity : 1, y : 0}}
              exit={{opacity: 0, y : 30}}
              key={offer.id}
              className="max-w-[200px] overflow-hidden cursor-pointe"
              >
            <Card
            >
              <Link
                className="mx-auto"
                to={`/category/${offer.data.rentOrSell}/${offer.id}`}
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="m-0 w-full h-[130px] rounded-none"
                >
                  <img
                    className="w-full h-full"
                    src={offer.data.imgUrls[0]}
                    alt={offer.data.title}
                  />
                </CardHeader>
                <CardBody className="p-4 py-1 ">
                  <Typography className="text-right font-semibold text-blue-700">
                    <Moment fromNow>{offer.data.timestamp?.toDate()}</Moment>
                  </Typography>
                  <div className="h-[50px]">
                    <p className="text-ellipsis line-clamp-2 text-[18px] font-bold">
                      {offer.data.title}
                    </p>
                  </div>
                  <p className="text-[20px] mt-1 text-red-900 font-semibold">
                    $
                    {offer.data.discount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {offer.data.rentOrSell === "rent" ? (
                      <span className="text-[16px] font-bold ml-2">
                        /Mounth
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                </CardBody>
              </Link>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
      {/* ----------------------Recent sell */}
      <div className="m-7">
        <div className="flex max-w-6xl justify-between items-center">
          <h1 className="text-[29px]  font-semibold">places for sell</h1>
          <Link to="/category/sell">
            <p className="text-blue-500 text-[18px] flex items-center font-semibold hover:text-blue-400 ">
              more
              <BiRightArrowAlt className="pt-1 text-[25px]" />
            </p>
          </Link>
        </div>
        <div className="flex justify-center gap-5 flex-wrap mt-3">
          {SellListing.map((offer) => (
            <Card
              key={offer.id}
              className="max-w-[200px] overflow-hidden cursor-pointer"
            >
              <Link
                className="mx-auto"
                to={`/category/${offer.data.rentOrSell}/${offer.id}`}
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="m-0 w-full h-[130px] rounded-none"
                >
                  <img
                    className="w-full h-full"
                    src={offer.data.imgUrls[0]}
                    alt={offer.data.title}
                  />
                </CardHeader>
                <CardBody className="p-4 py-1">
                  <Typography className="text-right font-semibold text-blue-700">
                    <Moment fromNow>{offer.data.timestamp?.toDate()}</Moment>
                  </Typography>
                  <div className="h-[50px]">
                    <p className="text-ellipsis line-clamp-2 text-[18px] font-bold">
                      {offer.data.title}
                    </p>
                  </div>
                  {offer.data.offer ? (
                    <div className="flex mb-2 translate-y-2 gap-3">
                      <p className="text-[20px] text-blue-900 font-semibold">
                        $
                        {offer.data.discount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {offer.data.rentOrSell === "rent" ? (
                          <span className="text-[16px] font-bold ml-2">
                            /Mounth
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[20px] mb-2 translate-y-2 text-blue-900 font-semibold">
                      $
                      {offer.data.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      {offer.data.rentOrSell === "rent" ? (
                        <span className="text-[16px] font-bold ml-2">
                          /Mounth
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  )}
                </CardBody>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      {/* ----------------------Recent Rent */}
      <div className="m-7">
        <div className="flex max-w-6xl justify-between items-center">
          <h1 className="text-[29px]  font-semibold">places for Rent</h1>
          <Link to="/category/rent">
            <p className="text-blue-500 text-[18px] flex items-center font-semibold hover:text-blue-400 ">
              more
              <BiRightArrowAlt className="pt-1 text-[25px]" />
            </p>
          </Link>
        </div>
        <div className="flex justify-center gap-5 flex-wrap mt-3">
          {RentListing.map((offer) => (
            <Card
              key={offer.id}
              className="max-w-[200px] overflow-hidden cursor-pointer"
            >
              <Link
                className="mx-auto"
                to={`/category/${offer.data.rentOrSell}/${offer.id}`}
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="m-0 w-full h-[130px] rounded-none"
                >
                  <img
                    className="w-full h-full"
                    src={offer.data.imgUrls[0]}
                    alt={offer.data.title}
                  />
                </CardHeader>
                <CardBody className="p-4 py-1">
                  <Typography className="text-right font-semibold text-blue-700">
                    <Moment fromNow>{offer.data.timestamp?.toDate()}</Moment>
                  </Typography>
                  <div className="h-[50px]">
                    <p className="text-ellipsis line-clamp-2 text-[18px] font-bold">
                      {offer.data.title}
                    </p>
                  </div>
                  {offer.data.offer ? (
                    <div className="flex mb-2 translate-y-2 gap-3">
                      <p className="text-[20px] text-blue-900 font-semibold">
                        $
                        {offer.data.discount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {offer.data.rentOrSell === "rent" ? (
                          <span className="text-[16px] font-bold ml-2">
                            /Mounth
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[20px] translate-y-2 text-blue-900 font-semibold">
                      $
                      {offer.data.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      {offer.data.rentOrSell === "rent" ? (
                        <span className="text-[16px] font-bold ml-2">
                          /Mounth
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  )}
                </CardBody>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
