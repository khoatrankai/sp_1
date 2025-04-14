import usePostData from '@/hooks/usePostData';
import { IGetWork2 } from '@/models/activityInterface';
import { onChangeImagePreview } from '@/redux/store/slices/image-preview.slice';
import { AppDispatch } from '@/redux/store/store';
import activityService from '@/services/activityService';
import CustomFormData from '@/utils/CustomFormData';
import { Upload, UploadFile } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';


export default function Attach() {
    const searchParams = useSearchParams();
    const [listImg, setListImg] = useState<UploadFile[]>([]);
    const { postdata } = usePostData();
    const dispatch = useDispatch<AppDispatch>();
      const handleChange = async (
        { file }: { file: UploadFile },
        type_image: boolean
      ) => {
        if (file?.url && file?.status === "removed") {
          const statusCode = await postdata(() =>
            activityService.deletePictureWork(file.uid)
          );
          if (statusCode === 200) {
            fetchData();
           
          }
        } else {
          const dataReq = {
            activity: searchParams.get('id'),
            url: [file.originFileObj as File],
            type: type_image ? "start" : "end",
          };
          if (dataReq) {
            const dataForm = CustomFormData(dataReq);
            const statusCode = await postdata(() =>
              activityService.createPictureWork(dataForm)
            );
            if (statusCode === 201) {
              fetchData();
             
            }
          }
        }
      };
    
    const fetchData = async () => {
        const id = searchParams.get('id')
        const res = await activityService.getWorkById(id ?? "");
        if (res.statusCode === 200) {
          const dataRes = res.data as IGetWork2;
         
          setListImg(
            (dataRes.picture_urls?.map((dt) => {
              return {
                uid: dt.picture_id,
                name: dt.type,
                status: "done",
                url: dt.url,
              };
            }) as UploadFile[]) ?? []
          );
        
        }
      };
      useEffect(()=>{
          const id = searchParams.get('id')
          if(id){
            fetchData()
          }
        },[searchParams])
   
  return (
    <div className="my-2 flex flex-col gap-8">
   
    <div>
      <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 cursor-pointer mb-2">
        <p className="pointer-events-none">Ảnh công việc</p>
      </div>
      <div
        // valuePropName="fileList"
        // getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        className="!m-0"
        // rules={[{ required: false, message: "Vui lòng chọn loại thuế!" }]}
        style={{ minWidth: "320px", flex: "1 1 0%" }}
      >
        <Upload
          action=""
          listType="picture-card"
          fileList={listImg}
          onPreview={(e) => {
            dispatch(onChangeImagePreview(e.url));
          }}
          onChange={(e) => {
            handleChange(e, false);
          }}
          multiple
        >
        </Upload>
      </div>
    </div>
  </div>
  )
}