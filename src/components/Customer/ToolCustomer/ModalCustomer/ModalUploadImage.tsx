/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Image,
  Modal,
  Upload,
  // UploadFile,
  UploadProps,
} from "antd";
// import SubMenu from "antd/es/menu/SubMenu";
import {  } from "react-icons/lu";
import React, { Ref,  useEffect,  useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TbTextScan2 } from "react-icons/tb";
import { IoIosImage } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import './styles.scss'
import Tesseract from 'tesseract.js';
import aiService from "@/services/aiService";
import { toast } from "react-toastify";
type Props = {
  refBtnCustomer?: Ref<HTMLButtonElement>;
  setData?:any
};

export default function ModalUploadImage({ refBtnCustomer,setData }: Props) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [imageFile,setImageFile] = useState<UploadFile | null>(null)
    const [imageUrl,setImageUrl] = useState<string | null>(null);
    const [textRec,setTextRec] = useState<string | null>(null);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: false,
  beforeUpload(file) {
    // Tạo URL tạm thời để hiển thị ảnh trước khi upload
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return true; // Tiếp tục upload
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
        // setImageFile(info.file)
    }
    if (status === 'done') {
        console.log(info)
    } else if (status === 'error') {
        console.log(info)
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
  showUploadList:false
};
const recognizeText = async (url:string) => {
    setIsLoading(true);
    try {
     Tesseract.recognize(
        url,  // Đường dẫn ảnh hoặc URL
           'vie',               // Ngôn ngữ (ví dụ: 'eng' cho tiếng Anh, 'vie' cho tiếng Việt)
           {
           }
         ).then(({ data: { text } }) => {
           setTextRec(text)
         });
    } catch {
      return ""
    }
 
  };
  const handleWaiting = async() =>{
    if(!(textRec === "")){
      const res = await aiService.getInfo(textRec ?? "")
      if(res.statusCode === 200){
        toast.success('Đã nhận diện thành công')
        setData(res.data)
        setImageUrl(null)
        setTextRec(null)
        handleCancel()
      }
      setIsLoading(false);
    }
    
  }
  // useEffect(()=>{
    
  //   if(imageUrl){
      
  //     recognizeText(imageUrl)
       
  //   }
  // },[imageUrl])

  useEffect(()=>{
    if(textRec){
      handleWaiting()
    }
  },[textRec])
  return (
    <>
      <Button
        hidden={refBtnCustomer ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<TbTextScan2 />}
        onClick={showModal}
        ref={refBtnCustomer}
      >
        Quét thông tin
      </Button>
      <Modal
        title="Quét thông tin"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "600px" }}
      >
        <Dragger {...props} className={`${imageUrl ? 'hidden':''}`}>
    <p className="ant-upload-drag-icon flex justify-center items-center">
    <IoIosImage className="text-6xl"/>
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>
  {imageUrl && (
        <div style={{ marginTop: 20 }} className="relative w-fit  rounded-md overflow-hidden">
            <Button className="absolute top-2 right-2 z-40" icon={<IoCloseCircleOutline className=" text-2xl  text-white hover:text-red-500"/>} type="text" onClick={()=>{setImageUrl(null)}}/>
          
          <Image className="w-full h-full object-contain" width={500} src={imageUrl} preview={false}/>
          <div className={` ${isLoading ?'absolute inset-0 z-50 bg-black/70 flex items-center gap-2 flex-col justify-center':'hidden'}`}>
        
          <div className='loader'></div>
          <p className="text-white pt-4">Đang nhận diện xin vui lòng chờ</p>
          </div>
        </div>
      )}
      <div className={`flex w-full justify-end items-center mt-4 ${imageUrl?'':'hidden'}`}>
        <Button className="text-sm" type="primary" onClick={()=>{recognizeText(imageUrl ?? "")}}>Lấy thông tin</Button>
      </div>
      </Modal>
      
    </>
  );
}
