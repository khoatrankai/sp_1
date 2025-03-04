/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import ReactPlayer from "react-player";

import "./ListProductSell.scss";
import ListItem from "./ListItem/ListItem";

function ListProductSell() {
  const [slider_brand, set_slider_brand] = useState(0);
  const [active_brand, set_active_brand] = useState(0);
  const [startbrand, setstartbrand] = useState(false);
  useEffect(() => {
    if (active_brand != 0) {
      setstartbrand(true);
    }
  }, [active_brand]);
  useEffect(() => {
    if (active_brand != 0) {
      set_slider_brand((active_brand - 1) * -134.225);
    }
  }, [startbrand]);
  useEffect(() => {
    if (slider_brand > 0) {
      set_slider_brand(0);
    }
    if (slider_brand < (8 - 5) * -134.225 && active_brand != 0) {
      set_slider_brand((8 - 5) * -134.225);
    }
    if (slider_brand < (8 - 5) * -278.224 && active_brand === 0) {
      set_slider_brand((8 - 5) * -278.224);
    }
  }, [slider_brand]);
  return (
    <div className="bg-productsell">
      <div
        className={
          active_brand === 0
            ? "brand-product-sell"
            : "brand-product-sell active-brand"
        }
      >
        <div className="model-brand">
          <ul
            className="list-brand"
            style={
              active_brand == 0
                ? { transform: `translateX(${slider_brand}px)` }
                : { transform: `translateY(${slider_brand}px)` }
            }
          >
            <li
              className="item-brand"
              onClick={() => {
                set_active_brand(1);
              }}
            >
              <img alt="" src="/logos/logoacer.png"></img>
            </li>
            <li
              className="item-brand"
              onClick={() => {
                set_active_brand(2);
              }}
            >
              <img alt="" src="/logos/logoasus.png"></img>
            </li>
            <li className="item-brand">
              <img alt="" src="/logos/logorog.png"></img>
            </li>
            <li className="item-brand">
              <img alt="" src="/logos/logohp.png"></img>
            </li>
            <li className="item-brand">
              <img alt="" src="/logos/logodell.png"></img>
            </li>
            <li className="item-brand">
              <img alt="" src="/logos/logolenovo.png"></img>
            </li>
            <li className="item-brand">
              <img alt="" src="/logos/logoapple.png"></img>
            </li>
            <li className="item-brand">
              <img alt="" src="/logos/logomicrosoft.png"></img>
            </li>
          </ul>
        </div>
        <div
          className="back-brand"
          onClick={() => {
            if (active_brand === 0) {
              set_slider_brand(slider_brand + 278.2242857);
            } else {
              set_slider_brand(slider_brand + 134.225);
            }
          }}
        >
          <IoIosArrowBack className="icon-back-brand" />
        </div>
        <div
          className="next-brand"
          onClick={() => {
            if (active_brand === 0) {
              set_slider_brand(slider_brand - 278.2242857);
            } else {
              set_slider_brand(slider_brand - 134.225);
            }
          }}
        >
          <IoIosArrowBack className="icon-next-brand" />
        </div>
        {active_brand != 0 ? (
          <div className="content-brand">
            <ul className="list-content-brand">
              <li
                className={
                  active_brand === 2
                    ? "item-content-brand brand-asus active"
                    : "item-content-brand brand-asus"
                }
              >
                <ReactPlayer
                  url={"/videos/introasus.mp4"}
                  playing={true}
                  loop={true}
                  muted={true}
                  height="80%"
                  width="60%"
                  className="video-brand"
                />
                <h1>
                  A<br />
                  S<br />
                  U<br />S
                </h1>
                <p>Kiến tạo mạnh từ sức mạnh</p>
                <a href="#" className="btn-brand-detail">
                  Khám phá
                </a>
              </li>
              <li
                className={
                  active_brand === 1
                    ? "item-content-brand brand-acer active"
                    : "item-content-brand brand-acer"
                }
              >
                <ReactPlayer
                  url={"/videos/introacer.mp4"}
                  playing={true}
                  loop={true}
                  muted={true}
                  height="80%"
                  width="60%"
                  className="video-brand"
                />
                <h1>
                  A<br />
                  C<br />
                  E<br />R
                </h1>
                <p>Kiến tạo mạnh từ sức mạnh acer</p>
                <a href="#" className="btn-brand-detail">
                  Khám phá
                </a>
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
        {/* <div className="title-brand">
                    <h1>Thương hiệu</h1>
                </div> */}
      </div>
      <div className="list-product-sell">
        <ul className="list-type-product-sell">
          <ListItem name_tag="display" />
          <ListItem name_tag="pc" />
        </ul>
      </div>
    </div>
  );
}

export default ListProductSell;
