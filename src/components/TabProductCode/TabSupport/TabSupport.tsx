import { Button, Image, Input, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { FaCheck, FaHeart } from "react-icons/fa";
import ModalComment from "./ModalComment/ModalComment";
import { IGetHistoryReport } from "@/models/productInterface";
import productService from "@/services/productService";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import usePostData from "@/hooks/usePostData";
import { IoIosSend } from "react-icons/io";
type Props = {
  code_product: string | undefined;
};
export default function TabSupport({ code_product }: Props) {
  const { id } = useParams();
  const { postdata } = usePostData();
  const [description, setDescription] = useState<string>("");
  const [idReport, setIdReport] = useState<string>("");
  const { datas: dataProfile } = useSelector(
    (state: RootState) => state.get_profile
  );
  const { datas: dataProfileCustomer } = useSelector(
    (state: RootState) => state.get_profile_customer
  );
  const [dataReport, setDataReport] = useState<IGetHistoryReport[]>([]);
  const fetchData = async () => {
    const res = await productService.findAllReportByCode(id as string);
    if (res.statusCode === 200) {
      setDataReport(res.data);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  const handleSubmitReport = async () => {
    if (description !== "" && code_product) {
      const statusCode = await postdata(() =>
        productService.createReport(description, code_product)
      );
      if (statusCode === 201) {
        setDescription("");
        fetchData();
      }
    }
  };
  const handleCheckSuccess = async (report_id: string) => {
    const statusCode = await postdata(() =>
      productService.updateReportStatus(report_id, "resolve")
    );
    if (statusCode === 200) {
      fetchData();
    }
  };
  const handleChangeLike = async (status: boolean, id: string) => {
    const statusCode = await postdata(() =>
      productService.toggleLikeReport(status, id)
    );
    if (statusCode === 200 || statusCode === 201) {
      fetchData();
    }
  };
  return (
    <div className="flex flex-col w-full gap-4">
      <p className="font-semibold mb-4">Thông tin báo cáo</p>
      <div className="w-full rounded-md flex gap-2 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer">
        <Image
          alt=""
          src={
            dataProfileCustomer?.picture_url ??
            "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
          }
          width={40}
          height={40}
          preview={false}
          className="rounded-full overflow-hidden"
        />
        {/* <div className="flex-1 py-2 px-3  text-gray-500 h-full text-xl font-medium bg-gray-200 rounded-full hover:bg-gray-100">
          Báo cáo tại đây
        </div> */}
        <Input.TextArea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value ?? "");
          }}
          className="text-gray-500 h-full text-xl font-medium flex-1 bg-gray-200 "
          placeholder="Báo cáo tại đây"
          autoSize={{ minRows: 2 }}
        />
        <div className="flex flex-col justify-end">
          <Button
            icon={<IoIosSend />}
            type="primary"
            className="bg-yellow-500"
            onClick={handleSubmitReport}
          >
            Gửi
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full gap-6">
        {dataReport.map((dt) => {
          return (
            <>
              <div className="w-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-md overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex flex-col gap-4 p-4">
                    <div className="w-full flex justify-between flex-wrap gap-2">
                      <div className="flex gap-2">
                        <Image
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-full overflow-hidden"
                          preview={false}
                          src={
                            (dt.user_support
                              ? dt.user_support.picture_url
                              : dt.customer?.picture_url) ??
                            "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
                          }
                        />
                        <div className="flex flex-col h-8 justify-center">
                          <p className=" font-semibold">
                            {dt.user_support
                              ? `${dt.user_support.first_name} ${dt.user_support.last_name}`
                              : dt.customer?.name_company ?? "Khách hàng"}
                          </p>
                          <p className="text-gray-600 font-medium text-xs">
                            {new Date(dt.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Tag
                          color={
                            dt.status === "pending"
                              ? "cyan"
                              : dt.status === "analysis"
                              ? "blue"
                              : dt.status === "progress"
                              ? "yellow"
                              : dt.status === "testing"
                              ? "geekblue"
                              : "green"
                          }
                          className="h-fit"
                        >
                          {dt.status === "pending"
                            ? "Đang chờ xử lý"
                            : dt.status === "analysis"
                            ? "Đang phân tích"
                            : dt.status === "progress"
                            ? "Đang xử lý"
                            : dt.status === "testing"
                            ? "Đang kiểm tra"
                            : "Đã giải quyết"}
                        </Tag>
                        {dt.status !== "resolve" && (
                          <div className="flex gap-2 items-center">
                            <Button
                              type="link"
                              onClick={() => {
                                handleCheckSuccess(dt.history_id);
                              }}
                              className={`hover:text-blue-500 text-black`}
                              icon={<FaCheck className="text-xl" />}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="break-words">{dt.description}</p>
                  </div>
                  {/* <Carousel className="max-w-full" arrows>
                    <Image
                      height={384}
                      width={"100%"}
                      className="!object-contain"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain", // Hoặc 'cover', 'fill', tùy theo nhu cầu
                      }}
                      alt=""
                      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                  </Carousel> */}
                  <div className="flex p-4 justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        icon={
                          dt.like.find(
                            (dt) => dt.user_support === dataProfile?.user_id
                          ) ? (
                            <FaHeart color="red" />
                          ) : (
                            <FaHeart />
                          )
                        }
                        hidden={dataProfile ? false : true}
                        onClick={() => {
                          const status = dt.like.find(
                            (dt) => dt.user_support === dataProfile?.user_id
                          )
                            ? true
                            : false;
                          handleChangeLike(status, dt.history_id);
                        }}
                      >
                        Quan tâm
                      </Button>
                      <Button
                        onClick={() => {
                          setIdReport(dt.history_id);
                        }}
                      >
                        Bình luận
                      </Button>
                    </div>

                    <div className="flex gap-4 items-center">
                      <p className="text-gray-500 font-medium">
                        <span>{dt.like.length} </span>
                        quan tâm
                      </p>
                      <p className="text-gray-500 font-medium">
                        <span>{dt.comment.length} </span>
                        bình luận
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <ModalComment ID={idReport} setData={setIdReport} />
    </div>
  );
}
