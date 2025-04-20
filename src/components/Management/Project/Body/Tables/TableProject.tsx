/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { RootState } from '@/redux/store/store';
import { Avatar, Progress, Table, TableColumnsType, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Link from 'antd/es/typography/Link';
import { FaRegFolderOpen } from 'react-icons/fa';
import { IGetProject } from '@/models/projectInterface';
import projectService from '@/services/projectService';
import { useSearchParams } from 'next/navigation';


export default function TableProject() {
  const searchParams = useSearchParams()
  const [dataSources,setDataSources] = useState<IGetProject[]>([])
  // const [totalPage,setTotalPage ] = useState<number>(1)
  const fetchData = async ()=>{
    const res = await projectService.getProjects({limit:0,page:1,status:searchParams.get('status') ?? undefined,type_project:searchParams.get('type_project') ?? undefined})
    if(res.statusCode === 200){
      setDataSources(res.data)
      // setTotalPage(res.data.total_pages !== 0 ? res.data.total_pages:1)
    }
  }
  useEffect(()=>{
    fetchData()
  },[searchParams])

    const { datas: dataUsers } = useSelector(
        (state: RootState) => state.get_users
      );
    const columns: TableColumnsType<IGetProject> = [
      {
        title: "Người quản trị",
        dataIndex: ['user_support'],
        className: "text-xs",
        render: (value: string,record:IGetProject) => {
          return <>
          {
            record.project_id ? 
            <Avatar
                        src={dataUsers?.find(dt => dt.user_id === value)?.picture_url}
                        alt={
                          dataUsers?.find(dt => dt.user_id === value)?.first_name ?? "" + dataUsers?.find(dt => dt.user_id === value)?.last_name ?? ""
                        }
                        style={{ backgroundColor: "#87d068" }}
                      />:""
          }
          
          </>
          
        },
      },
      {
        title: "Mã dự án",
        dataIndex: "project_id",
        className: "text-xs",
        render: (value: string,record:IGetProject) => {
          return <>
          {
            record.project_id ?  <Link href={`/management/detail_project?id=${record.project_id}`}>
            <p className='text-xs font-medium break-words text-wrap max-w-96 pl-4'>{value.length > 30 ? `${value.slice(0, 30)}...`:value}</p>
          </Link> : <div className='text-xs font-medium break-words text-wrap max-w-96 flex items-center gap-2'><span><FaRegFolderOpen/></span> <p>{value.length > 30 ? `${value.slice(0, 30)}...`:value}</p></div>
          }
         
          </>
          
        },
      },
      {
        title: "Tên dự án",
        dataIndex: "name",
        className: "text-xs",
        
      },
     
      {
        title: "Người tham gia",
        dataIndex: "user_participants",
        className: "text-xs",
        render: (value:string,record:IGetProject) => 
        <div className='flex gap-1 w-full items-center font-medium'>
       
       <Avatar.Group
            max={{
              count: 5,
              style: {
                color: "#f56a00",
                backgroundColor: "#fde3cf",
              },
            }}
          >
            {record.user_participants?.map((dt,index) => {
             
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
        
        </div> ,
      },
       
          
         
          {
            title: "Tiến độ",
            dataIndex: "work_id",
            className: "text-xs",
            render: (value:string,record:IGetProject) => <div className='flex gap-1 w-full items-center font-medium justify-end'>
              <>
                {
                  value ? ((record.progress?.completed ?? 0) > 0) || (record.progress?.completed) ?  <Progress percent={record.progress?.completed ? 100 : ((record.progress?.completed ?? 0) / ((record.progress?.total ?? 1) ?? 1))*100} /> : <Progress percent={0} /> :""
                }
              
              </>
          
           
            
            </div> ,
          },

          {
            title: "Ngày bắt đầu",
            className: "text-xs",
            dataIndex: "start_date",
            render: (value?: string) =>
            {
              return <>
                {
                   value ? new Date(value).toLocaleDateString("vi-VN") : ""
                }
              </>
            }
              
            
          },
          {
            title: "Ngày kết thúc",
            className: "text-xs",
            dataIndex: "end_date",
            render: (value?: string) =>
              value ? new Date(value).toLocaleDateString("vi-VN") : "",
           
          },
          
       
        ];
  return (
    <div className='w-full'>
         <Table<IGetProject>
                                  columns={columns}
                                  dataSource={dataSources}
                                  scroll={{ x: "max-content" }}
                                  // showHeader={false}
                                  pagination={false}
                                  showSorterTooltip={{ target: "sorter-icon" }}
                                />
    </div>
  )
}