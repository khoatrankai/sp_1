/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs, TabsProps } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { IoReturnUpBack } from 'react-icons/io5'
import { IoIosAdd } from 'react-icons/io'
import TableContract from './Table/TableActivity'
import TabInfoContract from './Tabs/TabInfoProject/TabInfoContract'
import './styles.scss'
import activityService from '@/services/activityService'
import { useParams, useRouter } from 'next/navigation'
import contractService from '@/services/contractService.'
import { ChartPieContract } from '../Chart/PieChartContract'
import ModalAddActivity from '@/components/Activity/Tool/Modal/ModalActivity'

export default function Contract() {
    const router = useRouter()
    const refBtn = useRef<HTMLButtonElement>()
    const [dataDashboard,setDataDashboard] = useState<any>()
    const [dataContract,setDataContract] = useState<any>()
    const {id} = useParams()
    const fetchData = async()=>{
        const res = await activityService.dashboardContract(id as string)
        const res2 = await contractService.getContract(id as string)
        console.log(res,res2)
        if(res.statusCode === 200 && res2.statusCode === 200){
            setDataDashboard(res.data)
            setDataContract(res2.data)
        }
    }
    useEffect(()=>{
        if(id)
            fetchData()
    },[id])

    const tabs: TabsProps["items"] = [
        {
            label: "Chi tiết hợp đồng",
            key: "detail",
            children: <TabInfoContract  data={dataContract}/>,
          },
        {
          label: "Hoạt động",
          key: "ac",
          children: (
            <div className='flex flex-col'>
            <div className='py-4'>
                <Button className='text-xs' icon={<IoIosAdd />} onClick={()=>{
                    refBtn.current?.click()
                }}>Thêm hoạt động</Button>
            </div>
            <div>
                <TableContract/>
            </div>
            </div>
          ),
        }
        
      ];
  return (
    <div className='flex flex-col w-full'>
        <div className='p-1'>

            <Button type='link' icon={<IoReturnUpBack />}  onClick={()=>{
router.back()
            }}>Quay lại</Button>
        </div>
        <div className='text-xl border-y-[1px] p-6'>
            <p>hoạt động đang theo dõi</p>
        </div>
        <div className='p-6'>
            <p className='font-semibold'>Tổng quan</p>
            <p className='text-sm text-gray-400'>Hợp đồng {dataContract?.name_contract}</p>
            <div className='flex py-2 gap-2 items-center flex-wrap'>
                <div className='flex-1 max-w-96 shadow-2xl shadow-blue-500/20 rounded-md'>
                    <div className='h-32'>
                      
                        <ChartPieContract/>
                    </div>
                    
                </div>
                <div className='flex gap-2 h-32 flex-1 justify-around shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-md flex-wrap min-h-fit'>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>Số hoạt động</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.total ?? 0}</p>
                        <p>100% hoạt động</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>HĐ xong</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.completed ?? 0}</p>
                        <p>{(dataDashboard?.completed??0)*100/(dataDashboard?.total??1)}% hoạt động</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>HĐ đang thực hiện</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.process ?? 0}</p>
                        <p>{(dataDashboard?.process??0)*100/(dataDashboard?.total??1)}% hoạt động</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>HĐ hủy</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.delete ?? 0}</p>
                        <p>{(dataDashboard?.delete??0)*100/(dataDashboard?.total??1)}% hoạt động</p>

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
        <ModalAddActivity refBtnActivity={refBtn as Ref<HTMLButtonElement>} />
    </div>
  )
}