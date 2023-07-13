import { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { TbLogout } from "react-icons/tb";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signout() {
  // --------------------------open popup
  const [open, setOpen] = useState(false);

  //---------------------------submitin state

  const handleOpen = () => setOpen(!open);

  //---------------------------initialize useNavigate
  const navigate = useNavigate();

  // ------------------logOut
  const logOut = async () => {
    try {
      handleOpen();
      await signOut(auth);
      navigate("/sign-in");
    } catch (err) {
      if (JSON.stringify(err).includes("auth/network-request-failed")) {
        toast.error("terrible connection");
      } else {
        toast.error("something went wrong");
      }
    }
  };
  return (
    <>
      <button
        onClick={handleOpen}
        className="flex mt-1 select-none mx-auto items-center bg-white border border-gray-300 rounded-lg shadow-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <TbLogout className="text-[20px] mr-1 my-0" />
        <span>sign Out</span>
      </button>
      <Dialog open={open} size="xs" handler={handleOpen}>
        <DialogHeader>sure you want to log out</DialogHeader>
        {/* <DialogBody >want to log out</DialogBody> */}
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={() => logOut()}
            className="bg-blue-600 shadow-none hover:shadow-none flex justify-center items-center gap-2 select-none  p-[12 px] text-white   hover:bg-blue-400 rounded-md "
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
