/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Button, Table, TableColumnsType, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import './styles.scss'
import { MdOutlineStar } from 'react-icons/md'
import { IGetContract } from '@/models/contractInterface';
import contractService from '@/services/contractService.';
import { useParams } from 'next/navigation';

export default function TableContract() {
  const {id} = useParams()
  const [dataContractToDay,setDataContractToday] = useState<IGetContract[]>()
  const [dataContractOther,setDataContractOther] = useState<any>()
   const columns: TableColumnsType<IGetContract> = [
     
    {
      title: "",
      dataIndex: "contract_id",
      className: "text-xs",
      render: () => <>
      <Button icon={<MdOutlineStar className='text-yellow-400'/>} type='link'/>
      
      </>  || "N/A",
      width:2
    },
      {
        title: "",
        dataIndex: "name_contract",
        className: "text-xs",
        render: (value: string,record:IGetContract) => {
          let color = "";
                let text = "";
        
                switch (record.status) {
                  case "active":
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
        <a className='capitalize' href={`/detail/contract/${record.contract_id}?contract=${record.contract_id}`}>
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
    const fetchData = async()=>{
      const res = await contractService.getContractsFilterbyProject({id:id as string})
      if(res.statusCode === 200){
        const dataContract = res.data
        // const dataToday = dataContract.filter((dt)=>{
        //   const dateNow = new Date()
        //   if()
        // })
        const dateNow = new Date()
        const dataToday = dataContract?.[dateNow.toLocaleDateString('vi-vn')] ?? []
        const dataOther = dataContract
        delete dataOther?.[dateNow.toLocaleDateString('vi-vn')]
        setDataContractOther(dataOther)
        setDataContractToday(dataToday)
      }
    }
    useEffect(()=>{
      if(id) 
        fetchData()
    },[id])
  return (
    <div  className="flex flex-col gap-2 max-w-full w-full rounded-lg h-96">

    <div className='flex flex-col gap-2'>
      <div >
      
     
              <div>
              <div>
        <div className='w-full flex items-center'>
        <p className='font-bold text-sm text-center'>Ngày hôm nay <span className='font-light'>({dataContractToDay?.length ?? 0})</span></p>
         
       
        </div>
       
       <div>
       <Table<any>
           columns={columns}
           dataSource={dataContractToDay}
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
        <p className='font-bold text-sm'>Ngày {dt} <span className='font-light'>({dataContractOther?.[dt]?.length})</span> </p>
       
       <div>
       <Table<IGetContract>
           columns={columns}
           dataSource={dataContractOther?.[dt]}
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