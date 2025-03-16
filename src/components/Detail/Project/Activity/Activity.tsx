/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs, TabsProps } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { IoReturnUpBack } from 'react-icons/io5'
import { IoIosAdd } from 'react-icons/io'
import './styles.scss'
import { useParams, useRouter } from 'next/navigation'
import activityService from '@/services/activityService'
import TabInfoActivity from './Tabs/TabInfoProject/TabInfoActivity'
import TableActivity from './Table/TableActivity'
import { PieChartActivity } from '../Chart/PieChartActivity'
import ModalAddWork from '@/components/Work/Tool/Modal/ModalWork'

export default function Activity() {
    const refBtn = useRef<HTMLButtonElement>()
    const router = useRouter()
     const [dataDashboard,setDataDashboard] = useState<any>()
    
        const [dataActivity,setDataActivity] = useState<any>()
        const {id} = useParams()
        const fetchData = async()=>{
            const res = await activityService.dashboardActivity(id as string)
            const res2 = await activityService.getActivityById(id as string)
            if(res.statusCode === 200 && res2.statusCode === 200){
                setDataDashboard(res.data)
                setDataActivity(res2.data)
            }
        }
        useEffect(()=>{
            if(id)
                fetchData()
        },[id])
    const tabs: TabsProps["items"] = [
        {
            label: "Chi tiết hoạt động",
            key: "detail",
            children: <TabInfoActivity data={dataActivity} />,
          },
        {
          label: "Công việc",
          key: "ac",
          children: (
            <div className='flex flex-col'>
            <div className='py-4'>
                <Button className='text-xs' icon={<IoIosAdd />} onClick={()=>{refBtn.current?.click()}}>Thêm công việc</Button>
            </div>
            <div>
                <TableActivity/>
            </div>
            </div>
          ),
        }
        
      ];
  return (
    <div className='flex flex-col w-full'>
        <div className='p-1'>

            <Button type='link' icon={<IoReturnUpBack />} onClick={()=>{
router.back()
            }}>Quay lại</Button>
        </div>
        <div className='text-xl border-y-[1px] p-6'>
            <p>Theo dõi hoạt động</p>
        </div>
        <div className='p-6'>
            <p className='font-semibold'>Tổng quan</p>
            <p className='text-sm text-gray-400'>Hoạt động {dataActivity?.name}</p>
            <div className='flex py-2 gap-2 items-center flex-wrap'>
                <div className='flex-1 max-w-96 shadow-2xl shadow-blue-500/20 rounded-md'>
                    <div className='h-32'>
                        <PieChartActivity/>
                    </div>
                    
                </div>
                <div className='flex gap-2 h-32 flex-1 justify-around shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-md flex-wrap min-h-fit'>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>Số công việc</p>
                        <p className='font-semibold text-2xl'>4</p>
                        <p>100% công việc</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>CV xong</p>
                        <p className='font-semibold text-2xl'>{(dataDashboard?.completed ?? 0)}</p>
                        <p>{(dataDashboard?.completed ?? 0)*100/(dataDashboard?.total ?? 1)}% công việc</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>CV đang thực hiện</p>
                        <p className='font-semibold text-2xl'>{(dataDashboard?.process ?? 0)}</p>
                        <p>{(dataDashboard?.process ?? 0)*100/(dataDashboard?.total ?? 1)}% công việc</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>CV hủy</p>
                        <p className='font-semibold text-2xl'>{(dataDashboard?.deleted ?? 0)}</p>
                        <p>{(dataDashboard?.deleted ?? 0)*100/(dataDashboard?.total ?? 1)}% công việc</p>

                    </div>
                </div>
            </div>  
            <div>
            <Tabs
            className="w-full custom-tabs"
            items={tabs}
            tabPosition={"top"}
            //   onChange={(e) => {
            //     setTabSelect(e);
            //   }}
          />
            </div>
           
        </div>
        <ModalAddWork refBtnWork={refBtn as Ref<HTMLButtonElement>}/>
    </div>
  )
}