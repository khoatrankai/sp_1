import React from "react";
import ReactPlayer from "react-player";
import "./ProductSell.scss";
// import HeaderTTKbuy from "./HeaderTTKbuy/HeaderTTKbuy";
const HeaderTTKbuy = dynamic(
  () => import("@/components/Page/Sell/HeaderTTKbuy/HeaderTTKbuy"),
  { ssr: false }
);
const BodyProductSell = dynamic(
  () => import("@/components/Page/Sell/BodyProductSell/BodyProductSell"),
  { ssr: false }
);
const ListProductSell = dynamic(
  () => import("@/components/Page/Sell/ListProductSell/ListProductSell"),
  { ssr: false }
);
const FooterProductSell = dynamic(
  () => import("@/components/Page/Sell/FooterProductSell/FooterProductSell"),
  { ssr: false }
);
import dynamic from "next/dynamic";
function ProductSell() {
  const videourl = "videos/introip.mp4";
  // window.addEventListener('scroll', () => {
  //     if (window.pageYOffset < 738) {
  //         setvideourl('/videos/introip.mp4');
  //     } else {
  //         setvideourl('/videos/quang.mp4');
  //     }
  // });
  return (
    <div className="ttkbuy">
      <HeaderTTKbuy />
      <div className="body-ttkbuy">
        <BodyProductSell />
        <ListProductSell />
        <div className="main-img-model">
          <ReactPlayer
            url={videourl}
            playing={true}
            loop={true}
            muted={true}
            width="100%"
            height="100%"
            className="react-player-productsell"
          />
        </div>
        <FooterProductSell />
      </div>
    </div>
  );
}

export default ProductSell;
