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
import { Link } from "react-router-dom";
import { db } from "../config/firebase";
import Loader from "../component/Loader";
import { FcRefresh } from "react-icons/fc";
import { motion } from "framer-motion";

function Offers() {
  // ------------------offers listing
  const [offers, setOffers] = useState("");
  // ------------------last offer
  const [lastOffer, setLastOffer] = useState("");
  // --------------listing end
  const [listingEnd, setListingsEnd] = useState(false);

  useEffect(() => {
    const fetchOffersListing = async () => {
      try {
        const offersRef = collection(db, "listings");
        const Q = query(
          offersRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const querySnap = await getDocs(Q);
        const lastItem = querySnap.docs[querySnap.docs.length - 1];
        setLastOffer(lastItem);
        let listings = [];
        querySnap.forEach((listing) => {
          return listings.push({
            id: listing.id,
            data: listing.data(),
          });
        });
        setOffers(listings);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOffersListing();
  }, []);

  // ----------------useEffect
  useEffect(() => {
    async function lastOfferCheck() {
      const coll = collection(db, "listings");
      const q = query(coll, where("offer", "==", true));
      const snapshot = await getCountFromServer(q);
      if (offers.length === snapshot.data().count) {
        setListingsEnd(true);
      }
    }
    lastOfferCheck();
  }, [offers]);
  // fetch more offers
  const fetchMoreOffers = async () => {
    try {
      const offersRef = collection(db, "listings");
      const Q = query(
        offersRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastOffer),
        limit(8)
      );
      const querySnap = await getDocs(Q);
      const lastItem = querySnap.docs[querySnap.docs.length - 1];
      setLastOffer(lastItem);
      let listings = [];
      querySnap.forEach((listing) => {
        return listings.push({
          id: listing.id,
          data: listing.data(),
        });
      });
      setOffers((prevState) => [...prevState, ...listings]);
      const coll = collection(db, "listings");
      const q = query(coll, where("offer", "==", true));
      const snapshot = await getCountFromServer(q);
      if (offers.length === snapshot.data().count) {
        setListingsEnd(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return !lastOffer ? (
    <Loader />
  ) : (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Offers</h1>
      <div className="flex flex-wrap justify-center gap-5">
        {offers.map((offer,index) => (
          <motion.div
            transition={{ delay: 0.1 * index }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            key={offer.id}
            className="max-w-[250px] overflow-hidden cursor-pointe"
            >
            <Card
            className="max-w-[250px] overflow-hidden cursor-pointe"
              >
              <Link
                className="mx-auto"
                to={`/category/${offer.data.rentOrSell}/${offer.id}`}
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="m-0 w-full h-[200px] rounded-none"
                >
                  <img
                    className="w-full h-full"
                    src={offer.data.imgUrls[0]}
                    alt={offer.data.title}
                  />
                </CardHeader>
                <CardBody className="p-6 py-2">
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
              <CardFooter className="flex p-0 px-6 pb-2 w-full items-center ">
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
}

export default Offers;
