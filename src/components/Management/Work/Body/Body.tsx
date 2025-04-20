/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button, Tabs, TabsProps } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { CiBoxList, CiExport, CiImport } from 'react-icons/ci'
import { FaChartGantt } from 'react-icons/fa6'
import { TbLayoutKanban } from 'react-icons/tb'
import TableWork from './Tables/TableWork'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import Kanban from './Kanban/Kanban'
import dynamic from 'next/dynamic'
import activityService from '@/services/activityService'
import { IoIosAdd } from 'react-icons/io'
import ModalAddWork from '@/components/Work/Tool/Modal/ModalWork'
const ComponentGantt = dynamic(
  () => import("./Gantt/Gantt")
);



export default function BodyWork() {
    const router = useRouter()
    const refBtnWork = useRef<HTMLButtonElement>()
    const [dashboardManagement,setDashboardManagement] = useState<any>()
    const searchParams = useSearchParams()
    const { datas: dataType } = useSelector(
      (state: RootState) => state.get_type_work
    );

    const [type,setType] = useState<'basic'|'kanban'|'gantt'>('basic')
    const TabBarExtraContent= ()=>{
   
        return <div className='flex gap-1 items-center'>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{
              setType('kanban')
              router.push(`/management/all_work?id=${dataType[0].type_work_id}`)
              }}>
            <TbLayoutKanban className='text-xl'/>
            <span className='text-xs font-medium'>Kanban</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{setType('basic')}}>
            <CiBoxList className='text-xl'/>
            <span className='text-xs font-medium'>Hiển thị</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{setType('gantt')}}>
            <FaChartGantt className='text-xl'/>
            <span className='text-xs font-medium'>Gantt chart</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{refBtnWork.current?.click()}}>
            <IoIosAdd className='text-xl'/>
            <span className='text-xs font-medium'>Thêm việc</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text'>
            <CiExport className='text-xl'/>
            <span className='text-xs font-medium'>Export</span>
            </Button>
            <Button className='flex flex-col items-center justify-center h-16' type='text'>
            <CiImport className='text-xl'/>
            <span className='text-xs font-medium'>Import</span>
            </Button>
        </div>
    }
    const tabs: TabsProps["items"] = [
      {
        label: <p className='text-xs font-medium'>Tất cả</p>,
        key: "all",
        children: (
         <TableWork/>
        ),
      },
        {
          label: <p className='text-xs font-medium'>Chờ <span>({dashboardManagement?.waitting})</span></p>,
          key: "waitting",
          children: (
           <TableWork/>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Đang thực hiện <span>({dashboardManagement?.process})</span></p>,
          key: "process",
          children: <TableWork/>,
        },
        {
            label: <p className='text-xs font-medium'>Đang đánh giá <span>({dashboardManagement?.review})</span></p>,
            key: "review",
          children: <TableWork/>,
        },
        
        { 
            label: <p className='text-xs font-medium'>Chưa hoàn thành <span>({dashboardManagement?.yet_completed})</span></p>,
            key: "yet_completed",
          children: <TableWork/>,
        },
      ];
      // const tabsType: TabsProps["items"] = [
      //   {
      //     label: <p className='text-xs font-medium'>Chờ <span>({1})</span></p>,
      //     key: "waitting",
      //     children: (
      //      <TableWork/>
      //     ),
      //   },
      //   {
      //     label: <p className='text-xs font-medium'>Đang thực hiện <span>({1})</span></p>,
      //     key: "process",
      //     children: <TableWork/>,
      //   },
      //   {
      //       label: <p className='text-xs font-medium'>Đang đánh giá <span>({1})</span></p>,
      //       key: "review",
      //     children: <TableWork/>,
      //   },
        
      //   {
      //       label: <p className='text-xs font-medium'>Chưa hoàn thành <span>({1})</span></p>,
      //       key: "yet_completed",
      //     children: <TableWork/>,
      //   },
      // ];

      const [tabsType,setTabsType] = useState<TabsProps["items"]>()

      const tabsGantt: TabsProps["items"] = [
        {
          label: <p className='text-xs font-medium'>Tất cả <span>({dashboardManagement?.total})</span></p>,
          key: "all",
          children: (
            <>
            <div className="h-full translate-y-0 relative">
          <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
            {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
            Công việc
          </p>
          <ComponentGantt />
        </div>
           

            </>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Chờ <span>({dashboardManagement?.waitting})</span></p>,
          key: "waitting",
          children: (
            <>
            <div className="h-full translate-y-0 relative">
          <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
            {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
            Công việc
          </p>
          <ComponentGantt />
        </div>
           

            </>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Đang thực hiện <span>({dashboardManagement?.process})</span></p>,
          key: "process",
          children:  <>
          <div className="h-full translate-y-0 relative">
        <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
          {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
          Công việc
        </p>
        <ComponentGantt />
      </div>

          </>,
        },
        {
            label: <p className='text-xs font-medium'>Đang đánh giá <span>({dashboardManagement?.review})</span></p>,
            key: "review",
          children:  <>
          <div className="h-full translate-y-0 relative">
        <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
          {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
          Công việc
        </p>
        <ComponentGantt />
      </div>

          </>,
        },
        
        {
            label: <p className='text-xs font-medium'>Chưa hoàn thành <span>({dashboardManagement?.yet_completed})</span></p>,
            key: "yet_completed",
          children:  <>
          <div className="h-full translate-y-0 relative">
        <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
          {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
        </p>
        <ComponentGantt />
      </div>

          </>,
        },
      ];
      useEffect(()=>{
        if(type === "kanban"){
          setTabsType(dataType.map(dt => {
            return {
              label:<p className='text-xs font-medium'>{dt.name}</p>,
              key:dt.type_work_id,
              children: <>
                <Kanban/>
              </>
            }
          }))
        }
      },[type,dataType])
      const fetchData = async(typeDashboard?:string)=>{
        const res = await activityService.getDashboardWorksManagement({type:typeDashboard})
        if(res.statusCode === 200){
          setDashboardManagement(res.data)
        }
      }
      useEffect(()=>{
          fetchData(searchParams.get('type') ?? undefined)
      },[searchParams])
  return (
    <div>
        <div className='flex px-4'>
        
        <Tabs
            className="w-full custom-tabs 1text-xs !font-medium"
            
            items={type ==='kanban'? tabsType:type === "gantt"?tabsGantt:tabs}
            onChange={(e)=>{
              if(type === 'basic' ||type === 'gantt') {
                  if(e === "all"){
                    const params = new URLSearchParams(searchParams.toString())
                    params.delete('status')
                    router.push(`/management/all_work?${params.toString()}`)

                  }
                  else{
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('status',e)
                    router.push(`/management/all_work?${params.toString()}`)
                    
                  }
                }else{
                  router.push(`/management/all_work?id=${e}`)
                }

              
                

              }
            }
            tabBarExtraContent={TabBarExtraContent()}
            tabPosition={"top"}
            //   onChange={(e) => {
            //     setTabSelect(e);
            //   }}
          />
        </div>
        <ModalAddWork refBtnWork={refBtnWork as Ref<HTMLButtonElement>}/>
    </div>
  )
}