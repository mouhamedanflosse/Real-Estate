import { useState } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/svg/27516-house-animations.json";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

const ForgetPassword = () => {
  // ----------------submiting state
 const [submiting, setSubmiting] = useState(false);

//  -----------------initialValues  
  const initialValues = {
    Email: "",
  };

  //  -----------------validationSchema  
  const validationSchema = Yup.object({
    Email: Yup.string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "invalid Email")
      .required("this field can not be empty"),
  });



  const resetPassword = async (values, { resetForm }) => {
    try{
      setSubmiting(true)
      await sendPasswordResetEmail(auth,values.Email)
      resetForm({values : ""})
      setSubmiting(false)
      toast.success("check your Email")
    }
    catch (err) {
      setSubmiting(false)
      console.log(JSON.stringify(err))
      if (JSON.stringify(err).includes("auth/network-request-failed")) {
        toast.error("terrible connection");
      }
      else if (JSON.stringify(err).includes("auth/user-not-found")) {
        toast.error("incorrect email");
      }
    }
  }
  return (
    <div className="relative mt-[80px]">
      <Link to="/sign-up">
        <div className="w-fit absolute -top-[50px] right-5 p-2 btn cursor-pointer select-none border-2 border-[#1111a7] text-[#1111a7] rounded-md font-semibold ">
          register
        </div>
      </Link>
      <div className="max-w-6xl mx-auto flex gap-6 justify-center items-center ">
        <Lottie
          className="w-[50%] hidden Xmd:block"
          animationData={animationData}
        />
        <div className="grow">
          <h1 className="text-[30px] mb-7 mx-auto w-fit font-bold text-blue-700 px-1 rounded-sm">
            Reset Password
          </h1>
          <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={resetPassword}
          >
            <Form className="flex flex-col items-center gap-1 w-fit mx-auto ">
              <p className="text-red-500 h-fit text-[14px] font-bold  ml-[5px] self-start ">
                <ErrorMessage name="Email" />
              </p>
              <div className=" w-[300px] relative sm:w-[400px] rounded-md bg-[#334155]">
                <Field
                  type="text"
                  name="Email"
                  id="Email"
                  placeholder="Email"
                  className="co p-[10px] w-[90%] mx-auto outline-none text-white bg-[#334155] rounded-md"
                />
              </div>
              <Link to="/sign-in" className="self-start pl-[10px] select-none">
                <p className="cursor-pointer text-lg text-blue-500">
                  sign in instead ?{" "}
                </p>
              </Link>
              <button
                disabled={submiting ? true : false}
                type="submit"
                className="bg-blue-600 disabled:bg-blue-300 flex justify-center items-center gap-2 select-none mx-auto Xsm:w-[400px] w-[300px]  mt-[!0px] p-[10px] text-white text-[18px] font-semibold hover:bg-blue-500 rounded-md "
              >
                {submiting ? (
                  <Spinner className="w-6" color="blue" />
                ) : (
                "Reset password"
                )}
              </button>
              {/* <div className=""  >
                <p className=" font-semibold ">or</p>
              </div> */}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
