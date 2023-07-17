import { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";


export default function DeleteListingItem({Open,onDelete, onEdite,id}) {
    // ---------------------------useEffect
    useEffect(() => {
        setOpen(Open)
    },[Open])

  // --------------------------open popup
  const [open, setOpen] = useState(false);
  
  //---------------------------submitin state
  const handleOpen = () => setOpen(!open);

  //---------------------------initialize useNavigate
  const navigate = useNavigate();

  // ------------------logOut
  const Delete = async () => {
    try {
      handleOpen();
       await onDelete(id)
       toast.success("listing item deleted");
    } catch (err) {
      console.log(err)
    }
  };
  return (
    <>
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
            onClick={() => Delete()}
            className="bg-blue-600 shadow-none hover:shadow-none flex justify-center items-center gap-2 select-none  p-[12 px] text-white   hover:bg-blue-400 rounded-md "
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
