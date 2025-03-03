import { useEffect } from "react";

const NativeAd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = "//pl25996480.effectiveratecpm.com/44d1bad88bf903007057beab330f90a1/invoke.js";
    document.body.appendChild(script);
  }, []);

  return <div id="container-44d1bad88bf903007057beab330f90a1"></div>;
};

export default NativeAd;
