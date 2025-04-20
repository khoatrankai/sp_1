"use client"
import { Button, Popover, Tabs, TabsProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { TbStatusChange } from 'react-icons/tb'
import Detail from './Detail/Detail'
import Attach from './Attach/Attach'
// import { PiUserListBold } from 'react-icons/pi'
// import { MdAssignmentAdd } from 'react-icons/md'
// import { HiOutlineDocumentReport } from 'react-icons/hi'
import TableWork from './TableWork/TableWork'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaChartGantt } from 'react-icons/fa6'
import projectService from '@/services/projectService'
import { IGetProject } from '@/models/projectInterface'
import ModalStatus from './ModalStatus/ModalStatus'



export default function Introduce() {
    // const [dataReview,setDataReview] = useState<IGetReview[]>([])
    const searchParams = useSearchParams()
    const [dataSource,setDataSource] = useState<IGetProject>()
    const router = useRouter()
    const [activeKey, setActiveKey] = useState("detail");
    // const refBtn = useRef<HTMLButtonElement>()
    // const refBtnWork = useRef<HTMLButtonElement>()
    const fetchData = async(id:string)=>{
    const res = await projectService.getProject(id)
    if(res.statusCode === 200){
      setDataSource(res.data)
    }
  }
  useEffect(()=>{
    const id = searchParams.get('id')
    if(id){
      fetchData(id)
    }
  },[searchParams])
  
    const TabBarExtraContent= ()=>{
   
        return <div className='flex gap-1 items-center'>
             <Popover content={<ModalStatus fetchData={fetchData} project={dataSource as IGetProject}/>}>
            <Button className='flex flex-col items-center justify-center h-16' type='text'>
            <TbStatusChange className='text-xl'/>
            <span className='text-xs font-medium'>Trạng thái</span>
            </Button>
            </Popover>
            {/* <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtn.current?.click()}}>
            <PiUserListBold className='text-xl'/>
            <span className='text-xs font-medium'>Tham gia</span>
            </Button> */}
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{
              router.push('/management/detail_project/gantt')
            }}>
            <FaChartGantt className='text-xl'/>
            <span className='text-xs font-medium'>Gantt</span>
            </Button>
            {/* <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtnWork.current?.click()}}>
            <MdAssignmentAdd className='text-xl'/>
            <span className='text-xs font-medium'>Thêm việc</span>
            </Button> */}
           
            {/* <Button className='flex flex-col items-center justify-center h-16' type='text'>
            <HiOutlineDocumentReport className='text-xl'/>
            <span className='text-xs font-medium'>Báo cáo</span>
            </Button> */}
        </div>
    }
    const tabs: TabsProps["items"] = [
        {
          label: <p className='text-xs font-medium'>Chi tiết</p>,
          key: "detail",
          children: (
           <Detail dataSource={dataSource as IGetProject}/>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Công việc</p>,
          key: "works",
          children: (
           <TableWork/>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Báo cáo</p>,
          key: "report",
          children: (
           <></>
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
            activeKey={activeKey}
            onChange={(key)=>{
              setActiveKey(key)
            }}
            items={tabs}
           
            tabBarExtraContent={TabBarExtraContent()}
            tabPosition={"top"}
            //   onChange={(e) => {
            //     setTabSelect(e);
            //   }}
          />
        </div>
        {/* <ListUser refBtn={refBtn as Ref<HTMLButtonElement>}/>
        <ListTask refBtn={refBtnListTask as Ref<HTMLButtonElement>}/>
        <ModalAddWork refBtnWork={refBtnWork as Ref<HTMLButtonElement>}/>
          <ModalReview refBtn={refBtnAddReview as Ref<HTMLButtonElement>} handleOnclick={()=> handleFetch()}/>
          <ModalHistoryReview refBtn={refBtnHistoryReview as Ref<HTMLButtonElement>} dataSource={dataReview}/> */}
    </div>
  )
}