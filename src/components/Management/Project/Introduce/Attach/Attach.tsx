/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from '@/hooks/usePostData';
import { IGetFile, IGetFolder, IGetPictureWork } from '@/models/activityInterface';
import { onChangeImagePreview } from '@/redux/store/slices/image-preview.slice';
import { AppDispatch } from '@/redux/store/store';
import activityService from '@/services/activityService';
import CustomFormData from '@/utils/CustomFormData';
import { Button, Table, TableColumnsType, Upload, UploadFile } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { Ref, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import ModalAddFolder from './ModalFolder/ModalAddFolder';
import ModalAddFile from './ModalFile/ModalAddFile';


export default function Attach() {
    const searchParams = useSearchParams();
    const refBtnFolder = useRef<HTMLButtonElement>()
    const refBtnFile = useRef<HTMLButtonElement>()
    const [listImg, setListImg] = useState<UploadFile[]>([]);
    const [idFolder,setIdFolder] = useState<string>('')
    const [dataSource,setDataSource] = useState<IGetFolder[]>([])
    const { postdata } = usePostData();
    const handleDownload = (url: string, name: string) => {
      // const getDownloadUrl = (url: string, fileName: string) => {
      //   return url.replace('/upload/', `/upload/fl_attachment:${fileName}/`);
      // };
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
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
        const res = await activityService.getDocumentsByProject(id ?? "");
        if (res.statusCode === 200) {
          const dataRes = res.data
          setDataSource(dataRes.folders ?? [])
          setListImg(
            (dataRes.pictures?.map((dt:IGetPictureWork) => {
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
      const columns: TableColumnsType<IGetFolder> = [
    
        {
          title: "Mã folder",
          dataIndex: "folder_id",
          className: "text-xs",
        },
        {
          title: "Tên folder",
          dataIndex: "name",
          className: "text-xs",
          render: (value?: string) =>
            value ? `${value}` : "N/A",
        },
        {
          title: "Mô tả",
          dataIndex: "description",
          className: "text-xs",
          render: (value?: string) =>
            value ? `${value}` : "N/A",
        },
        {
          title: "Danh sách file",
          dataIndex: "description",
          className: "text-xs",
          render: (value:string,record) =>
          {
            return <>
              <div className='flex flex-col items-center'>
               {
                record.files?.map((dt:IGetFile) => {
                  return <>
                    <Button key={dt.file_id} type='link' onClick={()=>{handleDownload(dt.url,dt.name)}}>{dt.name}</Button>
                  </>
                })
               }
               <Button className='w-fit' onClick={()=>{
                  setIdFolder(record.folder_id)
                  refBtnFile.current?.click()
               }} type='primary'>Thêm File</Button>
              </div>
            </>
          }
        },
      ];
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
        <p className="pointer-events-none">Ảnh dự án</p>
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

    <div>
      <div className="flex items-center text-xs font-medium text-[#EB8823] hover:opacity-85 mb-2">
        <p className="flex items-center">Folder
          
        </p>
      </div>
      <div>
        <Table<IGetFolder>
            columns={columns}
            // className="text-xs"
            // rowSelection={rowSelection}
            dataSource={dataSource}
            scroll={{ x: "max-content" }}
            pagination={{
              // pageSize: pageLimit, 
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
      </div>
    </div>
    <ModalAddFolder resetData={fetchData} id={searchParams.get('id') ?? ""} refBtnFolder={refBtnFolder as Ref<HTMLButtonElement>}/>
    <ModalAddFile resetData={fetchData} id={idFolder ?? ""} refBtnFile={refBtnFile as Ref<HTMLButtonElement>}/>
  </div>
  )
}