import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { FaBed } from "react-icons/fa";
import { FaBath,FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Moment from "react-moment";
import { Link } from "react-router-dom";
const ListingItems = ({ listing, id }) => {
  return (
    <Link to={`/category/${listing.rentOrSell}/${id}`}>
    <div className="p-[50px]">
      {/* --------------------- */}
      <Card className="max-w-[300px] overflow-hidden cursor-pointer">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 w-full rounded-none"
        >
          <img className="w-full" src={listing.imgUrls[0]} alt={listing.title} />
        </CardHeader>
        <CardBody className="py-2">
        <Typography className="text-right font-semibold text-blue-700">
          <Moment fromNow>{listing.timestamp?.toDate()}</Moment>
          </Typography>
          <Typography variant="h5" color="blue-gray">
            {listing.title}
          </Typography>
          <Typography variant="h6" color="gray" className="mt-3 font-normal">
            {listing.discreption}
          </Typography>
          <p className="text-[20px] text-blue-900 font-semibold">
            ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.rentOrSell === "rent" ? (
              <span className="text-[16px] font-bold ml-2">/Mounth</span>
            ) : (
              ""
            )}
          </p>
        </CardBody>
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
            <FaEdit className="cursor-pointer"/>
            <AiFillDelete className="cursor-pointer"/>
          </Typography>
        </CardFooter>
      </Card>
      {/* --------------------- */}
    </div>
    </Link>
  );
};

export default ListingItems;
