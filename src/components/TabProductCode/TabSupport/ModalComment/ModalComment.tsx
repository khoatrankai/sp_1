/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from "@/hooks/usePostData";
import { IGetHistoryReport } from "@/models/productInterface";
import { RootState } from "@/redux/store/store";
import productService from "@/services/productService";
import { Button, Image, Input, MenuProps, Modal, Tag } from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { FaCheck, FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
type Props = {
  ID: string;
  setData?: any;
};
export default function ModalComment({ ID, setData }: Props) {
  const [dataReport, setDataReport] = useState<IGetHistoryReport>();
  const [dataInput, setDataInput] = useState<string>("");
  const refScrollComment = useRef<any>();
  const { postdata } = usePostData();
  const { datas: dataProfile } = useSelector(
    (state: RootState) => state.get_profile
  );
  const fetchData = async () => {
    const res = await productService.findAllCommentByReport(ID);
    if (res.statusCode === 200) {
      setDataReport(res.data);
    }
  };
  const [idCommentDelete, setIdCommentDelete] = useState<string>("");
  const handleSubmit = async () => {
    const statusCode = await postdata(() =>
      productService.createCommentReport({
        history_report: ID,
        description: dataInput,
      })
    );
    if (statusCode === 200 || statusCode === 201) {
      fetchData();
      setDataInput("");
    }
  };
  useEffect(() => {
    if (dataReport) {
      if (refScrollComment.current) {
        refScrollComment.current.scrollTop =
          refScrollComment.current.scrollHeight + 200;
      }
    }
  }, [dataReport]);
  useEffect(() => {
    if (ID) {
      fetchData();
    }
  }, [ID]);

  const handleChangeLike = async (status: boolean, id: string) => {
    const statusCode = await postdata(() =>
      productService.toggleLikeReport(status, id)
    );
    if (statusCode === 200 || statusCode === 201) {
      fetchData();
    }
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      productService.deleteCommentReport(idCommentDelete)
    );
    if (statusCode === 200 || statusCode === 201) {
      fetchData();
      setIdCommentDelete("");
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
  const items: MenuProps["items"] = [
    {
      label: "Xóa",
      key: "delete",
    },
  ];
  const handleMenuClick = (id: string): MenuProps["onClick"] => {
    return (e) => {
      if (e.key === "delete") {
        setIdCommentDelete(id);
      }
    };
  };
  const menuProps = (id: string) => {
    return {
      items,
      onClick: handleMenuClick(id),
    };
  };
  return (
    <>
      <Modal
        title="Bài viết"
        open={ID !== "" ? true : false}
        onCancel={() => {
          setData("");
        }}
        footer={null}
        width={"100%"}
        className="overflow-auto "
        style={{ maxWidth: "800px", maxHeight: "80vh" }}
      >
        <div
          className="flex flex-col max-h-96 overflow-y-auto"
          ref={refScrollComment}
        >
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
                    (dataReport?.user_support
                      ? dataReport.user_support.picture_url
                      : dataReport?.customer?.picture_url) ??
                    "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
                  }
                />
                <div className="flex flex-col h-8 justify-center">
                  <p className=" font-semibold">
                    {dataReport?.user_support
                      ? `${dataReport?.user_support.first_name} ${dataReport.user_support.last_name}`
                      : dataReport?.customer?.name_company ?? "Khách hàng"}
                  </p>
                  <p className="text-gray-600 font-medium text-xs">
                    {new Date(dataReport?.created_at ?? "").toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Tag
                  color={
                    dataReport?.status === "pending"
                      ? "cyan"
                      : dataReport?.status === "analysis"
                      ? "blue"
                      : dataReport?.status === "progress"
                      ? "yellow"
                      : dataReport?.status === "testing"
                      ? "geekblue"
                      : "green"
                  }
                  className="h-fit"
                >
                  {dataReport?.status === "pending"
                    ? "Đang chờ xử lý"
                    : dataReport?.status === "analysis"
                    ? "Đang phân tích"
                    : dataReport?.status === "progress"
                    ? "Đang xử lý"
                    : dataReport?.status === "testing"
                    ? "Đang kiểm tra"
                    : "Đã giải quyết"}
                </Tag>
                {dataReport?.status !== "resolve" && (
                  <div className="flex gap-2 items-center">
                    <Button
                      type="link"
                      onClick={() => {
                        handleCheckSuccess(dataReport?.history_id as string);
                      }}
                      className={`hover:text-blue-500 text-black`}
                      icon={<FaCheck className="text-xl" />}
                    />
                  </div>
                )}
                {/* <div className="flex gap-2 items-center">
                  <Button
                    type="text"
                    icon={<AiOutlineEllipsis className="text-xl" />}
                  />
                </div> */}
              </div>
            </div>

            <p className="break-words"> {dataReport?.description}</p>
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
          <div className="flex p-4 justify-between items-center border-y-2">
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={
                  dataReport?.like.find(
                    (dt) => dt.user_support === dataProfile?.user_id
                  ) ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaHeart />
                  )
                }
                hidden={dataProfile ? false : true}
                onClick={() => {
                  const status = dataReport?.like.find(
                    (dt) => dt.user_support === dataProfile?.user_id
                  )
                    ? true
                    : false;
                  handleChangeLike(status, ID);
                }}
              >
                Quan tâm
              </Button>
              <Button>Bình luận</Button>
            </div>

            <div className="flex gap-4 items-center">
              <p className="text-gray-500 font-medium">
                <span>{dataReport?.like.length} </span>
                quan tâm
              </p>
              <p className="text-gray-500 font-medium">
                <span>{dataReport?.comment.length} </span>
                bình luận
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 py-4 px-2">
            {dataReport?.comment.map((dt) => {
              return (
                <>
                  <div className="flex gap-2">
                    <Image
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full overflow-hidden"
                      preview={false}
                      src={
                        dt?.user_support
                          ? dt.user_support.picture_url
                          : dt?.customer?.picture_url
                      }
                    />
                    <div>
                      <div className="flex flex-col justify-center px-2 py-1  bg-gray-100 rounded-md">
                        <p className=" font-semibold">
                          {" "}
                          {dt?.user_support
                            ? `${dt?.user_support.first_name} ${dt.user_support.last_name}`
                            : dt?.customer?.name_company ?? "Khách hàng"}
                        </p>
                        <p className="text-gray-600 font-medium text-xs max-w-96 break-words">
                          {dt.description}
                        </p>
                      </div>
                      <p className="text-gray-600 font-medium text-xs px-4 py-2">
                        {new Date(dt.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Dropdown menu={menuProps(dt.comment_id)}>
                      <Button type="link">
                        <AiOutlineEllipsis className="text-xl" />
                      </Button>
                    </Dropdown>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div className="w-full min-h-24 bg-white border-t-[1px]  px-2  py-4 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
          <div className="flex gap-2">
            <Image
              alt=""
              src={
                dataProfile?.picture_url ??
                "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
              }
              width={32}
              height={32}
              className="rounded-full overflow-hidden min-w-8 min-h-8"
              preview={false}
            />
            <div className="w-full">
              <div className="flex flex-col justify-center  rounded-md w-full bg-gray-100 h-fit">
                <Input.TextArea
                  placeholder="Bình luận là gì bạn ?"
                  value={dataInput}
                  onChange={(e) => {
                    setDataInput(e.target.value);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  className="text-gray-600  font-medium text-xs max-w-96 break-words"
                  autoSize={{ minRows: 3 }}
                />
                <div className="flex justify-end">
                  <Button
                    className="text-2xl"
                    type="link"
                    icon={<IoSend />}
                    onClick={() => {
                      handleSubmit();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* <Button
              type="link"
              icon={<AiOutlineEllipsis className="text-xl" />}
            /> */}
          </div>
        </div>
      </Modal>
      <Modal
        open={!(idCommentDelete === "")}
        title={"Xóa dữ liệu"}
        onOk={handleDelete}
        onCancel={() => {
          setIdCommentDelete("");
        }}
      >
        Bạn có chắc chắn muốn xóa không ?
      </Modal>
    </>
  );
}
