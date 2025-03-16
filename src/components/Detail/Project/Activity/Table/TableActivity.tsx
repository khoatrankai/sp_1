/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Button, Table, TableColumnsType, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import './styles.scss'
import { MdOutlineStar } from 'react-icons/md'
import { IGetWork } from '@/models/activityInterface';
import { useParams } from 'next/navigation';
import activityService from '@/services/activityService';
import Work from '../../Work/Work';

export default function TableActivity() {
  const [idWork,setIdWork] = useState<string>()
  const {id} = useParams()
    const [dataSource,setDataSource] = useState<IGetWork[]>()
     const [dataActivityToday,setDataActivityToday] = useState<IGetWork[]>([])
      const [dataActivityOther,setDataActivityOther] = useState<any>()
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
            const time = (new Date(currValue.created_at ?? "")).toLocaleDateString("vi-VN")
            if(!preValue[time]){
              preValue[time] = []
            }
            preValue[time].push(currValue)
            return preValue
          },{})
          setDataActivityOther(data)
          setDataActivityToday(dataToday)
        }
      },[dataSource])
      const fetchData = async()=>{
        const res = await activityService.getWorkByActivity(id as string)
        if(res.statusCode === 200){
          setDataSource(res.data)
        }
    }
      useEffect(()=>{
        if(id) fetchData()
      },[id])
   const columns: TableColumnsType<IGetWork> = [
     
    {
      title: "",
      dataIndex: "work_id",
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
        render: (value: string,record:IGetWork) => {
          let color = "";
                switch (record.status.name_tag) {
                  case "process":
                    color = "gold";
                    break;
                  case "completed":
                    color = "green";
                    break;
                  case "delete":
                    color = "red";
                    break;
                  case "hide":
                    color = "gray";
                    break;
                  
                  default:
                    color = "default";
                }
          return <div className='flex gap-2 items-center'>
        <p className='capitalize cursor-pointer' onClick={()=>{
          setIdWork(record.work_id)
        }}>
        {
          (value?.length ?? 0)>40? `${(value??"").slice(0, 40)}...`:(value ??"N/A")
        }
        </p>
        <Tag className="" color={color}>
                      {record.status.name}
                    </Tag>
       
        </div>},
      }
       
      
   
    ];
  return (
    <div  className="flex flex-col gap-2 max-w-full w-full rounded-lg h-96">
    
        <div className='flex flex-col gap-2'>
          <div >
          
         
                  <div>
                  <div>
          <div className='w-full flex items-center'>
                  <p className='font-bold text-sm text-center'>Ngày hôm nay <span className='font-light'>({dataActivityToday.length})</span></p>
                    
                 
                  </div>
           
           <div>
           <Table<IGetWork>
               columns={columns}
               dataSource={dataActivityToday}
               scroll={{ x: "max-content" }}
               showHeader={false}
               pagination={false}
               showSorterTooltip={{ target: "sorter-icon" }}
             />
           </div>
            </div>
                {
                            dataActivityOther && Object.keys(dataActivityOther).map((dt)=>{
                              return <>
                                 <div className='my-4'>
                                    <p className='font-bold text-sm'>Ngày {dt} <span className='font-light'>({dataActivityOther[dt].length})</span> </p>
                                  
                                  <div>
                                  <Table<IGetWork>
                                      columns={columns}
                                      dataSource={dataActivityOther[dt]}
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
        <Work id={idWork as string} setIdWork={setIdWork}/>
        </div>
  )
}