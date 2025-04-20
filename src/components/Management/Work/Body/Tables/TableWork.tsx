/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { IGetWork2 } from '@/models/activityInterface'
import { RootState } from '@/redux/store/store';
import { Avatar, Progress, Table, TableColumnsType, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import activityService from '@/services/activityService';
import { useSearchParams } from 'next/navigation';
import Link from 'antd/es/typography/Link';


export default function TableWork() {
  const searchParams = useSearchParams();
  const [dataSources,setDataSources] = useState<IGetWork2[]>([])
  const [currentPage,setCurrentPage ] = useState<number>()
  // const [totalPage,setTotalPage ] = useState<number>(1)
  const fetchData = async (status?:string,type?:string)=>{
    console.log(status,type)
    const res = await activityService.getWorksFilter({page:currentPage,status,type})
    if(res.statusCode === 200){
      setDataSources(res.data.datas)
      // setTotalPage(res.data.total_pages !== 0 ? res.data.total_pages:1)
      setCurrentPage(res.data.current_page)
    }
  }
  useEffect(()=>{
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    // if(status || type){
    //   fetchData(status ?? undefined,type ?? undefined )
    // }else{
    //   fetchData()
    // }
    // console.log(status,type)
    // if(!currentPage || currentPage<= totalPage){
      fetchData(status ?? undefined,type ?? undefined)
    // }
  },[searchParams,currentPage])

    const { datas: dataUsers } = useSelector(
        (state: RootState) => state.get_users
      );
    const columns: TableColumnsType<IGetWork2> = [
         
       
          {
            title: "Tên công việc",
            dataIndex: "name",
            className: "text-xs",
            render: (value: string,record:IGetWork2) => {
              return <>
              <Link href={`/management/detail_work?id=${record.work_id}`}>
                <p className='text-xs font-medium break-words text-wrap max-w-96'>{value.length > 30 ? `${value.slice(0, 30)}...`:value}</p>
                <p className='text-xs break-words text-wrap max-w-96 text-gray-500'>{ record?.description && record?.description?.length > 100 ? `${record?.description?.slice(0, 100)}...`:record?.description}</p>
              </Link>
              </>
              
            },
          },
          {
            title: "Giao việc",
            dataIndex: "user_create",
            className: "text-xs",
            render: (value:string,record:IGetWork2) => <div className='flex gap-1 w-full items-center font-medium justify-end'>
           
            <Avatar style={{ backgroundColor: '#87d068' }} src={dataUsers?.find((dt)=> dt.user_id === (record.user_create??""))?.picture_url} icon={<UserOutlined className='text-xs'/>} >{dataUsers?.find((dt)=> dt.user_id === (record.user_create ?? ""))?.last_name}</Avatar>
            
            </div> ,
          }
          ,
          {
            title: "Thực hiện",
            dataIndex: "list_user",
            className: "text-xs",
            render: (value:string,record:IGetWork2) => <div className='flex gap-1 w-full items-center font-medium justify-end'>
           
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
            dataIndex: "tasks",
            className: "text-xs",
            render: (value:string,record:IGetWork2) => <div className='flex gap-1 w-full items-center font-medium justify-end'>
           {
            record?.tasks?.length && record.tasks.length > 0 ?  <Progress percent={((record.tasks?.filter(dt => dt.status === "success").length ?? 0) / (record.tasks?.length ?? 1))*100} /> : <Progress percent={0} />
           }
           
            
            </div> ,
          },
          {
            title: "Ngày tạo",
            className: "text-xs",
            dataIndex: "created_at",
            render: (value?: Date) =>
              value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
           
          },
          {
            title: "Ngày bắt đầu",
            className: "text-xs",
            dataIndex: "time_start",
            render: (value?: Date) =>
              value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
            
          },
          {
            title: "Ngày kết thúc",
            className: "text-xs",
            dataIndex: "time_end",
            render: (value?: Date) =>
              value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
           
          },
          
       
        ];
  return (
    <div className='w-full'>
         <Table<IGetWork2>
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