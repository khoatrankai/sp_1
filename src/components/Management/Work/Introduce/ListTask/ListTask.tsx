import React, { Ref, useEffect, useRef, useState } from 'react'
import { Button, Modal, Popover } from 'antd'
import { FaCheckCircle, FaNetworkWired } from 'react-icons/fa'
import { IoIosAddCircle, IoIosCloseCircle } from 'react-icons/io'
import { Progress } from 'antd/lib'
import { TbFileDescription } from 'react-icons/tb'
import { MdDateRange } from 'react-icons/md'
import { IGetTask, IGetWork2 } from '@/models/activityInterface'
import activityService from '@/services/activityService'
import { useSearchParams } from 'next/navigation'
import usePostData from '@/hooks/usePostData'
import ModalAddTask from '@/components/Task/Tool/Modal/ModalTask'

type Props ={
  refBtn?:Ref<HTMLButtonElement>
}
export default function ListTask({refBtn}:Props) {
  const refBtnTask = useRef<HTMLButtonElement>()
  const {postdata} = usePostData()
  const searchParams = useSearchParams()
  const [isTab,setIsTab] = useState<boolean>(false)
  const showModal = ()=>{
    setIsTab(true)
  }
  const cancelModal = ()=>{
    setIsTab(false)
  }
  const [dataWork,setDataWork] = useState<IGetWork2>()
  const fetchData = async ()=>{
    const res = await activityService.getWorkById(searchParams.get('id')??"")
    if(res.statusCode === 200){
      setDataWork(res.data)
    }
  }
  useEffect(()=>{
    const id = searchParams.get('id')
    if(id) fetchData()
  },[searchParams])

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
      <Button ref={refBtn} hidden onClick={showModal}/>
      <Modal
          title="Danh sách task"
          open={isTab}
          footer={null}
          onCancel={cancelModal}
          width={"600px"}
          // style={{ minHeight: "100vh",minWidth:'90vw' }}
          >
             <div className='flex flex-col'>
                            <div className='flex items-center gap-1'>
                            <FaNetworkWired />
                            <p>Task</p>
                            <Button className='text-2xl' icon={<IoIosAddCircle />} type='link' onClick={()=>{
                              refBtnTask.current?.click()
            
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
                            <ModalAddTask refBtnTask={refBtnTask as Ref<HTMLButtonElement>} id={searchParams.get('id') as string} resetData={fetchData}/>
                          </div>
          </Modal>
                              
    </>
  )
}