import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/svg/27516-house-animations.json";
import OAuth from "../component/OAuth";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";

const SingUp = () => {
  // show password state
  const [showPassword, setshowPassword] = useState(false);

  // submiting state
  const [submiting, setSubmiting] = useState(false);

  // Initialize useNavigate
  const navigate = useNavigate();

  // ----------------initialValues for the fields
  const initialValues = {
    name: "",
    Email: "",
    password: "",
    confirme: "",
  };

  // -----------------validationSchema
  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[^-\s][a-zA-Z0-9_\s-]{2,19}$/, "3 element at least, 20 max")
      .required("this field can not be empty"),
    Email: Yup.string()
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, "invalid email")
      .required("this field can not be empty"),
    password: Yup.string()
      .min(8, "Must be 8 characters or more")
      .matches(
        /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*()-=_+~`'"\\|/?><.,;:])[a-zA-Z0-9!@#$%^&*()-=_+~`'"\\|/?><.,;: ]/,
        "password must be mixed"
      )
      .required("this field can not be empty"),
    confirme: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // ------------submit addd sign up form
  const onSubmit = async (values, { resetForm }) => {
    try {
      setSubmiting(true);
      const usercredentail = await createUserWithEmailAndPassword(
        auth,
        values.Email,
        values.password
      );
      updateProfile(auth.currentUser, { displayName: values.name });
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        name: values.name,
        email: values.Email,
        timestamp: serverTimestamp(),
      });
      setSubmiting(false);
      resetForm({ values: "" });
      navigate("/");
    } catch (err) {
      setSubmiting(false);
      if (JSON.stringify(err).includes("auth/network-request-failed")) {
        toast.error("terrible connection"); 
      } else if (JSON.stringify(err).includes("auth/email-already-in-use")) {
        toast.error("this email already exist");
      }
    }
  };
  return (
    <div className="relative mt-[80px]">
      <Link to="/sign-up">
        {/* <div className="w-fit absolute -top-[50px] right-5 p-2 btn cursor-pointer select-none border-2 border-[#1111a7] text-[#1111a7] rounded-md font-semibold ">
          register
        </div> */}
      </Link>
      <div className="max-w-6xl mx-auto flex gap-6 justify-center items-center ">
        <Lottie
          className="w-[50%] hidden Xmd:block"
          animationData={animationData}
        />
        <div className="grow">
          <h1 className="text-[30px] mb-7 mx-auto w-fit font-bold text-blue-700 px-1 rounded-sm">
            sign up
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="flex flex-col items-center gap-2 w-fit mx-auto ">
              <div className="flex justify-between items-end gap-2 flex-wrap">
                <div className="w-[300px]  mx-auto Xsm:w-[190px] relative rounded-md ">
                  <p className="text-red-500 h-fit text-[14px] font-bold  ml-[5px] self-start ">
                    <ErrorMessage name="name" />
                  </p>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="full name"
                    className="p-[10px] w-full mx-auto outline-none text-white bg-[#334155] bg-de rounded-md"
                  />
                </div>
                <div className=" w-[300px] mx-auto Xsm:w-[200px] h-fit  relative rounded-md">
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
              </div>
              <div>
                <p className="text-red-500 mx-auto h-fit text-[14px] font-bold  ml-[5px] self-start ">
                  <ErrorMessage name="password" />
                </p>
                <div className="relative mx-auto Xsm:w-[400px] w-[300px] rounded-md bg-[#334155]">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="password"
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
              </div>
              <div>
                <p className="text-red-500 mx-auto  h-fit text-[14px] font-bold  ml-[5px] self-start ">
                  <ErrorMessage name="confirme" />
                </p>
                <div className="relative Xsm:w-[400px] w-[300px]  rounded-md bg-[#334155]">
                  <Field
                    type="password"
                    id="confirme"
                    name="confirme"
                    placeholder="confirme"
                    className="p-[10px] mx-auto w-[90%] text-white outline-none bg-[#334155]  rounded-md"
                  />
                </div>
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
                to="/sign-in"
                className="Xsm:self-start Xsm:m-0 mx-auto pl-[10px] select-none"
              >
                <p className="cursor-pointer  text-lg text-blue-600 font-semibold hover:text-blue-500">
                  sign in instead ?{" "}
                </p>
              </Link>
              {/* <div className=""  >
                <p className=" font-semibold ">or</p>
              </div> */}
              <OAuth />
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default SingUp;
