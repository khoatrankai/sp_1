/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Button, Table, TableColumnsType, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import './styles.scss'
import { MdOutlineStar } from 'react-icons/md'
import { useParams } from 'next/navigation';
import activityService from '@/services/activityService';
import { IGetActivity } from '@/models/activityInterface';

export default function TableActivity() {
  const {id} = useParams()
  const [dataSource,setDataSource] = useState<IGetActivity[]>()
   const [dataContractToday,setDataContractToday] = useState<IGetActivity[]>([])
    const [dataContractOther,setDataContractOther] = useState<any>()
    useEffect(()=>{
      if(dataSource){
        const dataToday = dataSource.filter((dt)=>{
          const time =  (new Date(dt.created_at)).toLocaleDateString('vi-vn')
          const timeToday = (new Date()).toLocaleDateString('vi-vn')
          return time === timeToday
        })
        const dataOther = dataSource.filter((dt)=>{
          const time =  (new Date(dt.created_at)).toLocaleDateString('vi-vn')
            const timeToday = (new Date()).toLocaleDateString('vi-vn')
          return time !== timeToday
        })
         const data = dataOther.reduce((preValue:any,currValue)=>{
          const time = new Date(currValue.created_at ?? "").toLocaleDateString("vi-VN")
          if(!preValue[time]){
            preValue[time] = []
          }
          preValue[time].push(currValue)
          return preValue
        },{})
        setDataContractOther(data)
        setDataContractToday(dataToday)
      }
    },[dataSource])
    const fetchData = async()=>{
      const res = await activityService.getActivityByContract(id as string)
      if(res.statusCode === 200){
        setDataSource(res.data)
      }
  }
    useEffect(()=>{
      if(id) fetchData()
    },[id])
   const columns: TableColumnsType<IGetActivity> = [
     
    {
      title: "",
      dataIndex: "activity_id",
      className: "text-xs",
      render: () => <>
      <Button icon={<MdOutlineStar className='text-yellow-400'/>} type='link'/>
      
      </>  || "N/A",
      width:2
    },
      {
        title: "",
        dataIndex: "name",
        className: "text-xs",
        render: (value: string,record:IGetActivity) => {
          let color = "";
                let text = "";
        
                switch (record.status.name_tag) {
                  case "process":
                    color = "gold";
                    text = "Đang thực hiện";
                    break;
                  case "completed":
                    color = "green";
                    text = "Bắt đầu";
                    break;
                  case "delete":
                    color = "red";
                    text = "Đã xóa";
                    break;
                  case "hide":
                    color = "gray";
                    text = "Đã ẩn";
                    break;
                  
                  default:
                    color = "default";
                    text = "Không xác định";
                }
          return <div className='flex gap-2 items-center'>
        <a className='capitalize' href={`/detail/activity/${record.activity_id}?activity=${record.activity_id}`}>
        {
          (value?.length ?? 0)>40? `${(value??"").slice(0, 40)}...`:(value ??"N/A")
        }
        </a>
        <Tag className="" color={color}>
                      {text}
                    </Tag>
       
        </div>},
      },
      {
        title: "",
        dataIndex: ['customer','name_company'],
        className: "text-xs",
      },
      {
        title: "",
        dataIndex: ['customer','phone_number'],
        className: "text-xs",
      },
       
      
   
    ];
  return (
    <div  className="flex flex-col gap-2 max-w-full w-full rounded-lg h-96">

    <div className='flex flex-col gap-2'>
      <div >
      
     
              <div>
              <div>
      <div className='w-full flex items-center'>
              <p className='font-bold text-sm text-center'>Ngày hôm nay <span className='font-light'>({dataContractToday.length})</span></p>
                
             
              </div>
       
       <div>
       <Table<any>
           columns={columns}
           dataSource={dataContractToday}
           scroll={{ x: "max-content" }}
           showHeader={false}
           pagination={false}
           showSorterTooltip={{ target: "sorter-icon" }}
         />
       </div>
        </div>
            {
                        dataContractOther && Object.keys(dataContractOther).map((dt)=>{
                          return <>
                             <div className='my-4'>
                                <p className='font-bold text-sm'>Ngày {dt} <span className='font-light'>({dataContractOther[dt].length})</span> </p>
                              
                              <div>
                              <Table<IGetActivity>
                                  columns={columns}
                                  dataSource={dataContractOther[dt]}
                                  scroll={{ x: "max-content" }}
                                  showHeader={false}
                                  pagination={false}
                                  showSorterTooltip={{ target: "sorter-icon" }}
                                />
                              </div>
                                </div>
                          </>
                        })
                      }
              </div>
   
       
      </div>
    </div>
    </div>
  )
}