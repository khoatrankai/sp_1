/* eslint-disable @typescript-eslint/no-unused-vars */
// import usePostData from "@/hooks/usePostData";
// import { AppDispatch } from "@/redux/store/store";
import {
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { Button, Image, Modal, UploadFile } from "antd";
import React, { Ref, useState } from "react";
// import { IoAddOutline } from "react-icons/io5";
// import { useDispatch } from "react-redux";
import Upload from "antd/es/upload/Upload";
import { IGetDocumentContract } from "@/models/contractInterface";
import contractService from "@/services/contractService.";
import { CheckFileType } from "@/utils/CheckFileType";
import usePostData from "@/hooks/usePostData";
import CustomFormData from "@/utils/CustomFormData";
import dynamic from "next/dynamic";
const DocsViewer = dynamic(() => import("./DocsView/DocsView"), { ssr: false });
// import CustomFormData from "@/utils/CustomFormData";

type Props = {
  ID: string;
  refBtnActivity?: Ref<HTMLButtonElement>;
};

export default function ModalDocument({ refBtnActivity, ID }: Props) {
  const { postdata } = usePostData();
  //   const dispatch = useDispatch<AppDispatch>();
  const [imgPreview, setImgPreview] = useState<string>("");
  const [filePreview, setFilePreview] = useState<
    { uri: string; fileType?: string; fileData?: string }[]
  >([]);
  const [dataImage, setDataImage] = useState<UploadFile[]>([]);
  const [dataFile, setDataFile] = useState<UploadFile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
    fetchData();
  };
  const fetchData = async () => {
    const res = await contractService.getDocumentContractById(ID);
    if (res.statusCode === 200) {
      setDataImage(
        res.data
          .filter((dt: IGetDocumentContract) => {
            return CheckFileType(dt.url) === "Image";
          })
          .map((dt: IGetDocumentContract) => {
            return {
              uid: dt.document_id,
              name: dt.document_id,
              status: "done",
              url: dt.url,
            };
          })
      );
      setDataFile(
        res.data
          .filter((dt: IGetDocumentContract) => {
            return CheckFileType(dt.url) === "Raw";
          })
          .map((dt: IGetDocumentContract) => {
            return {
              uid: dt.document_id,
              name: dt.document_id + "." + dt?.type,
              status: "done",
              url: dt.url,
            };
          })
      );
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDownload = async (file: UploadFile) => {
    if (file.url) {
      try {
        const link = document.createElement("a");
        link.href = file.url;
        link.click();
      } catch (error) {
        console.error("Lỗi khi tải file:", error);
      }
    } else {
      console.error("URL của file không tồn tại");
    }
  };

  const handleChange = async ({ file }: { file: UploadFile }) => {
    if (file?.url && file?.status === "removed") {
      const statusCode = await postdata(() =>
        contractService.deleteDocumentContract(file.uid)
      );
      if (statusCode === 200) {
        fetchData();
      }
    } else {
      const dataReq = {
        contract: ID,
        url: [file.originFileObj as File],
      };
      if (dataReq) {
        const dataForm = CustomFormData(dataReq);
        const statusCode = await postdata(() =>
          contractService.createDocumentContract(dataForm)
        );
        if (statusCode === 201) {
          fetchData();
        }
      }
    }
  };

  const handlePreviewFile = async (file: UploadFile) => {
    if (file.url) {
      try {
        const fileExtension = file.name.split(".").pop();
        let fileType = ""; // Mặc định
        if (fileExtension === "pdf") {
          fileType = "application/pdf";
        } else if (fileExtension === "docx") {
          fileType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (fileExtension === "xlsx") {
          fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        } else if (
          fileExtension === "png" ||
          fileExtension === "jpeg" ||
          fileExtension === "jpg"
        ) {
          fileType = "image/" + fileExtension; // MIME type của hình ảnh
        } else if (fileExtension === "mp4") {
          fileType = "video/mp4";
        }
        setFilePreview([
          {
            uri: file.url as string,
            fileType,
          },
        ]);
      } catch (error) {
        console.error("Lỗi khi tải file:", error);
      }
    } else {
      console.error("URL của file không tồn tại");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <>
      <Button
        hidden={refBtnActivity ? true : false}
        type={"text"}
        className={"text-xs text-blue-600"}
        // icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnActivity}
      >
        Tài liệu
      </Button>
      <Modal
        title="Tài liệu"
        open={isModalVisible}
        className="flex flex-col gap-4"
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <div className="mb-2  pb-2">
          <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer mb-2">
            <p className="pointer-events-none">Ảnh tài liệu</p>
          </div>
          <div
            className="!m-0 max-h-32 overflow-y-auto"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Upload
              action=""
              className="!m-0"
              listType="picture-card"
              fileList={dataImage.reverse()}
              onPreview={(e) => {
                setImgPreview(e?.url ?? "");
              }}
              onChange={(e) => {
                handleChange(e);
              }}
              multiple
            >
              {uploadButton}
            </Upload>
          </div>
        </div>
        <div>
          <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer mb-2">
            <p className="pointer-events-none">File tài liệu</p>
          </div>
          <div
            className="!m-0 max-w-full overflow-x-auto"
            style={{ minWidth: "320px", flex: "1 1 0%" }}
          >
            <Upload
              action=""
              listType="text"
              fileList={dataFile}
              onPreview={(e) => {
                handleDownload(e);
              }}
              itemRender={(originNode, file) => {
                return (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 sm:w-96 w-12">{originNode}</div>
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(file)}
                      className="flex-none w-24 text-center"
                    >
                      Download
                    </Button>
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        handlePreviewFile(file);
                      }}
                      className="flex-none w-24 text-center"
                    >
                      Preview
                    </Button>
                  </div>
                );
              }}
              onChange={(e) => {
                handleChange(e);
              }}
              multiple
            >
              {<Button icon={<UploadOutlined />}>Select File</Button>}
            </Upload>
          </div>
        </div>
      </Modal>
      <Image
        hidden
        preview={{
          visible: imgPreview === "" ? false : true,
          onVisibleChange: () => setImgPreview(""),
        }}
        alt=""
        src={imgPreview}
      />
      <Modal
        className="!h-fit !w-fit"
        open={filePreview.length > 0}
        footer={null}
        onCancel={() => {
          setFilePreview([]);
        }}
      >
        <div className="!w-[90vw] !h-[80vh]">
          <DocsViewer docs={filePreview} />
        </div>
      </Modal>
    </>
  );
}
