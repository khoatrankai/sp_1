/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from '@/hooks/usePostData';
import { IGetProject } from '@/models/projectInterface';
import projectService from '@/services/projectService';
import CustomFormData from '@/utils/CustomFormData';
import {  Radio } from 'antd'
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

type Props = {
  project:IGetProject
  fetchData:any
}

export default function ModalStatus({project,fetchData}:Props) {
    const {postdata} = usePostData()
    const searchParams = useSearchParams()
    
    const dataStatusProject = [{status:'waiting',label:'Chờ'},{status:'start',label:'Bắt đầu'},{status:'pause',label:'Tạm dừng'},{status:'cancel',label:'Hủy'},{status:'completed',label:'Hoàn thành'}]
      const handleChange = async(e:any)=>{
        const formData = CustomFormData({status:e.target.value})
        const statusCode = await postdata(()=> projectService.updateProject(searchParams.get('id') ?? "",formData)) 
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
      value={project?.status}
      options={dataStatusProject.map(dt => {
        return {label:dt.label,value:dt.status}
      })}
    />
    </>
  )
}