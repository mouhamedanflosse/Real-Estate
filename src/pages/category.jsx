import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaBath, FaBed } from "react-icons/fa";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import Loader from "../component/Loader";
import { FcRefresh } from "react-icons/fc";
import { motion } from "framer-motion";

const Category = () => {
  // ------------------inintialze useParams
  const params = useParams();
  // ------------------listing listing
  const [listing, setListing] = useState("");
  // ------------------last offer
  const [lastListing, setLastListing] = useState("");
  // --------------listing end
  const [listingEnd, setListingsEnd] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const offersRef = collection(db, "listings");
        const Q = query(
          offersRef,
          where("rentOrSell", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(Q);
        const lastItem = querySnap.docs[querySnap.docs.length - 1];
        setLastListing(lastItem);
        let listings = [];
        querySnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setListing(listings);
      } catch (err) {
        console.log(err);
      }
    };
    fetchListing();
  }, []);

  // ----------------useEffect
  useEffect(() => {
    async function lastOfferCheck() {
      const coll = collection(db, "listings");
      const q = query(coll, where("rentOrSell", "==", params.categoryName));
      const snapshot = await getCountFromServer(q);
      if (listing.length === snapshot.data().count) {
        setListingsEnd(true);
      }
    }
    lastOfferCheck();
  }, [listing]);
  // fetch more offers
  const fetchMoreOffers = async () => {
    try {
      const offersRef = collection(db, "listings");
      const Q = query(
        offersRef,
        where("rentOrSell", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastListing),
        limit(8)
      );
      const querySnap = await getDocs(Q);
      const lastItem = querySnap.docs[querySnap.docs.length - 1];
      setLastListing(lastItem);
      let listings = [];
      querySnap.forEach((listing) => {
        return listings.push({
          id: listing.id,
          data: listing.data(),
        });
      });
      setListing((prevState) => [...prevState, ...listings]);
    } catch (err) {
      console.log(err);
    }
  };
  return !listing ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">
        {params.categoryName}
      </h1>
      <div className="flex flex-wrap justify-center gap-5">
        {listing.map((offer, index) => (
          <motion.div
            transition={{ delay: 0.1 * index }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            key={offer.id}
            className="max-w-[250px] overflow-hidden cursor-pointer"
          >
            <Card>
              <Link
                className="mx-auto"
                to={`/category/${offer.data.rentOrSell}/${offer.id}`}
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="m-0 h-[200px] w-full rounded-none"
                >
                  <img
                    className="w-full h-full"
                    src={offer.data.imgUrls[0]}
                    alt={offer.data.title}
                  />
                </CardHeader>
                <CardBody className="p-6 py-1">
                  <Typography className="text-right font-semibold text-blue-700">
                    <Moment fromNow>{offer.data.timestamp?.toDate()}</Moment>
                  </Typography>
                  <div className="h-[50px]">
                    <p className="text-ellipsis line-clamp-2 text-[20px] font-bold">
                      {offer.data.title}
                    </p>
                  </div>
                  <div className="h-[70px]">
                    <p className="text-ellipsis my-2 line-clamp-3 ">
                      {offer.data.discreption}
                    </p>
                  </div>
                  <div className="flex gap-3">
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
                    <p className="text-[16px] font-bold self-end line-through  text-red-900 decoration-2">
                      $
                      {offer.data.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                  </div>
                </CardBody>
              </Link>
              <CardFooter className="flex py-0 mb-2 items-center justify-between">
                <div className="flex justify-between items-center font-bold space-x-3 gap-6">
                  <div className="flex items-center gap-1 text-[18px]">
                    {offer.data.beds}
                    <FaBed />
                  </div>
                  <div className="flex items-center font-semibold gap-1 text-[18px]">
                    {offer.data.Baths}
                    <FaBath />
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      {!listingEnd && (
        <Button
          onClick={() => fetchMoreOffers()}
          variant="outlined"
          className="flex outline-none shadow-none mx-auto my-4  items-center gap-3"
        >
          show more
          <FcRefresh />
        </Button>
      )}
    </div>
  );
};

export default Category;
