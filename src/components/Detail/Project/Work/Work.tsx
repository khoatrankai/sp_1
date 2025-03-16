/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalAddTask from '@/components/Task/Tool/Modal/ModalTask';
import usePostData from '@/hooks/usePostData';
import { IGetTask, IGetWork2 } from '@/models/activityInterface';
import activityService from '@/services/activityService';
import { Avatar, Button, Modal, Popover, Progress } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { CgDanger } from "react-icons/cg";
import { FaCheckCircle, FaNetworkWired } from 'react-icons/fa';
import { IoIosAddCircle, IoIosCloseCircle } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
import { TbFileDescription } from 'react-icons/tb';

type Props={
  id:string,
  setIdWork:any
}

export default function Work({id,setIdWork}:Props) {
  const {postdata} = usePostData()
  const refBtn = useRef<HTMLButtonElement>()
  const [dataWork,setDataWork] = useState<IGetWork2>()
  const fetchData = async ()=>{
    const res = await activityService.getWorkById(id)
    if(res.statusCode === 200){
      setDataWork(res.data)
    }
  }
  useEffect(()=>{
    if(id) fetchData()
  },[id])

  const ContentTask = (data:IGetTask)=>{
    return <>
      <div className='p-2 flex flex-col w-full'>
      <div className='flex gap-2 items-center'>
      <MdDateRange />
        <p className='break-words text-wrap'>{(new Date(data.time_start)).toLocaleString("vi-VN", { 
    timeZone: "UTC", 
    hour12: false 
})} - {(new Date(data.time_end)).toLocaleString("vi-VN", { 
  timeZone: "UTC", 
  hour12: false 
})}</p>
      </div>
      <div className='flex gap-2 items-center'>
      <TbFileDescription />
        <p className='break-words text-wrap'>{data.description}</p>
      </div>
      </div>

    </>
  }

   const handleChange = async (idTask:string,status:'success'|'fail') => {
      const res = await postdata(() =>
        activityService.updateTask(idTask, {status})
      );
      if (res === 200 || res === 201) {
       fetchData()
      
      }
    };
  return (
    <>
      <Modal 
        open={(!id || id === "")?false:true }
        className='!w-screen !h-screen !inset-2'
        title="Chi tiết công việc"
        footer={false}
        onCancel={()=>{
          setIdWork("")
        }}
        >
          
      <div>
        {/* <p className='p-4 bg-white'>Chi tiết công việc</p> */}
        <div className='flex gap-2 flex-wrap p-4 bg-gray-300'>
            <div className='bg-white rounded-sm flex-1 basis-1/5 min-h-screen p-2 flex flex-col gap-8'>
              <div className='flex flex-col gap-1'>
                <p className='font-medium  text-xs'>Người thực hiện</p>
                <div className='flex flex-col text-gray-500 gap-1'>
                  
                  {
                    dataWork?.list_user?.map(dt => {
                      return <>
<div className='flex gap-2 w-full items-center'>
                    <div className='min-w-6 min-h-6 max-w-6 max-h-6 w-6 h-6 '>
                    <Avatar className='w-full h-full' style={{  verticalAlign: 'middle' }} size="default" src={dt?.picture_url}>
       {dt?.last_name}
      </Avatar>
                    </div>
                  
<div className='w-full flex flex-col'>
<p className='text-xs uppercase font'>{dt?.first_name} {dt?.last_name}</p>
<p className='text-xs uppercase font-semibold text-green-400'>{dt?.group_user?.name_group}</p>

</div>
                  </div>
                      </>
                    })
                  }
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='font-medium  text-xs'>Người giao việc</p>
                <div className='flex flex-col text-gray-500'>
                  <div className='flex gap-2 w-full items-center'>
                    
                  
<div className='w-full flex flex-col'>
<div className='flex gap-4 w-11/12 text-xs'>
    <p className='w-16'>Người giao:</p>
    <p>{dataWork?.user_create?.first_name} {dataWork?.user_create?.last_name}</p>
</div>
<div className='flex gap-4 w-11/12 text-xs'>
    <p className='w-16'>Ngày giao:</p>
    <p>{(new Date(dataWork?.created_at ?? "").toLocaleDateString('vi-vn'))}</p>
</div>
</div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='font-medium text-xs'>Đánh giá công việc</p>
                <div className='flex flex-col  text-gray-500'>
                  <div className='flex gap-2 w-full items-center'>
                    
                  
<div className='w-full flex flex-col'>
<div className='flex gap-4 w-11/12 text-xs'>
    <p className='w-16'>Khối lượng:</p>
    <p>{dataWork?.tasks?.length}</p>
</div>
{/* <div className='flex gap-4 w-11/12 text-xs'>
    <p className='w-16'>Tiến độ:</p>
    <p>Đúng hạn</p>
</div> */}
{/* <div className='flex gap-4 w-11/12 text-xs'>
    <p className='w-16'>Chất lượng:</p>
    <p>Không đạt</p>
</div> */}
</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-white rounded-sm flex-1 basis-3/4 min-h-screen p-2 flex flex-col gap-4' >
            <div>
            <div className='flex gap-1 items-center'>
              <CgDanger />
              <p className='text-lg font-semibold'>{dataWork?.name}</p>
              </div>
              <div className='text-gray-500'>
              <div className='flex gap-1 items-center'>
                <p>trong hoạt động</p>
                <a className='uppercase text-green-500'>{dataWork?.activity?.name}</a>
              </div>
              <div className='flex gap-1 items-center'>
                <p>thuộc hạng mục</p>
                <a className='uppercase text-green-500'>{dataWork?.type.name}</a>
              </div>
            
              </div>
            </div>
              
             
              <div className='flex items-center gap-4'>
                <div className='flex flex-col items-center text-sm'>
                  <p className='font-semibold'>THỜI GIAN</p>
                  <p className='p-2 rounded-sm text-xs bg-green-500 text-white'>{((new Date(dataWork?.time_end ?? "")).getTime() - (new Date(dataWork?.time_start ?? "")).getTime()) / (1000 * 60 * 60)} giờ</p>
                </div>
                <div className='flex flex-col items-center text-sm'>
                  <p className='font-semibold'>NGÀY BẮT ĐẦU</p>
                  <p className='p-2 rounded-sm text-xs bg-green-500 text-white'>{ new Date(dataWork?.time_start ??"").toLocaleDateString('vi-vn')}</p>
                </div>
                <div className='flex flex-col items-center text-sm'>
                  <p className='font-semibold'>NGÀY HẾT HẠN</p>
                  <p className='p-2 rounded-sm text-xs bg-green-500 text-white'>{new Date(dataWork?.time_end??"").toLocaleDateString('vi-vn')}</p>
                </div>
                <div className='flex flex-col items-center text-sm'>
                  <p className='font-semibold'>TRẠNG THÁI</p>
                  <p className='p-2 rounded-sm text-xs bg-blue-500 text-white'>{dataWork?.status?.name}</p>
                </div>
                <div className='flex flex-col items-center text-sm'>
                  <p className='font-semibold'>TIẾN ĐỘ</p>
                  <p className='p-2 rounded-sm text-xs bg-green-700 text-white'>{(((dataWork?.tasks?.filter(dt => dt.status === 'success').length ?? 0) / (dataWork?.tasks?.length ?? 1)) * 100)}%</p>
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-1'>
                <TbFileDescription />
                <p>Mô tả</p>
                </div>
                <p className='text-gray-500'>{dataWork?.description}</p>
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-1'>
                <FaNetworkWired />
                <p>Task</p>
                <Button className='text-2xl' icon={<IoIosAddCircle />} type='link' onClick={()=>{
                  refBtn.current?.click()

                }}/>
                </div>
                <Progress percent={(((dataWork?.tasks?.filter(dt => dt.status === 'waitting').length ?? 0) / (dataWork?.tasks?.length ?? 1)) * 100)} success={{ percent: ((((dataWork?.tasks?.filter(dt => dt.status === 'success').length ?? 0) / (dataWork?.tasks?.length ?? 1)) * 100)) }} />
                <div className='flex flex-col gap-2 p-2'>
                  {
                    dataWork?.tasks?.map(dt => {
                      if(dt.status === "waitting"){
                        return <>
                          <Popover title={dt.name.toUpperCase()} content={ContentTask(dt)}  trigger="hover">
                          <p className='py-2 border-b-[1px] flex justify-between items-center'>{dt.name}<span className='flex'><Button icon={<FaCheckCircle className='text-green-400 text-2xl' />} type='link'  onClick={()=>{
                            handleChange(dt.task_id,'success')                            
                          }}/> <Button icon={<IoIosCloseCircle className='text-red-400  text-3xl' />} type='link' onClick={()=>{
                            handleChange(dt.task_id,'fail')                            
                          }}/> </span></p>
                          </Popover>
                          
                        </>
                      }
                      return <>
                      <Popover title={dt.name} content={ContentTask(dt)}  trigger="hover">
                      <p className='py-2 border-b-[1px] text-green-400'>{dt.name}</p>
                      </Popover>
                      

                      </>
                    
                    })
                  }
                  
                  
                 
                </div>
              </div>
            </div>
        </div>
        <ModalAddTask refBtnTask={refBtn as Ref<HTMLButtonElement>} id={id as string} resetData={fetchData}/>
    </div>
      </Modal>
    </>
   
  )
}