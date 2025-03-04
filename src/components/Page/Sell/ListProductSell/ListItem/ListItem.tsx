/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGetProductInfo } from "@/models/productInterface";
import { setCarts } from "@/redux/store/slices/productSlices/get_order.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import productService from "@/services/productService";
import { ConfigProvider, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { BiShowAlt } from "react-icons/bi";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

type Props = {
  name_tag: string;
};

export default function ListItem({ name_tag }: Props) {
  const updatehoveritemproduct = (e: any) => {
    const classproduct = e.currentTarget.querySelector(
      ".ordernow-info-product-sell"
    );
    if (e.type === "mouseover") {
      classproduct.classList.add("hover");
    } else if (e.type === "mouseout") {
      classproduct.classList.remove("hover");
    }
  };
  const { datas: dataCarts } = useSelector(
    (state: RootState) => state.get_carts
  );
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState<number>(1);
  const [nameType, setNameType] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(1);
  const [products, setProducts] = useState<IGetProductInfo[]>([]);
  const fetchData = async () => {
    const res = await productService.findProductByType({
      name_tag,
      page,
      limit: 5,
    });
    if (res.statusCode === 200) {
      setProducts(res.data.products);
      setTotalPage(res.data.totalPage);
      setNameType(res.data.name_type);
    }
  };
  useEffect(() => {
    if (page) {
      fetchData();
    }
  }, [page]);
  const handleAddProduct = async (product_id: string) => {
    const check = dataCarts.find((dt) => dt.product_id === product_id);
    if (check) {
      dispatch(
        setCarts(
          dataCarts.map((dt) => {
            if (dt.product_id === product_id) {
              return { ...dt, count: dt.count + 1 };
            } else {
              return dt;
            }
          })
        )
      );
    } else {
      dispatch(setCarts([...dataCarts, { product_id, count: 1 }]));
    }
  };
  return (
    <>
      <li className="item-type-product-sell">
        <a
          href="#"
          className="href-item-product-sell font-semibold border-t-[1px] border-white/50"
        >
          <h2 className="uppercase">{nameType}</h2>
          <h2>XEM THÊM</h2>
        </a>

        <ul className="list-item-product-sell">
          {products.map((dt) => {
            return (
              <>
                <li
                  className="item-product-sell"
                  onMouseOver={(e) => {
                    updatehoveritemproduct(e);
                  }}
                  onMouseOut={(e) => {
                    updatehoveritemproduct(e);
                  }}
                >
                  <img alt="" src={dt?.picture_urls?.[0]?.url} />
                  <h3>{dt.name}</h3>
                  <div className="price">
                    <span>{dt.price.toLocaleString("vi-VN")}</span>đ
                  </div>
                  <div className="ordernow-info-product-sell">
                    <a className="ordernow-product-sell">
                      <FaCartPlus
                        className="icon-ordernow-product-sell"
                        onClick={() => {
                          handleAddProduct(dt.product_id);
                        }}
                      />
                    </a>
                    <a
                      className="info-product-sell"
                      href={`/product/detail/${dt.product_id}`}
                    >
                      <BiShowAlt className="icon-info-product-sell" />
                    </a>
                  </div>
                </li>
              </>
            );
          })}
        </ul>
        <div className="pagination">
          {/* <AiOutlineArrowLeft className="arrow-left" />
              <ul className="list-pagination">
                <li>1</li>
                <li>2</li>
                <li>3</li>
              </ul> */}
          <ConfigProvider
            theme={{
              components: {
                Pagination: {
                  colorText: "#ffffff",
                  itemBg: "#000000",
                },
              },
            }}
          >
            <Pagination
              current={page}
              total={totalPage}
              onChange={(e) => {
                setPage(e);
              }}
            />
          </ConfigProvider>
          {/* <AiOutlineArrowRight className="arrow-right" /> */}
        </div>
      </li>
    </>
  );
}
