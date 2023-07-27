import { useState,useEffect } from "react";
import { Spinner } from "@material-tailwind/react";
import {
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { TbEdit } from "react-icons/tb";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { auth } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import { updateProfile,updateEmail } from "firebase/auth";

export default function EditUserInfo() {
  const [open, setOpen] = useState(false);
  const [submiting, setSubmiting] = useState(false);
  //   ----------------open edit popup
  const handleOpen = () => setOpen((cur) => !cur);

  //   --------initialValues------------------

  const initialValues = {
    name: auth.currentUser.displayName,
    Email: auth.currentUser.email,
  };

  // --------validationSchema
  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[^-\s][a-zA-Z0-9_\s-]{3,19}$/, "4 element at least, 20 max")
      .required("this field can not be empty"),
    Email: Yup.string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "invalid Email")
      .required("this field can not be empty"),
  });
  

  // -------------------------submiting changes
  const updateUserInfo =  async(values, { resetForm }) => {
    try {
      setSubmiting(true)
      // update profile name
      await updateProfile(auth.currentUser,{
        displayName : values.name,
      })
      // update profil Email
      await updateEmail(auth.currentUser ,
        values.Email)
      // update user info of fireStore
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        name: values.name,
        email : values.Email
      });
      setSubmiting(false)
      resetForm({ values: "" });
      handleOpen()
      toast.success("profile name changed");
    } catch (err) {
      setSubmiting(false)
      handleOpen()
      console.log(JSON.stringify(err))
      if (JSON.stringify(err).includes("auth/network-request-failed")) {
        toast.error("terrible connection");
      }
      else {
        toast.error("something went wrong");
      }
    }
  };

  return (
    <>
      <TbEdit
        onClick={handleOpen}
        className="text-[24px] absolute right-0 top-0 cursor-pointer"
      />
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          {/* <CardHeader> */}
          <Typography className="mx-auto text-[30px]" color="black">
            user information
          </Typography>
          {/* </CardHeader> */}
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={updateUserInfo}
          >
            <Form>
              <CardBody className="flex flex-col gap-4">
                <div className=" w-full h-fit rounded-md">
                  <p className="text-red-500 h-fit text-[14px] font-bold  ml-[5px] self-start ">
                    <ErrorMessage name="name" />
                  </p>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="name"
                    className="p-[10px] mx-auto w-full outline-none text-white bg-[#334155]  rounded-md"
                  />
                </div>
                <div className=" w-full h-fit rounded-md">
                  <p className="text-red-500 h-fit text-[14px] font-bold  ml-[5px] self-start ">
                    <ErrorMessage name="Email" />
                  </p>
                  <Field
                    type="text"
                    name="Email"
                    id="Email"
                    placeholder="Email"
                    className="p-[10px] mx-auto w-full outline-none text-white bg-[#334155]  rounded-md"
                  />
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                <button
                  disabled={submiting ? true : false}
                  type="submit"
                  className="bg-blue-600 disabled:bg-blue-300 flex justify-center items-center gap-2 select-none mx-auto  w-[100%]  mt-[!0px] p-[10px] text-white text-[18px] font-semibold hover:bg-blue-500 rounded-md "
                >
                  {submiting ? (
                    <Spinner className="w-6" color="blue" />
                  ) : (
                    "update"
                  )}
                </button>
              </CardFooter>
            </Form>
          </Formik>
        </Card>
      </Dialog>
    </>
  );
}
