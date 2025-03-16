/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs, TabsProps } from 'antd'
import React, { Ref, useEffect, useRef, useState } from 'react'
import { IoReturnUpBack } from 'react-icons/io5'
import { ChartPie } from '../Chart/PieChart'
import { IoIosAdd } from 'react-icons/io'
import TableContract from './Table/TableContract'
import TabInfoProject from './Tabs/TabInfoProject/TabInfoProject'
import './styles.scss'
import { useParams, useRouter } from 'next/navigation'
import { IGetProject } from '@/models/projectInterface'
import projectService from '@/services/projectService'
import contractService from '@/services/contractService.'
import ModalAddContract from '@/components/Contract/Tool/Modal/ModalContract'

export default function Project() {
  const refBtn = useRef<HTMLButtonElement>()
  const router = useRouter()
  const { id } = useParams();
  const [dataProject, setDataProject] = useState<IGetProject>();
  const [dataDashboard,setDataDashboard] = useState<any>()
  const fetchDataDashboard = async ()=>{
    const res = await contractService.getContractDashboardByProject(id as string)
    if(res.statusCode === 200){
      setDataDashboard(res.data)
    }
  }
  useEffect(()=>{
    if(id){
      fetchDataDashboard()
    }
  },[id])
  const fetchData = async () => {
      const res = await projectService.getFullProject(id as string);
      if (
        res.statusCode === 200 
      ) {
        setDataProject(res.data);
      }
    };
  
    useEffect(() => {
      if (id) {
        fetchData();
      }
    }, [id]);
    const tabs: TabsProps["items"] = [
        {
            label: "Chi tiết dự án",
            key: "detail",
            children: <TabInfoProject  />,
          },
        {
          label: "Hợp đồng",
          key: "contract",
          children: (
            <div className='flex flex-col'>
            <div className='py-4'>
                <Button className='text-xs' icon={<IoIosAdd />} onClick={()=>{refBtn.current?.click()}}>Thêm hợp đồng</Button>
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
            <p>Chi tiết dự án</p>
        </div>
        <div className='p-6'>
            <p className='font-semibold'>Tổng quan</p>
            <p className='text-sm text-gray-400'>Dự án {dataProject?.name}</p>
            <div className='flex py-2 gap-2 items-center flex-wrap'>
                <div className='flex-1 max-w-96 shadow-2xl shadow-blue-500/20 rounded-md'>
                    <div className='h-32'>
                        <ChartPie/>
                    </div>
                    
                </div>
                <div className='flex gap-2 h-32 flex-1 justify-around shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] rounded-md flex-wrap min-h-fit'>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>HĐ đúng hạn</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.expired_success ?? 0}</p>
                        <p>{(dataDashboard?.expired_success??0)/(dataDashboard?.total ?? 1)}% hợp đồng</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>HĐ trễ hạn</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.overdue ?? 0}</p>
                        <p>{(dataDashboard?.overdue??0)/(dataDashboard?.total ?? 1)}% hợp đồng</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>HĐ đã hủy</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.delete ?? 0}</p>
                        <p>{(dataDashboard?.delete??0)/(dataDashboard?.total ?? 1)}% hợp đồng</p>

                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center p-2 min-w-fit'>
                        <p>HĐ tạm dừng</p>
                        <p className='font-semibold text-2xl'>{dataDashboard?.hide ?? 0}</p>
                        <p>{(dataDashboard?.hide??0)/(dataDashboard?.total ?? 1)}% hợp đồng</p>

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
        <ModalAddContract refBtnContract={refBtn as Ref<HTMLButtonElement>}/>
    </div>
  )
}