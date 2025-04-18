"use client"
import { Button, Popover, Tabs, TabsProps } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { TbStatusChange } from 'react-icons/tb'
import Detail from './Detail/Detail'
import Attach from './Attach/Attach'
import { PiUserListBold } from 'react-icons/pi'
import { FaClipboardList, FaHistory } from 'react-icons/fa'
import { MdOutlineReviews } from 'react-icons/md'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import ListUser from './ListUser/ListUser'
import ListTask from './ListTask/ListTask'
import ModalAddWork from '@/components/Work/Tool/Modal/ModalWork'
import ModalReview from './ModalReview/ModalReview'
import { IGetReview, IGetWork2 } from '@/models/activityInterface'
import activityService from '@/services/activityService'
import { useSearchParams } from 'next/navigation'
import ModalHistoryReview from './ModalHistoryReview/ModalHistoryReview'
import ModalStatus from './ModalStatus/ModalStatus'



export default function Introduce() {
    const [dataReview,setDataReview] = useState<IGetReview[]>([])
    const [dataWork,setDataWork] = useState<IGetWork2>()
    const [checkReview,setCheckReview] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const refBtn = useRef<HTMLButtonElement>()
    const refBtnAddReview = useRef<HTMLButtonElement>()
    const refBtnHistoryReview = useRef<HTMLButtonElement>()
    const refBtnWork = useRef<HTMLButtonElement>()
    const refBtnListTask = useRef<HTMLButtonElement>()
    const fetchData = async()=>{
      const res = await activityService.getReviews(searchParams.get('id')??"")
      const resWork = await activityService.getWorkById(searchParams.get('id')??"")
      const resCheck = await activityService.checkReview(searchParams.get('id')??"")
      if(res.statusCode === 200){
        setDataReview(res.data)

      }
      if(resCheck.statusCode === 200){
        setCheckReview(resCheck.data)
      }

      if(resWork.statusCode === 200){
        setDataWork(resWork.data)
      }
    }
    useEffect(()=>{
      fetchData()
    },[])
    const handleFetch = ()=>{
      fetchData()
    }
    const TabBarExtraContent= ()=>{
   
        return <div className='flex gap-1 items-center'>
            <Popover content={<ModalStatus fetchData={fetchData} work={dataWork as IGetWork2}/>}>
            <Button className='flex flex-col items-center justify-center h-16' type='text'>
            <TbStatusChange className='text-xl'/>
            <span className='text-xs font-medium'>Trạng thái</span>
            </Button>
            </Popover>
           
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtn.current?.click()}}>
            <PiUserListBold className='text-xl'/>
            <span className='text-xs font-medium'>Thực hiện</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtnListTask.current?.click()}}>
            <FaClipboardList className='text-xl'/>
            <span className='text-xs font-medium'>Đầu việc</span>
            </Button>
            {/* <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtnWork.current?.click()}}>
            <MdAssignmentAdd className='text-xl'/>
            <span className='text-xs font-medium'>Thêm việc</span>
            </Button> */}
            {
              checkReview ?
              <>
               {
                dataReview.length > 0 ? 
                <Button className='flex flex-col items-center justify-center h-16' type='text'  onClick={()=>{refBtnHistoryReview.current?.click()}}>
                  <FaHistory className='text-xl'/>
                  <span className='text-xs font-medium'>Lịch sử đánh giá</span>
                </Button>
                :
                <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtnAddReview.current?.click()}}>
                <MdOutlineReviews className='text-xl'/>
                <span className='text-xs font-medium'>Đánh giá</span>
                </Button>
                }
              </>:<>
              {
                 dataReview.length > 0 ? 
                 <Button className='flex flex-col items-center justify-center h-16' type='text'  onClick={()=>{refBtnHistoryReview.current?.click()}}>
                   <FaHistory className='text-xl'/>
                   <span className='text-xs font-medium'>Lịch sử đánh giá</span>
                 </Button>
                 :
                 <></>
              }
              </>
             
            }
            
           
            <Button className='flex flex-col items-center justify-center h-16' type='text'>
            <HiOutlineDocumentReport className='text-xl'/>
            <span className='text-xs font-medium'>Báo cáo</span>
            </Button>
        </div>
    }
    const tabs: TabsProps["items"] = [
        {
          label: <p className='text-xs font-medium'>Chi tiết</p>,
          key: "detail",
          children: (
           <Detail dataSource={dataWork as IGetWork2}/>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Đính kèm</p>,
          key: "attach",
          children: <Attach/>,
        }
      ];
     
     
  return (
    <div>
        <div className='flex px-4 flex-col'>
            
        <Tabs
            className="w-full custom-tabs 1text-xs !font-medium"
            
            items={tabs}
           
            tabBarExtraContent={TabBarExtraContent()}
            tabPosition={"top"}
            //   onChange={(e) => {
            //     setTabSelect(e);
            //   }}
          />
        </div>
        <ListUser refBtn={refBtn as Ref<HTMLButtonElement>}/>
        <ListTask refBtn={refBtnListTask as Ref<HTMLButtonElement>}/>
        <ModalAddWork refBtnWork={refBtnWork as Ref<HTMLButtonElement>}/>
          <ModalReview refBtn={refBtnAddReview as Ref<HTMLButtonElement>} handleOnclick={()=> handleFetch()}/>
          <ModalHistoryReview refBtn={refBtnHistoryReview as Ref<HTMLButtonElement>} dataSource={dataReview}/>
    </div>
  )
}