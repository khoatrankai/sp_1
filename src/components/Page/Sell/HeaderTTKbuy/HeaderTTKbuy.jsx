/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import "./HeaderTTKbuy.scss";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import { Image } from "antd";
import { useDispatch } from "react-redux";
import { getCarts } from "@/redux/store/slices/productSlices/get_order.slice";
import { useSelector } from "react-redux";

defineElement(lottie.loadAnimation);
function HeaderTTKbuy() {
  const dispatch = useDispatch();
  const { datas: dataCarts } = useSelector((state) => state.get_carts);
  const [active, setactive] = useState(false);
  const [hover, sethover] = useState(false);
  const [reset, setreset] = useState(false);
  const [tab, settab] = useState(false);
  const [hovercart, sethovercart] = useState(false);
  const [tabsearch, settabsearch] = useState(false);
  const arrowbottom = document.getElementsByClassName(
    "arrow-header-ttkbuy-bottom"
  );
  // const headerttkbuy = document.getElementsByClassName('header-ttkbuy')[0];
  // const headerbottom = document.getElementsByClassName('header-ttkbuy-bottom')[0];
  const headertop = document.getElementsByClassName("header-ttkbuy-top")[0];
  const bodyttkbuy = document.getElementsByClassName("body-ttkbuy")[0];
  const menuwrapttkbuy = document.getElementsByClassName(
    "menu-wrapper-ttkbuy"
  )[0];
  const backdropttkbuy = document.getElementsByClassName(
    "backdrop-menu-ttkbuy"
  )[0];
  const backdropttkbuy2 = document.getElementsByClassName(
    "backdrop-search-ttkbuy"
  )[0];
  const formsearchttkbuy =
    document.getElementsByClassName("form-search-ttkbuy")[0];
  const closemenu = document.getElementsByClassName(
    "button-close-search-ttkbuy"
  )[0];
  const bodyfull = document.getElementsByTagName("body")[0];

  const [vitri, setvitri] = useState(window.pageYOffset);
  const [scrolldown, setscrolldown] = useState(false);
  window.addEventListener("scroll", function () {
    if (this.window.pageYOffset != 0) {
      setvitri(this.window.pageYOffset);
      sethover(true);
    }
    if (active === false && tab === false && this.window.pageYOffset === 0) {
      setvitri(this.window.pageYOffset);

      sethover(false);
    }
    if (this.window.pageYOffset > vitri) {
      setscrolldown(true);
    } else {
      setscrolldown(false);
    }
  });

  useEffect(() => {
    if (reset)
      if (bodyttkbuy)
        bodyttkbuy.addEventListener("mousedown", () => {
          onClickarrow();
          if (window.pageYOffset === 0) {
            sethover(false);
          }
        });
  }, [reset]);

  const onClickarrow = () => {
    if (active === false) {
      arrowbottom[0].classList.remove("arrowup");
      arrowbottom[0].classList.add("arrowdown");
      document
        .getElementsByClassName("header-ttkbuy-bottom")[0]
        .classList.add("active");
      setactive(true);
      setreset(true);
    } else {
      arrowbottom[0].classList.remove("arrowdown");
      arrowbottom[0].classList.add("arrowup");
      document
        .getElementsByClassName("header-ttkbuy-bottom")[0]
        .classList.remove("active");
      setactive(false);
    }
  };

  useEffect(() => {
    if (headertop) {
      if (hover) {
        headertop.classList.add("header-ttkbuy-top-hover");
        arrowbottom[0].classList.add("arrow-header-ttkbuy-bottom-hover");
      } else {
        if (active != true) {
          arrowbottom[0].classList.remove("arrow-header-ttkbuy-bottom-hover");
          headertop.classList.remove("header-ttkbuy-top-hover");
        }
      }
    }
  }, [hover]);

  function on_off_menu() {
    tab ? settab(false) : settab(true);
  }
  useEffect(() => {
    if (menuwrapttkbuy) {
      if (tab === true) {
        menuwrapttkbuy.classList.add("activemenu");
        backdropttkbuy.style.display = "block";
        bodyfull.style = "overflow: hidden;";
        setscrolldown(false);
      } else {
        menuwrapttkbuy.classList.remove("activemenu");
        backdropttkbuy.style.display = "none";
        bodyfull.style = "overflow: auto;";
      }
    }
  }, [tab]);

  if (closemenu) {
    closemenu.addEventListener("mousedown", () => {
      settabsearch(false);
      bodyfull.style = "overflow: auto;";
    });
  }

  useEffect(() => {
    if (formsearchttkbuy) {
      if (tabsearch) {
        backdropttkbuy2.style.display = "block";
        formsearchttkbuy.classList.add("activesearch");
        setscrolldown(false);
      } else {
        backdropttkbuy2.style.display = "none";
        formsearchttkbuy.classList.remove("activesearch");
      }
    }
  }, [tabsearch]);

  useEffect(() => {
    dispatch(getCarts());
  }, [dispatch]);
  useEffect(() => {
    console.log(dataCarts);
  }, [dataCarts]);
  return (
    <div
      className={scrolldown ? "header-ttkbuy scroll-down" : "header-ttkbuy"}
      onMouseOver={() => {
        sethover(true);
      }}
      onMouseOut={() => {
        if (active === false && tab === false && vitri === 0) {
          sethover(false);
        }
      }}
    >
      <div className="header-ttkbuy-top ">
        <ul className="navleft-menu-ttkbuy h-20">
          <li className="item-navleft-menu-ttkbuy">
            {tab ? (
              <AiOutlineClose
                className="button-close-ttkbuy"
                onClick={on_off_menu}
              />
            ) : (
              <HiMenu onClick={on_off_menu} />
            )}
            {tab ? (
              <span className="button-close-ttkbuy" onClick={on_off_menu}>
                Close
              </span>
            ) : (
              <span onClick={on_off_menu}>Menu</span>
            )}
            <div className="backdrop-menu-ttkbuy" onClick={on_off_menu}></div>
            <div className="menu-wrapper-ttkbuy"></div>
          </li>
          <li
            className="item-navleft-menu-ttkbuy"
            onClick={() => {
              bodyfull.style = "overflow: hidden;";

              settabsearch(true);
            }}
          >
            <FiSearch />
            <span>Search</span>
            <div
              className="backdrop-search-ttkbuy"
              onMouseDown={() => {
                // console.log('oke');
                bodyfull.style = "overflow: auto;";

                settabsearch(false);
              }}
            ></div>
            <form className="form-search-ttkbuy">
              <FiSearch className="icon-search-ttkbuy" />
              <input placeholder="Search..." className="input-search-ttkbuy" />
              <AiOutlineClose className="button-close-search-ttkbuy" />
              <div className="info-search-ttkbuy"></div>
            </form>
          </li>
        </ul>
        <div className="logo-ttkbuy flex items-center">
          {/* <h1 className="text-3xl">SPARKING</h1> */}
          <Image
            height={50}
            className="h-full"
            src="/logo.png"
            alt=""
            preview={false}
          />
        </div>
        <ul className="navright-menu-ttkbuy">
          <li className="item-navright-menu-ttkbuy">
            <FaUserAlt />
            <span>User</span>
          </li>
          <li
            className="item-navright-menu-ttkbuy"
            onMouseOver={() => {
              sethovercart(true);
            }}
            onMouseOut={() => {
              sethovercart(false);
            }}
          >
            <FaShoppingCart />
            <span>Giỏ hàng</span>
            <div
              className={
                hovercart ? "cart-drawer-ttkbuy active" : "cart-drawer-ttkbuy"
              }
            >

              <lord-icon
                trigger="morph"
                src="https://cdn.lordicon.com/udbbfuld.json"
                colors="primary:#000"
              ></lord-icon>

            </div>
          </li>
        </ul>
      </div>
      <div
        className="arrow-header-ttkbuy-bottom arrowup"
        onClick={() => {
          onClickarrow();
        }}
      ></div>
      <div className="header-ttkbuy-bottom">
        <ul className="navbottom-menu-ttkbuy h-20">
          <li className="item-navbottom-menu-ttkbuy">
            <a href="">Payment Guide</a>
          </li>
          <li className="item-navbottom-menu-ttkbuy">
            <a href="">Delivery Guide</a>
          </li>
          <li className="item-navbottom-menu-ttkbuy">
            <a href="">Delivery Policy</a>
          </li>
          <li className="item-navbottom-menu-ttkbuy">
            <a href="">Warranty Policy</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HeaderTTKbuy;
