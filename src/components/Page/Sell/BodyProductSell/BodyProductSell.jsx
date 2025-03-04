/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import "./BodyProductSell.scss";
import ReactPlayer from "react-player";
import { IoIosArrowBack } from "react-icons/io";

function BodyProductSell() {
  let listimg = [
    {
      img: "https://cdn.wallpapersafari.com/37/15/L8EIpF.jpg",
      urlvideo: "/videos/introacer.mp4",
    },
    {
      img: "https://thienthanhlimo.com/wp-content/uploads/2022/05/101-anh-sieu-xe-4k-tai-free-lam-hinh-nen-dt-may-tinh-8.jpg",
      urlvideo: "/videos/introasus.mp4",
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-nePbk0xY1R8AFt5YDbLWgM2LdUXKKAVOpQ&s",
      urlvideo: "/videos/introip.mp4",
    },
    {
      img: "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/01/Hinh-nen-4K-1.jpg?fit=3840%2C2160&ssl=1",
      urlvideo: "/videos/quang.mp4",
    },
    {
      img: "https://theme.hstatic.net/1000026716/1000440777/14/slideshow_1.jpg?v=36861",
      urlvideo: "/videos/introasus.mp4",
    },
    {
      img: "https://wallpapercave.com/wp/2wJfqOP.jpg",
      urlvideo: "/videos/introasus.mp4",
    },
    {
      img: "https://cdn.wallpapersafari.com/37/15/L8EIpF.jpg",
      urlvideo: "/videos/introasus.mp4",
    },
    {
      img: "https://wallpapercave.com/wp/2wJfqOP.jpg",
      urlvideo: "/videos/introasus.mp4",
    },
    {
      img: "https://cdn.wallpapersafari.com/37/15/L8EIpF.jpg",
      urlvideo: "/videos/introasus.mp4",
    },
    {
      img: "https://wallpapercave.com/wp/2wJfqOP.jpg",
      urlvideo: "/videos/introasus.mp4",
    },
    {
      img: "https://cdn.wallpapersafari.com/37/15/L8EIpF.jpg",
      urlvideo: "/videos/introasus.mp4",
    },
  ];

  let [active, setactive] = useState(0);
  let [curr, next] = useState(2);
  function bamne() {
    setactive(1);
    const lengthList = listimg.length;
    next(curr + 1);

    if (curr == lengthList - 1) {
      next(0);
    }
  }
  function bamnelui() {
    setactive(2);
    const lengthList = listimg.length;
    next(curr - 1);

    if (curr == 0) {
      next(lengthList - 1);
    }
  }
  function active1_0() {
    const a = listimg.map((e, index) => {
      if (index == listimg.length - 1) {
        return (
          <li
            key={index}
            className="item-carousel-prev prev-carousel"
            onClick={bamnelui}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const b = listimg.map((e, index) => {
      if (index == 0) {
        return (
          <li key={index} className="item-carousel-main main-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == 1) {
        return (
          <li
            key={index}
            className="item-carousel-next next-carousel"
            onClick={bamne}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      } else if (index != listimg.length - 1) {
        return (
          <li key={index} className="item-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const c = a.concat(b);
    return c;
  }
  function active2_0() {
    const a = listimg.map((e, index) => {
      if (index == listimg.length - 1) {
        return (
          <li
            key={index}
            className="item-carousel-prev back-prev-carousel"
            onClick={bamnelui}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const b = listimg.map((e, index) => {
      if (index == 0) {
        return (
          <li key={index} className="item-carousel-main back-main-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == 1) {
        return (
          <li
            key={index}
            className="item-carousel-next back-next-carousel"
            onClick={bamne}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      } else if (index != listimg.length - 1) {
        return (
          <li key={index} className="item-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const c = a.concat(b);
    return c;
  }
  function active1_end() {
    const a = listimg.map((e, index) => {
      if (index == 0) {
        return (
          <li
            key={index}
            className="item-carousel-next next-carousel"
            onClick={bamne}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const b = listimg.map((e, index) => {
      if (index == listimg.length - 1) {
        return (
          <li key={index} className="item-carousel-main main-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == listimg.length - 2) {
        return (
          <li
            key={index}
            className="item-carousel-prev prev-carousel"
            onClick={bamnelui}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      } else if (index != 0) {
        return (
          <li key={index} className="item-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const c = b.concat(a);
    return c;
  }
  function active2_end() {
    const a = listimg.map((e, index) => {
      if (index == 0) {
        return (
          <li
            key={index}
            className="item-carousel-next back-next-carousel"
            onClick={bamne}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const b = listimg.map((e, index) => {
      if (index == listimg.length - 1) {
        return (
          <li key={index} className="item-carousel-main back-main-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == listimg.length - 2) {
        return (
          <li
            key={index}
            className="item-carousel-prev back-prev-carousel"
            onClick={bamnelui}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      } else if (index != 0) {
        return (
          <li key={index} className="item-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
    });
    const c = b.concat(a);
    return c;
  }

  function active1_other() {
    const b = listimg.map((e, index) => {
      if (index == curr) {
        return (
          <li key={index} className="item-carousel-main main-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == curr - 1) {
        return (
          <li
            key={index}
            className="item-carousel-prev prev-carousel"
            onClick={bamnelui}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == curr + 1) {
        return (
          <li
            key={index}
            className="item-carousel-next next-carousel"
            onClick={bamne}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      return (
        <li key={index} className="item-carousel">
          <img alt="" src={e.img}></img>
        </li>
      );
    });
    return b;
  }
  function active2_other() {
    const b = listimg.map((e, index) => {
      if (index == curr) {
        return (
          <li key={index} className="item-carousel-main back-main-carousel">
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == curr - 1) {
        return (
          <li
            key={index}
            className="item-carousel-prev back-prev-carousel"
            onClick={bamnelui}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      if (index == curr + 1) {
        return (
          <li
            key={index}
            className="item-carousel-next back-next-carousel"
            onClick={bamne}
          >
            <img alt="" src={e.img}></img>
          </li>
        );
      }
      return (
        <li key={index} className="item-carousel">
          <img alt="" src={e.img}></img>
        </li>
      );
    });
    return b;
  }

  function active1() {
    if (curr == 0) {
      return active1_0();
    }
    if (curr == listimg.length - 1) {
      return active1_end();
    }
    return active1_other();
  }
  function active2() {
    if (curr == 0) {
      return active2_0();
    }
    if (curr == listimg.length - 1) {
      return active2_end();
    }
    return active2_other();
  }

  useEffect(() => {
    const list_next2 = document.getElementsByClassName("item-carousel-next2");
    for (let i = 0; i < list_next2.length; i++) {
      list_next2[i].classList = "item-carousel";
    }
    const list_prev2 = document.getElementsByClassName("item-carousel-prev2");
    for (let i = 0; i < list_prev2.length; i++) {
      list_prev2[i].classList = "item-carousel";
    }
    const list_item = document.getElementsByClassName("item-carousel");
    for (let i = 0; i < list_item.length; i++) {
      list_item[i].style = "";
    }
    const carousel_prev = document.querySelector(".item-carousel-prev");
    if (carousel_prev) {
      carousel_prev.style = "";
    }
    const carousel_main = document.querySelector(".item-carousel-main");
    if (carousel_main) {
      carousel_main.style = "";
    }
    const carousel_next = document.querySelector(".item-carousel-next");
    if (carousel_next) {
      carousel_next.style = "";
    }
    if (active == 1) {
      const item_carousels = document.getElementsByClassName("item-carousel");

      if (curr > 1 && curr < listimg.length - 1) {
        item_carousels[curr - 2].classList = "item-carousel-prev2";
      } else {
        item_carousels[item_carousels.length - 1].classList =
          "item-carousel-prev2";
      }
      setTimeout(() => {
        list_prev2[0].style = "display: none !important";
      }, 1000);
    }
    if (active == 2) {
      const item_carousels = document.getElementsByClassName("item-carousel");
      if (curr < listimg.length - 2 && curr > 0) {
        item_carousels[curr - 1].classList = "item-carousel-next2";
      } else {
        item_carousels[0].classList = "item-carousel-next2";
      }
      setTimeout(() => {
        list_next2[0].style = "display: none !important";
      }, 1000);
    }
    const bg_slider = document.querySelector(".bg-slider");
    bg_slider.style = "animation: bg-brand 1s ease-out;";
    setTimeout(() => {
      bg_slider.style = "";
    }, 1000);
  }, [curr]);

  return (
    <div className="slider-body">
      <ul className="slider-carousel">
        {active == 0
          ? listimg.map((e, index) => {
              if (curr == 0) {
                if (index == 0) {
                  return (
                    <li key={index} className="item-carousel-main">
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                if (index == listimg.length - 1) {
                  return (
                    <li
                      key={index}
                      className="item-carousel-prev"
                      onClick={bamnelui}
                    >
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                if (index == 1) {
                  return (
                    <li
                      key={index}
                      className="item-carousel-next"
                      onClick={bamne}
                    >
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                return (
                  <li key={index} className="item-carousel">
                    <img alt="" src={e.img}></img>
                  </li>
                );
              } else if (curr == listimg.length - 1) {
                if (index == curr) {
                  return (
                    <li key={index} className="item-carousel-main">
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                if (index == curr - 1) {
                  return (
                    <li
                      key={index}
                      className="item-carousel-prev"
                      onClick={bamnelui}
                    >
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                if (index == 0) {
                  return (
                    <li
                      key={index}
                      className="item-carousel-next"
                      onClick={bamne}
                    >
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                return (
                  <li key={index} className="item-carousel">
                    <img alt="" src={e.img}></img>
                  </li>
                );
              } else {
                if (index == curr) {
                  return (
                    <li key={index} className="item-carousel-main">
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                if (index == curr - 1) {
                  return (
                    <li
                      key={index}
                      className="item-carousel-prev"
                      onClick={bamnelui}
                    >
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                if (index == curr + 1) {
                  return (
                    <li
                      key={index}
                      className="item-carousel-next"
                      onClick={bamne}
                    >
                      <img alt="" src={e.img}></img>
                    </li>
                  );
                }
                return (
                  <li key={index} className="item-carousel">
                    <img alt="" src={e.img}></img>
                  </li>
                );
              }
            })
          : active == 1
          ? active1()
          : active2()}
      </ul>
      <div className="bg-slider">
        <ReactPlayer
          url={listimg[curr].urlvideo}
          playing={true}
          loop={true}
          muted={true}
          height="100%"
          width="100%"
          // style={{ transform: `translateY(${trans}px)` }}
          className="video-slider"
        />
        {/* <img alt="" className="video-slider" src={listimg[curr].img}></img> */}
        {/* <h1>iphone 14 pro max</h1>
                <p>hứa hẹn mang lại những trải nghiệm đầy mới mẻ cho người dùng iPhone</p> */}
        {/* <div className="detail-product-sell">
                    <a href="#">Sản phẩm</a>
                </div>
                <div className="detail-website">
                    <a href="#">Website</a>
                </div> */}
      </div>
      <div className="back-slider">
        <div
          className="bg-btn"
          onClick={() => {
            bamnelui();
          }}
        >
          <IoIosArrowBack />
        </div>
      </div>
      <div className="next-slider">
        <div
          className="bg-btn"
          onClick={() => {
            bamne();
          }}
        >
          <IoIosArrowBack />
        </div>
      </div>
    </div>
  );
}

export default BodyProductSell;
