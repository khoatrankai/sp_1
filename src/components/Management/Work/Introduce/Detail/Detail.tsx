import {  IGetWork2 } from '@/models/activityInterface'
import activityService from '@/services/activityService';
import { Avatar, Progress, Tooltip } from 'antd'
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'



export default function Detail() {
  const searchParams = useSearchParams();
  const [dataSource,setDataSource] = useState<IGetWork2>()
  const fetchData = async(id:string)=>{
    const res = await activityService.getWorkById(id)
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
  return (
    <>
      <div className='flex flex-col gap-8'>
      <div>
        <p className='p-4 bg-gray-100'>Thông tin chung</p>
        <div className='flex flex-wrap gap-x-16 gap-y-6 p-4'>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400'>Tên công việc</p>
              <p className='font-medium'>{dataSource?.name}</p>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400'>Trạng thái</p>
              <p className='font-medium'>{dataSource?.status.name}</p>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400'>Tiến độ</p>
              <div className='w-56'>
              {
            dataSource?.tasks?.length && dataSource.tasks.length > 0 ?  <Progress percent={((dataSource.tasks?.filter(dt => dt.status === "success").length ?? 0) / (dataSource.tasks?.length ?? 1))*100} /> : <Progress percent={100} />
           }
              </div>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400'>Thời gian dự kiến</p>
              <p className='font-medium'>{new Date(dataSource?.time_end ?? "").toLocaleDateString('vi-vn')}</p>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400'>Người giao việc</p>
              <p className='font-medium'>{dataSource?.user_create?.first_name} {dataSource?.user_create?.last_name}</p>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400 min-w-fit'>Người thực hiện</p>
              <div className='flex gap-1 w-full items-center font-medium justify-end'>
           
           <Avatar.Group
                max={{
                  count: 5,
                  style: {
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                  },
                }}
              >
                {dataSource?.list_user?.map((dt,index) => {
                 
                  return (
                    <Tooltip
                    key={index}
                      title={
                        dt?.first_name ?? "" + dt?.last_name ?? ""
                      }
                      placement="top"
                    >
                      <Avatar
                        src={dt?.picture_url}
                        alt={
                          dt?.first_name ?? "" + dt?.last_name ?? ""
                        }
                        style={{ backgroundColor: "#87d068" }}
                      />
                    </Tooltip>
                  );
                })}
              </Avatar.Group>
            
            </div>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400'>Ưu tiên</p>
              <p className='font-medium'>{dataSource?.urgent ? 'Làm gấp':'Bình thường'}</p>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between'>
              <p className='font-base text-gray-400'>Loại công việc</p>
              <p className='font-medium'>{dataSource?.type.name}</p>
            </div>
            <div className='flex max-w-md flex-1 min-w-96 justify-between flex-col'>
              <p className='font-base text-gray-400'>Mô tả</p>
              <p className='font-medium break-words text-wrap'>{dataSource?.description}</p>
            </div>
        </div>
    </div>
    <div>
        <p className='p-4'>Thảo luận</p>
       
    </div>
      </div>
    </>
   
  )
}