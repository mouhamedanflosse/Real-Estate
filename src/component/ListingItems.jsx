import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { FaBed } from "react-icons/fa";
import { FaBath, FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Moment from "react-moment";
import { Link, useNavigate } from "react-router-dom";
import DeleteListingItem from "./DeleteListingItem";
import { useState } from "react";
const ListingItems = ({ listing, id, onDelete, onEdite }) => {
  // --------------------------open popup
  const [open, setOpen] = useState(false);

  // --------------------------initialze navigate
const navigate = useNavigate()

  //--------------------------submitin state

  const handleOpen = (e) => {
    setOpen(!open);
  };

  return (
    <>
      <DeleteListingItem onDelete={onDelete} onEdite={onEdite} Open={open} />
      <div className="hover:-translate-y-5 duration-300 translate-y-0">
        {/* --------------------- */}
        <Card className="max-w-[300px] overflow-hidden cursor-pointer">
          <Link
            className="mx-auto"
            to={`/category/${listing.rentOrSell}/${id}`}
          >
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 w-full rounded-none"
            >
              <img
                className="w-full"
                src={listing.imgUrls[0]}
                alt={listing.title}
              />
            </CardHeader>
            <CardBody className="py-2">
              <Typography className="text-right font-semibold text-blue-700">
                <Moment fromNow>{listing.timestamp?.toDate()}</Moment>
              </Typography>
              <Typography variant="h5" color="blue-gray">
                {listing.title}
              </Typography>
              <Typography
                variant="h6"
                color="gray"
                className="mt-3 font-normal"
              >
                {listing.discreption}
              </Typography>
              { listing.offer ?
              <div className="flex gap-3">
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
            </CardBody>
          </Link>
          <CardFooter className="flex py-1 items-center justify-between">
            <div className="flex justify-between items-center font-bold space-x-3 gap-6">
              <div className="flex items-center gap-1 text-[18px]">
                {listing.beds}
                <FaBed />
              </div>
              <div className="flex items-center font-semibold gap-1 text-[18px]">
                {listing.Baths}
                <FaBath />
              </div>
            </div>
            <Typography className="flex items-center gap-1 text-[20px] font-semibold text-red-700">
              <FaEdit 
              onClick={() => navigate(`/edit-listing/${id}`)}
              className="cursor-pointer" />
              <AiFillDelete
                className="cursor-pointer"
                onClick={(e) => handleOpen(e)}
              />
            </Typography>
          </CardFooter>
        </Card>
        {/* --------------------- */}
      </div>
    </>
  );
};

export default ListingItems;
