import React, { useEffect, useState } from 'react';
import {  Avatar, Steps } from 'antd';
import projectService from '@/services/projectService';
import { useSearchParams } from 'next/navigation';
import { IGetNotify } from '@/models/projectInterface';

const StepActivity: React.FC = () => {
  const [dataSource,setDataSource] = useState<{title:string,description:string}[]>([])
  const searchParams = useSearchParams()

  const fetchData=async()=>{
    const res = await projectService.getNotifies(searchParams.get('id') ?? "")
    if(res.statusCode === 200){
      setDataSource(res.data.map((dt:IGetNotify)=>{
        return{
          title:<> <div className='flex items-center gap-1'><Avatar size={'small'} alt='' src={dt.user_create.picture_url}/> <p className='text-sm'>{dt.user_create.first_name+" "+dt.user_create.last_name}</p></div></>,
          description:<><p className='text-sm flex flex-col'><span>{dt.description}</span> <span className='text-xs font-light text-blue-500'>vào lúc {new Date(dt.created_at).toLocaleString("vi-VN", { 
            timeZone: "UTC", 
            hour12: false 
        })}</span> </p></>
        }
      }))
    }
  }
  useEffect(()=>{
    const id = searchParams.get('id')
    if(id){
      fetchData()
    }
  },[searchParams])
  return ( <>
    <Steps
      progressDot
      current={1}
      direction="vertical"
      items={dataSource}
    />
  </>)
}
  
  


export default StepActivity;