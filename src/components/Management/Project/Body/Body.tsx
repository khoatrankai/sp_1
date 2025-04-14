/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button, Tabs, TabsProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { CiBoxList, CiExport, CiImport } from 'react-icons/ci'
import { FaChartGantt } from 'react-icons/fa6'
import { TbLayoutKanban } from 'react-icons/tb'
import TableProject from './Tables/TableProject'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import Kanban from './Kanban/Kanban'
import dynamic from 'next/dynamic'
import activityService from '@/services/activityService'
const ComponentGantt = dynamic(
  () => import("./Gantt/Gantt")
);





export default function BodyProject() {
    const router = useRouter()
    const [dashboardManagement,setDashboardManagement] = useState<any>()
    const searchParams = useSearchParams()
    const { datas: dataType } = useSelector(
      (state: RootState) => state.type_projects
    );

    const [type,setType] = useState<'basic'|'kanban'|'gantt'>('basic')
    const TabBarExtraContent= ()=>{
   
        return <div className='flex gap-1 items-center'>
            <Button className='flex flex-col items-center justify-center h-16' type='text' onClick={()=>{setType('kanban')}}>
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
          label: <p className='text-xs font-medium'>Chờ <span>({dashboardManagement?.waiting})</span></p>,
          key: "waiting",
          children: (
           <TableProject/>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Đang thực hiện <span>({dashboardManagement?.start})</span></p>,
          key: "start",
          children: <TableProject/>,
        },
        {
            label: <p className='text-xs font-medium'>Tạm dừng <span>({dashboardManagement?.pause})</span></p>,
            key: "pause",
          children: <TableProject/>,
        },
        
        { 
            label: <p className='text-xs font-medium'>Hoàn thành <span>({dashboardManagement?.completed})</span></p>,
            key: "completed",
          children: <TableProject/>,
        },
        { 
          label: <p className='text-xs font-medium'>Đã hủy<span>({dashboardManagement?.cancel})</span></p>,
          key: "cancel",
        children: <TableProject/>,
      },
      ];
      // const tabsType: TabsProps["items"] = [
      //   {
      //     label: <p className='text-xs font-medium'>Chờ <span>({1})</span></p>,
      //     key: "waitting",
      //     children: (
      //      <TableProject/>
      //     ),
      //   },
      //   {
      //     label: <p className='text-xs font-medium'>Đang thực hiện <span>({1})</span></p>,
      //     key: "process",
      //     children: <TableProject/>,
      //   },
      //   {
      //       label: <p className='text-xs font-medium'>Đang đánh giá <span>({1})</span></p>,
      //       key: "review",
      //     children: <TableProject/>,
      //   },
        
      //   {
      //       label: <p className='text-xs font-medium'>Chưa hoàn thành <span>({1})</span></p>,
      //       key: "yet_completed",
      //     children: <TableProject/>,
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
            Dự án
          </p>
          <ComponentGantt />
        </div>
           

            </>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Chờ <span>({dashboardManagement?.waiting})</span></p>,
          key: "waiting",
          children: (
            <>
            <div className="h-full translate-y-0 relative">
          <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
            {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
            Dự án
          </p>
          <ComponentGantt />
        </div>
           

            </>
          ),
        },
        {
          label: <p className='text-xs font-medium'>Đang thực hiện <span>({dashboardManagement?.start})</span></p>,
          key: "start",
          children:  <>
          <div className="h-full translate-y-0 relative">
        <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
          {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
          Dự án
        </p>
        <ComponentGantt />
      </div>

          </>,
        },
        {
            label: <p className='text-xs font-medium'>Tạm dừng <span>({dashboardManagement?.pause})</span></p>,
            key: "review",
          children:  <>
          <div className="h-full translate-y-0 relative">
        <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
          {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
          Dự án
        </p>
        <ComponentGantt />
      </div>

          </>,
        },
        
        {
            label: <p className='text-xs font-medium'>Hoàn thành <span>({dashboardManagement?.completed})</span></p>,
            key: "completed",
          children:  <>
          <div className="h-full translate-y-0 relative">
        <p className="px-4 pt-2 font-semibold text-base text-[#1AA59D] z-50 absolute top-0 left-0">
          {/* {dataContract.find((dt) => dt.contract_id === id)?.name_contract} */}
        </p>
        <ComponentGantt />
      </div>

          </>,
        },
        {
          label: <p className='text-xs font-medium'>Đã hủy <span>({dashboardManagement?.cancel})</span></p>,
          key: "cancel",
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
              label:<p className='text-xs font-medium'>{dt.name_type}</p>,
              key:dt.type_id,
              children: <>
                <Kanban id={dt.type_id}/>
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
              console.log(e,type)
              if(type === 'basic' ||type === 'gantt') {
                console.log(e)
                const typeParams = searchParams.get('type')
                  if(e === "all"){
                    if(typeParams){
                      router.push(`/management/all_project?type=${typeParams}`)}

                    else{
                    router.push(`/management/all_project`)}

                    
                  }
                  else{
                    if(typeParams){
                      router.push(`/management/all_project?type=${typeParams}&status=${e}`)}

                    else{
                    router.push(`/management/all_project?status=${e}`)}
                  }
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
    </div>
  )
}