/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
import usePostData from "@/hooks/usePostData";
import activityService from "@/services/activityService";
import {
  Button,
  Form,
  Modal,
  Tabs,
  Upload,
  UploadFile,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TabPane from "antd/es/tabs/TabPane";
import { InboxOutlined } from '@ant-design/icons';
// import moment from "moment";
import React, { Ref, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { UploadProps } from "antd/lib";
import CustomFormData from "@/utils/CustomFormData";

type Props = {
  id:string
  refBtnFile?: Ref<HTMLButtonElement>;
  resetData?:any
};


const { Dragger } = Upload;



export default function ModalAddFile({refBtnFile,id,resetData
}: Props) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info) {
            // const { status } = info.file;
            // const newFileList = info.fileList;
            // const newFile = info.file
            
            // if(status === "removed")
            // {
            //     const uniqueList = fileList.filter(dt => dt.uid !== newFile.uid)
            //     setFileList(uniqueList)
            // }
            // if (status === 'uploading' || status === 'done') {
            //     const uniqueList = newFileList.filter((dt)=>{
            //         const searchData = fileList.find(dtt => dtt.uid === dt.uid)
            //         if(searchData){
            //             return false
            //         }
            //         return true
            //     })
            //   setFileList([...fileList,...uniqueList]
            //   );
            // } else if (status === 'error') {
            //   console.log( 'error');
            // }
            // if (status === 'done') {
            //     setFileList(prev => {
            //       const exists = prev.some(file => file.uid === newFile.uid);
            //       if (!exists) {
            //         return [...prev, info.file];
            //       }
            //       return prev;
            //     });
            //   }

            const { status } = info.file;

            if (status !== 'uploading') {
              // console.log(info.file, info.fileList);
              setFileList(info.fileList)
            }
            if (status === 'done') {
              
            } else if (status === 'error') {
              
            }
        },
        onDrop() {
            // const newFileList = Array.from(e.dataTransfer.files)
            // console.log(newFileList)
            // const uniqueList = newFileList.filter((dt)=>{
            //     const searchData = fileList.find(dtt => dtt.uid === dt.uid)
            //     if(searchData){
            //         return false
            //     }
            //     return true
            // })
        //   setFileList((preValue)=>{
        //     return [...preValue,...uniqueList]
        //   });
        },
      };
  
  const [form] = useForm();
  const { postdata } = usePostData();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    const dataImg = fileList.map((dt) => dt.originFileObj as File);
    const data = {url:dataImg,files:fileList.map((dt)=>{return {name:dt.name}}),folder:id };
    const formData = CustomFormData(data);
    try {
      const statusCode = await postdata(() =>
        activityService.createFile(formData)
      );
      if (statusCode === 201) {
        form.resetFields();
        setIsModalVisible(false);
        resetData()
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
   
   
  };

  const btnSubmit = async () => {
    form.submit();
  };


  return (
    <>
      <Button
        hidden={refBtnFile ? true : false}
        icon={<IoAddOutline />}
        onClick={showModal}
        ref={refBtnFile}
      >
        Thêm file
      </Button>
      <Modal
        title="Thêm file"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <Tabs defaultActiveKey="1" style={{ width: "100%" }} type="line">
          <TabPane tab="Thông tin file" key={1}>
            
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              style={{ display: "flex", flexWrap: "wrap", columnGap: "12px" }}
            >
              <Form.Item
                name="files"
                label="Thêm file"
                style={{ minWidth: "100%", flex: "1 1 0%" }}
              >
                    <Dragger {...props} >
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                        </p>
                    </Dragger>
              </Form.Item>
             
        
            </Form>
          </TabPane>
        </Tabs>

        <div className="flex justify-end w-full mt-4">
          <Button type="primary" onClick={btnSubmit}>
            Thêm
          </Button>
        </div>
      </Modal>
     
    </>
  );
}
