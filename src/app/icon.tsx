// import Image from "next/image";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        className="font-bold"
        style={{
          fontSize: 24,
          background: "#00A9AE",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        {/* <Image
          alt=""
          src={
            "https://sparking.vn/datafiles/47931/upload/files/s-favicon-01.png"
          }
          width={100}
          height={100}
        /> */}
        S
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
