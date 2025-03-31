"use client"
import { Button, Tabs, TabsProps } from 'antd'
import React, { Ref, useRef } from 'react'
import { TbStatusChange } from 'react-icons/tb'
import Detail from './Detail/Detail'
import Attach from './Attach/Attach'
import { PiUserListBold } from 'react-icons/pi'
import { FaClipboardList } from 'react-icons/fa'
import { MdAssignmentAdd } from 'react-icons/md'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import ListUser from './ListUser/ListUser'
import ListTask from './ListTask/ListTask'
import ModalAddWork from '@/components/Work/Tool/Modal/ModalWork'



export default function Introduce() {
    const refBtn = useRef<HTMLButtonElement>()
    const refBtnWork = useRef<HTMLButtonElement>()
    const refBtnListTask = useRef<HTMLButtonElement>()
    const TabBarExtraContent= ()=>{
   
        return <div className='flex gap-1 items-center'>
            <Button className='flex flex-col items-center justify-center h-16' type='text'>
            <TbStatusChange className='text-xl'/>
            <span className='text-xs font-medium'>Trạng thái</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtn.current?.click()}}>
            <PiUserListBold className='text-xl'/>
            <span className='text-xs font-medium'>Thực hiện</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtnListTask.current?.click()}}>
            <FaClipboardList className='text-xl'/>
            <span className='text-xs font-medium'>Đầu việc</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtnWork.current?.click()}}>
            <MdAssignmentAdd className='text-xl'/>
            <span className='text-xs font-medium'>Thêm việc</span>
            </Button>
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
           <Detail/>
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
    </div>
  )
}