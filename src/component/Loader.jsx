import animationData from "../assets/svg/loader.json";
import Lottie from "lottie-react";
import { useRef } from "react";
import { useEffect } from "react";

const Loader = () => {
    const animationRef = useRef()
    useEffect(() => {
        animationRef.current.setSpeed(2);
      }, []);
    return (
        <div className="bg-black flex items-center justify-center fixed top-0 right-0 left-0 bottom-0 mx-auto z-50">
          <Lottie animationData={animationData} lottieRef={animationRef} />
        </div>
      );
}

export default Loader
