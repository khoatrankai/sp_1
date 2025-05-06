/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { RootState } from '@/redux/store/store';
import { Avatar, Progress, Table, TableColumnsType, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import Link from 'antd/es/typography/Link';
import { IGetActivity, IGetWork } from '@/models/activityInterface';
import { Tag } from 'antd/lib';
import activityService from '@/services/activityService';
import { FaRegFolderOpen } from 'react-icons/fa';


export default function TableWork() {
  const searchParams = useSearchParams();
  const [dataSources,setDataSources] = useState<IGetWork[]>([])
  // const [totalPage,setTotalPage ] = useState<number>(1)
  const fetchData = async (id:string)=>{
    const res = await activityService.getWorksFollowActivityByProject(id)
    if(res.statusCode === 200){
      const datas:any = []
      res.data.map((dt:IGetActivity) => {
        datas.push({name:dt.name})
        dt.works?.map((dtt)=>{
          datas.push(dtt)
        })
      })
      setDataSources(datas)
      // setTotalPage(res.data.total_pages !== 0 ? res.data.total_pages:1)
    }
  }
  useEffect(()=>{
    const id = searchParams.get('id')
    if(id)
    fetchData(id)
  },[searchParams])

    const { datas: dataUsers } = useSelector(
        (state: RootState) => state.get_users
      );
    const columns: TableColumnsType<IGetWork> = [
      {
        title: "Tên công việc",
        dataIndex: "name",
        className: "text-xs",
        render: (value: string,record:IGetWork) => {
          return <>
          {
            record.work_id ?  <Link href={`/management/detail_work?id=${record.work_id}`}>
            <p className='text-xs font-medium break-words text-wrap max-w-96 pl-4'>{value.length > 30 ? `${value.slice(0, 30)}...`:value}</p>
          </Link> : <div className='text-xs font-medium break-words text-wrap max-w-96 flex items-center gap-2'><span><FaRegFolderOpen/></span> <p>{value.length > 30 ? `${value.slice(0, 30)}...`:value}</p></div>
          }
         
          </>
          
        },
      },
      {
        title: "Người giao việc",
        dataIndex: ['user_create'],
        className: "text-xs",
        render: (value: string,record:IGetWork) => {
          return <>
          {
            record.work_id ? 
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
            title: "Người thực hiện",
            dataIndex: "list_user",
            className: "text-xs",
            render: (value:string,record:IGetWork) => 
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
                {record.list_user?.map((dt,index) => {
                 
                  return (
                    <Tooltip
                    key={index}
                      title={
                        dataUsers?.find(dtt => dtt.user_id === dt.user)?.first_name ?? "" + dataUsers?.find(dtt => dtt.user_id === dt.user)?.last_name ?? ""
                      }
                      placement="top"
                    >
                      <Avatar
                        src={dataUsers?.find(dtt => dtt.user_id === dt.user)?.picture_url}
                        alt={
                          dataUsers?.find(dtt => dtt.user_id === dt.user)?.first_name ?? "" + dataUsers?.find(dtt => dtt.user_id === dt.user)?.last_name ?? ""
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
                    title: "Trạng thái",
                    dataIndex: ['work_id'],
                    className: "text-xs",
                    render: (value:string,record) => 
                      <>
                        {record.status?.name_tag ?  <Tag
                    color={record.status?.name_tag === "cancel" ? 'red':record.status?.name_tag === "completed" ? 'green':record.status?.name_tag === "pause" ? 'yellow':record.status?.name_tag === "start" ? 'blue':'gold'}
                    >{record.status?.name_tag === "cancel" ? 'Đã hủy':record.status?.name_tag === "completed" ? 'Hoàn thành':record.status?.name_tag === "pause" ? 'Tạm dừng':record.status?.name_tag === "start" ? 'Bắt đầu':'Chờ'}</Tag>:""}
                      </>
                      ,
                  },
          {
            title: "Tiến độ",
            dataIndex: "work_id",
            className: "text-xs",
            render: (value:string,record:IGetWork) => <div className='flex gap-1 w-full items-center font-medium justify-end'>
              <>
                {
                  value ? ((record.tasks?.filter(dt => dt.status === "success").length ?? 0) > 0) || (record.status?.name_tag === "completed") ?  <Progress percent={record.status?.name_tag === "completed" ? 100 : ((record.tasks?.filter(dt => dt.status === "success").length ?? 0) / ((record.tasks?.length ?? 1) ?? 1))*100} /> : <Progress percent={0} /> :""
                }
              
              </>
          
           
            
            </div> ,
          },

          {
            title: "Ngày bắt đầu",
            className: "text-xs",
            dataIndex: "time_start",
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
            dataIndex: "time_end",
            render: (value?: string) =>
              value ? new Date(value).toLocaleDateString("vi-VN") : "",
           
          },
          
       
        ];
  return (
    <div className='w-full'>
         <Table<IGetWork>
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