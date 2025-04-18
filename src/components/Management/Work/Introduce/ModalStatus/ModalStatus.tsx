/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from '@/hooks/usePostData';
import {  IGetWork2 } from '@/models/activityInterface';
import { RootState } from '@/redux/store/store';
import activityService from '@/services/activityService';
import {  Radio } from 'antd'
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

type Props = {
  work:IGetWork2
  fetchData:any
}

export default function ModalStatus({work,fetchData}:Props) {
    const {postdata} = usePostData()
    const searchParams = useSearchParams()
    
    const { datas: dataTypeWork } = useSelector(
        (state: RootState) => state.get_type_work
      );
      const handleChange = async(e:any)=>{
        const statusCode = await postdata(()=> activityService.updateWork(work?.work_id ?? "",{status:e.target.value})) 
        if(statusCode === 200){
            fetchData()
        }
      }
    useEffect(()=>{
      const id = searchParams.get('id')
      if(id){
        fetchData()
      }
    },[searchParams])
  return (
    <>
    <Radio.Group
      style={style}
      onChange={handleChange}
      value={work?.status?.status_work_id}
      options={dataTypeWork.find(dt => dt.type_work_id === work?.type?.type_work_id)?.status?.map(dt => {
        return {label:dt.name,value:dt.status_work_id}
      })}
    />
    </>
  )
}