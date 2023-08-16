import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/svg/27516-house-animations.json";
import OAuth from "../component/OAuth";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Spinner } from "@material-tailwind/react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
  // show password state
  const [showPassword, setshowPassword] = useState(false);

  // ----------------submiting state
  const [submiting, setSubmiting] = useState(false);

  // -------------Initialize useNavigate
  const navigate = useNavigate();

  const initialValues = {
    Email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    Email: Yup.string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "invalid Email")
      .required("this field can not be empty"),
    password: Yup.string()
      .min(8, "Must be 8 characters or more")
      .matches(
        /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*()-=_+~`'"\\|/?><.,;:])[a-zA-Z0-9!@#$%^&*()-=_+~`'"\\|/?><.,;: ]/,
        "invalid password"
      )
      .required("this field can not be empty"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      setSubmiting(true);
      const usercredentail = await signInWithEmailAndPassword(
        auth,
        values.Email,
        values.password
      );
      setSubmiting(false);
      resetForm({ values: "" });
      navigate("/profile");
    } catch (err) {
      setSubmiting(false);
      console.log(JSON.stringify(err));
      if (JSON.stringify(err).includes("auth/network-request-failed")) {
        toast.error("terrible connection");
      } else if (JSON.stringify(err).includes("auth/user-not-found")) {
        toast.error("Email is incorrect");
      } else if (JSON.stringify(err).includes("auth/wrong-password")) {
        toast.error("password is incorrect");
      }
    }
  };

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
            sign in
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="flex flex-col items-center gap-2 w-fit mx-auto ">
              <p className="text-red-500 font-bold text-[14px] translate-y-4 self-start m-[10px]">
                <ErrorMessage name="Email" />
              </p>
              <div className=" w-[300px] relative sm:w-[400px] rounded-md bg-[#334155] ">
                <Field
                  type="text"
                  name="Email"
                  id="Email"
                  placeholder="Email"
                  className="p-[10px] w-[90%] mx-auto outline-none text-white bg-[#334155]  rounded-md"
                />
              </div>
              <p className="text-red-500 font-bold text-[14px] translate-y-4 self-start mb-[10px]">
                <ErrorMessage name="password" />
              </p>
              <div className="relative w-full sm:w-[400px] rounded-md bg-[#334155]">
                <Field
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  name="password"
                  id="password"
                  className="p-[10px] mx-auto w-[90%] text-white outline-none bg-[#334155] rounded-md"
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    onClick={() => setshowPassword((show) => !show)}
                    className="cursor-pointer text-white text-[20px] absolute top-1/2 -translate-y-1/2 right-3"
                  />
                ) : (
                  <AiFillEye
                    onClick={() => setshowPassword((show) => !show)}
                    className="cursor-pointer text-white text-[20px] absolute top-1/2 -translate-y-1/2 right-3"
                  />
                )}
              </div>
              <button
                disabled={submiting ? true : false}
                type="submit"
                className="bg-blue-600 disabled:bg-blue-300 flex justify-center items-center gap-2 select-none mx-auto Xsm:w-[400px] w-[300px]  mt-[!0px] p-[10px] text-white text-[18px] font-semibold hover:bg-blue-500 rounded-md "
              >
                {submiting ? (
                  <Spinner className="w-6" color="blue" />
                ) : (
                  "sign up"
                )}
              </button>
              <Link
                to="/forget-password"
                className="self-start pl-[10px] select-none"
              >
                <p className="cursor-pointer text-lg text-blue-500">
                  forget password ?{" "}
                </p>
              </Link>
              <OAuth />
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
