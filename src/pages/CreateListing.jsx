import {
  CardBody,
  Tabs,
  TabsHeader,
  Radio,
  TabsBody,
  Tab,
  TabPanel,
  Card,
  Select,
  Option,
} from "@material-tailwind/react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Spinner } from "@material-tailwind/react";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const CreateListing = () => {
  // -------------------------useEffect
  useEffect(() => {
    handleLocationClick();
  }, []);
  // -----------open end switch tabs states
  const [type, setType] = useState("card");
  const [submiting, setSubmiting] = useState(false);

  // ------------------enableGeolocation
  const [GeolocationEnabled, setGeolocationEnabled] = useState(false);

  // ----------------------from inputs status
  const [title, setTitle] = useState("");
  const [RentOrSell, setRentOrSell] = useState("rent");
  const [beds, setBeds] = useState(1);
  const [Baths, setBaths] = useState(1);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [offer, setOffer] = useState(false);
  const [discreption, setDiscreption] = useState("");
  const [parkingSpot, setParkingSpot] = useState(false);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [pic, setPic] = useState();
  // -----------------initialize useNavigate
  const navigate = useNavigate();

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLatitude(latitude);
    setLongitude(longitude);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  // ------------------- picture
  function handlePhoto(e) {
    setPic(e.target.files);
  }
  const storeImage = async (image) => {
    return new Promise((resolve, rejected) => {
      const fileName = `${auth.currentUser?.uid}-${image.name}-${Math.floor(
        Math.random() * 10000000
      )}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log("error");
          rejected(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    const listingInfo = {
      title: title,
      rentOrSell: RentOrSell,
      beds: beds,
      Baths: Baths,
      parkingSpot: parkingSpot,
      adress: { latitude: latitude, longitude: longitude },
      price: price,
      discreption: discreption,
    };
    console.log(listingInfo);
    console.log(pic);
    // ------------upload the images
    const imgUrls = await Promise.all(
      [...pic].map((image) => storeImage(image))
    ).catch((err) => {
      toast.error("images not uploaded");
      console.log(err);
      console.log("sucess");
      return;
    });
    // -------------push the listing into firestore
    const fromDatalisting = {
      ...listingInfo,
      imgUrls,
      userRef: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, "listings"), fromDatalisting);
    setSubmiting(false);
    toast.success("the listing is created");
    navigate(`/category/${fromDatalisting.rentOrSell}/${docRef.id}`);
  };
  return (
    <>
      <Card className="w-full max-w-[24rem] mx-auto mt-7">
        <h1 className="text-[20px] mt-[10px] mx-auto font-bold ">
          list your home
        </h1>
        <CardBody className="pb-[10px]">
          <Tabs value={type} className="overflow-visible">
            <TabsHeader className="relative z-0 ">
              <Tab value="card" onClick={() => setType("card")}>
                home info
              </Tab>
              <Tab value="paypal" onClick={() => setType("paypal")}>
                for you
              </Tab>
            </TabsHeader>
            <TabsBody
              className="!overflow-x-hidden !overflow-y-visible"
              animate={{
                initial: {
                  x: type === "card" ? 400 : -400,
                },
                mount: {
                  x: 0,
                },
                unmount: {
                  x: type === "card" ? 400 : -400,
                },
              }}
            >
              <TabPanel value="card" className="p-0">
                <form className="mt-[20px] flex flex-col gap-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="title"
                    className="p-[5px] shadow-sm border-2 border-gray-500 mx-auto w-full bordr outline-none dark:bg-[#334155] rounded-md"
                  />
                  <Select
                    onChange={(e) => setRentOrSell(e)}
                    color="gray"
                    variant="standard"
                    label="Rent/Sell"
                  >
                    <Option value="rent" className="dark:bg-[#334155]">
                      Rent
                    </Option>
                    <Option value="sell">Sell</Option>
                  </Select>
                  <div className="flex mx-auto gap-[70px] items-center">
                    <div>
                      <input
                        value={beds}
                        type="number"
                        onChange={(e) => setBeds(e.target.value)}
                        min="1"
                        className="text-center self-end w-[60px] shadow-sm border-2 border-gray-500 outline-none rounded-md"
                      />
                      <h2 className="text-center inline ml-2">beds</h2>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={Baths}
                        onChange={(e) => setBaths(e.target.value)}
                        className="text-center self-end w-[60px] shadow-sm border-2 border-gray-500 outline-none   rounded-md"
                      />
                      <h2 className="text-center inline ml-2">baths</h2>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-bold">parking spot</h1>
                      <div className="flex gap-4">
                        <Radio
                          id="html"
                          onChange={(e) => setParkingSpot(e.target.checked)}
                          name="type"
                          label="yes"
                          checked={parkingSpot}
                        />
                        <Radio
                          id="react"
                          name="type"
                          onChange={(e) => setParkingSpot(!e.target.checked)}
                          label="no"
                          checked={!parkingSpot}
                          className="bg-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className="font-bold">Offer</h1>
                      <div className="flex gap-4">
                        <Radio
                          id="html1"
                          onChange={(e) => setOffer(e.target.checked)}
                          name="typ1e"
                          label="yes"
                          checked={offer}
                        />
                        <Radio
                          id="react1"
                          name="type1"
                          onChange={(e) => setOffer(!e.target.checked)}
                          label="no"
                          checked={!offer}
                          className="bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <h1 className="font-bold -mt-[10px]">Adress</h1>
                  {!GeolocationEnabled ? (
                    <div className="flex mx-auto -mt-[10px] gap-x-[70px] items-center">
                      <div>
                        <h2 className="text-center ml-2">longitude</h2>
                        <input
                          value={longitude}
                          type="number"
                          onChange={(e) => setLongitude(e.target.value)}
                          min="-180"
                          max="180"
                          className="text-center px-1  self-end w-[100px] shadow-sm border-2 border-gray-500 outline-none rounded-md"
                        />
                      </div>
                      <div>
                        <h2 className="text-center  ml-2">latitude</h2>
                        <input
                          type="number"
                          min="-90"
                          max="90"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          className="text-center px-1 self-end w-[100px] shadow-sm border-2 border-gray-500 outline-none   rounded-md"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="-mt-[10px] mb-0 w-full">
                      <textarea
                        className="border-2 w-full outline-none border-gray-500 resize-none rounded-md p-[10px] h-[50px]"
                        name="discreption"
                        rows="10"
                        placeholder="Adress"
                      ></textarea>
                    </div>
                  )}
                </form>
              </TabPanel>
              <TabPanel value="paypal" className="p-0">
                <form
                  onSubmit={onSubmit}
                  className="mt-[15px] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-semibold">price</h1>
                      <div className="flex gap-[15px] items-center">
                        <input
                          type="number"
                          min=""
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="text-center self-end w-[150px] shadow-sm border-2 border-gray-500 outline-none   rounded-md"
                        />
                        {offer
                          ? ""
                          : RentOrSell === "rent" && (
                              <h2 className="text-center inline ml-2">
                                $/Mounth
                              </h2>
                            )}
                      </div>
                    </div>
                    {offer ? (
                      <div>
                        <h1 className="font-semibold">discounted price</h1>
                        <input
                          type="number"
                          max={+price - 10}
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          className="text-center self-end w-[150px] shadow-sm border-2 border-gray-500 outline-none   rounded-md"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <h1 className="font-bold">the description</h1>
                  <textarea
                    className="border-2 outline-none border-gray-500 resize-none rounded-md p-[10px] h-[90px]"
                    name="discreption"
                    rows="10"
                    value={discreption}
                    onChange={(e) => setDiscreption(e.target.value)}
                    placeholder="discreption"
                  ></textarea>
                  <div>
                    <h1 className="font-bold">upload image</h1>
                    <label
                      htmlFor="formFile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <AiOutlineCloudUpload className="text-[40px] text-blue-gray-600" />
                      <input
                        className=" mt-1 mr-2 cursor-pointer outline-none w-full file:hidden rounded-sm "
                        type="file"
                        id="formFile"
                        onChange={handlePhoto}
                        multiple
                        accept=".jpg,.png,.jpeg"
                        required
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 disabled:bg-blue-300 flex w-full justify-center items-center gap-2 select-none mx-auto mt-[!0px] p-[10px] text-white text-[18px] font-semibold hover:bg-blue-500 rounded-md "
                  >
                    {submiting ? (
                      <Spinner className="w-6" color="blue" />
                    ) : (
                      "List It"
                    )}
                  </button>
                </form>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default CreateListing;
