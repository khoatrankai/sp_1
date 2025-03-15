/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { FaRegCalendarDays } from 'react-icons/fa6'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { VscServerProcess } from 'react-icons/vsc'
import TableProject from './Table/TableProject'
import projectService from '@/services/projectService'


export default function List() {

  const [dataDashboard,setDataDashboard] = useState<{total_project:number,
    process_project:number,
    completed_project:number,
    cancel_project:number}>()
    const fetchData = async()=>{
      const res = await projectService.dashboardProject()
      if(res.statusCode === 200){
        setDataDashboard(res.data)
      }
    }
    useEffect(()=>{
      fetchData()
    },[])
  return (
    <div className='flex flex-col gap-2 px-4'>
      <div className='flex flex-wrap justify-between items-center gap-4 py-4'>
        <div className='h-36 flex-1 rounded-md justify-center pt-6 gap-4 flex bg-blue-100 text-blue-500 min-w-28'>
          <div className='flex flex-col w-fit items-center gap-4'>
          <BsArrowsFullscreen className='text-2xl'/>
          <div className='flex flex-col w-fit justify-center items-center'>
            <p className='text-sm font-semibold break-words text-wrap text-center'>Hôm nay</p>
            <p className='text-xl font-semibold'>{dataDashboard?.total_project}</p>
          </div>
          </div>
        
        </div>
        <div className='h-36 flex-1 rounded-md justify-center pt-6 gap-4 flex bg-orange-100 text-orange-500 min-w-28'>
        <div className='flex flex-col w-fit items-center gap-4'>

          <VscServerProcess className='text-2xl'/>
          <div className='flex flex-col w-fit justify-center items-center'>
            <p className='text-sm font-semibold break-words text-wrap text-center'>Đang thực hiện</p>
            <p className='text-xl font-semibold'>{dataDashboard?.process_project}</p>
          </div>
        </div>
        </div>
        <div className='h-36 flex-1 rounded-md justify-center pt-6 gap-4 flex bg-green-100 text-green-500 min-w-28'>
        <div className='flex flex-col w-fit items-center gap-4'>

          <FaRegCalendarDays className='text-2xl'/>
          <div className='flex flex-col w-fit justify-center items-center'>
            <p className='text-sm font-semibold break-words text-wrap text-center'>Đã hoàn tất</p>
            <p className='text-xl font-semibold'>{dataDashboard?.completed_project}</p>
          </div>
        </div>
        </div>
        <div className='h-36 flex-1 rounded-md justify-center pt-6 gap-4 flex bg-red-100 text-red-500 min-w-28'>
        <div className='flex flex-col w-fit items-center gap-4'>

          <RiDeleteBin2Line className='text-2xl'/>
          <div className='flex flex-col w-fit justify-center items-center'>
            <p className='text-sm font-semibold break-words text-wrap text-center'>Đã hủy</p>
            <p className='text-xl font-semibold'>{dataDashboard?.cancel_project}</p>
          </div>
        </div>
        </div>
      </div>
      <div className='flex gap-4'>
        {/* <div className='w-full max-w-80'>
          <ModalChartColumn/>
        </div> */}
        <div className='flex-1 max-w-full'>
          <TableProject/>
        </div>
      </div>
    </div>
  )
}