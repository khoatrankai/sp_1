/* eslint-disable @typescript-eslint/no-explicit-any */

import {  Tag } from 'antd'
import React from 'react'
import { BiListCheck } from 'react-icons/bi';
import { GiProgression } from 'react-icons/gi';
import { PiTarget } from 'react-icons/pi';
import { FaUserGroup } from 'react-icons/fa6';
import { MdDateRange } from 'react-icons/md';
import { IoDocumentAttachSharp } from 'react-icons/io5';
import PieChart from './PieChart/PieChart';
import StepActivity from './Steps/StepActivity';
import { IGetProject } from '@/models/projectInterface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

type Props={
  dataSource:IGetProject
}

export default function Detail({dataSource}:Props) {
  // const searchParams = useSearchParams();
  // const [dataSource,setDataSource] = useState<IGetProject>()
  const { datas: dataUsers } = useSelector(
      (state: RootState) => state.get_users
    );
  // const fetchData = async(id:string)=>{
  //   const res = await projectService.getProject(id)
  //   if(res.statusCode === 200){
  //     setDataSource(res.data)
  //   }
  // }
  // useEffect(()=>{
  //   const id = searchParams.get('id')
  //   if(id){
  //     fetchData(id)
  //   }
  // },[searchParams])

  const handleDay = (date1:any,date2:any)=>{
    const timestamp1 = date1 ? (new Date(date1).getTime()): Date.now();
const timestamp2 = date2 ?  new Date(date2).getTime() : Date.now();

const diffInMs = Math.abs(timestamp2 - timestamp1);
const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
console.log(diffInDays)
return diffInDays
  }
  return (
    <>
      <div className='flex gap-4 w-full flex-wrap'>
        <div className='bg-slate-100 rounded-md min-w-96 flex-1'>
          <p className='p-4'>Thông tin chung</p>
          <div className='flex flex-wrap gap-2 w-full p-4 border-t-[1px]'>
              <div className='font-medium flex-1 basis-2/5'>
                <p className='text-gray-300 text-xs'>Mã dự án</p>
                <p className='text-xs'>{dataSource?.project_id}</p>
              </div>
              <div className='font-medium flex-1 basis-2/5'>
                <p className='text-gray-300 text-xs'>Tên dự án</p>
                <p className='text-xs text-wrap break-words'>{dataSource?.name}</p>
              </div>
              <div className='font-medium flex-1 basis-2/5'>
                <p className='text-gray-300 text-xs'>Người quản trị</p>
                <div className='flex gap-2 text-xs'>
                  <a href="#" className='text-blue-500'>{ 
                  (() => {
                    const data = dataUsers?.find(dt => dt.user_id === dataSource?.user_support);
                    return `${data?.first_name ?? ""} ${data?.last_name ?? ""}`;
                  })()
                  }</a>
                </div>
              </div>
              <div className='font-medium flex-1 basis-2/5'>
                <p className='text-gray-300 text-xs'>Trạng thái</p>
                <div className='flex gap-2 w-full justify-between items-center text-xs'>
                  <p>{((dataSource?.progress.completed ?? 0) / (dataSource?.progress.total ?? 1))*100}%</p>
                  <Tag
                  color={dataSource?.status === "cancel" ? 'red':dataSource?.status === "completed" ? 'green':dataSource?.status === "pause" ? 'yellow':dataSource?.status === "start" ? 'blue':'gold'}
                  >{dataSource?.status === "cancel" ? 'Đã hủy':dataSource?.status === "completed" ? 'Hoàn thành':dataSource?.status === "pause" ? 'Tạm dừng':dataSource?.status === "start" ? 'Bắt đầu':'Chờ'}</Tag>
                </div>
              </div>
              <div className='font-medium flex-1 basis-2/5'>
                <p className='text-gray-300 text-xs'>Người tham gia</p>
                <div className='flex gap-1 text-xs flex-wrap'>
                  {
                    dataSource?.user_participants?.map((dt,index)=>{
                      if(index === 0){
                        return <>
                          <a href="#" className='text-blue-500'>{dt.first_name} {dt.last_name}</a>

                        </>
                      }
                      return <>
                      <span>,</span>
                      <a href="#" className='text-blue-500'>{dt.first_name} {dt.last_name}</a>
                      </>
                    })
                  }
                
                </div>
              </div>
              <div className='font-medium flex-1 basis-2/5'>
                <p className='text-gray-300 text-xs'>Bắt đầu</p>
                <p className='text-xs text-wrap break-words'>{(new Date(dataSource?.start_date ?? "")).toLocaleDateString('vi-vn')}</p>
              </div>
          </div>
        </div>
        <div className='min-w-96 flex-1'>
          <div className='flex flex-col gap-4 max-w-fit'>
            <div className='flex flex-wrap gap-4 min-w-fit'>
              <div className='flex gap-2 items-center justify-start p-4 rounded-lg bg-blue-500 min-w-40 flex-1'>
                <div className='p-2 rounded-full bg-black/10'>
              <BiListCheck  className='text-xl'/>
                  
                </div>
              <div className='gap-2 flex flex-col text-white '>
                <p className='text-sm'>{dataSource?.progress.total ?? 0}</p>
                <p className='text-xs'>Tổng công việc</p>
              </div>
              </div>
              <div className='flex gap-2 items-center justify-start p-4 rounded-lg bg-green-700 min-w-40 flex-1'>
                <div className='p-2 rounded-full bg-black/10'>
              <GiProgression  className='text-xl'/>
                  
                </div>
              <div className='gap-2 flex flex-col text-white '>
                <p className='text-sm'>{(handleDay(dataSource?.start_date,Date.now()) * 100 / (handleDay(dataSource?.start_date,dataSource?.end_date) ?? 1)) > 100 ?100:(handleDay(dataSource?.start_date,Date.now()) * 100 / (handleDay(dataSource?.start_date,dataSource?.end_date) ?? 1))}%</p>
                <p className='text-xs'>Tiến độ dự kiến</p>
              </div>
              </div>
              <div className='flex gap-2 items-center justify-start p-4 rounded-lg bg-green-700 min-w-40 flex-1'>
                <div className='p-2 rounded-full bg-black/10'>
                <PiTarget className='text-xl'/>
                    
                  </div>
                <div className='gap-2 flex flex-col text-white '>
                  <p className='text-sm'>{100 *(dataSource?.progress.completed ?? 0)/(dataSource?.progress.total ?? 1)}%</p>
                  <p className='text-xs'>Tiến độ thực tế</p>
                </div>
              </div>
              <div className='flex gap-2 items-center justify-start p-4 rounded-lg bg-green-700 min-w-40 flex-1'>
                <div className='p-2 rounded-full bg-black/10'>
                <FaUserGroup className='text-xl'/>
                    
                  </div>
                <div className='gap-2 flex flex-col text-white '>
                  <p className='text-sm'>{dataSource?.user_participants?.length ?? 0}</p>
                  <p className='text-xs'>Người thực hiện</p>
                </div>
              </div>
              <div className='flex gap-2 items-center justify-start p-4 rounded-lg bg-green-700 min-w-40 flex-1'>
                <div className='p-2 rounded-full bg-black/10'>
                <MdDateRange className='text-xl'/>
                    
                  </div>
                <div className='gap-2 flex flex-col text-white '>
                  <p className='text-sm'>{(handleDay(Date.now(),dataSource?.end_date))}</p>
                  <p className='text-xs'>Ngày thực hiện</p>
                </div>
              </div>
              <div className='flex gap-2 items-center justify-start p-4 rounded-lg bg-green-700 min-w-40 flex-1'>
                <div className='p-2 rounded-full bg-black/10'>
                <IoDocumentAttachSharp className='text-xl'/>
                    
                  </div>
                <div className='gap-2 flex flex-col text-white '>
                  <p className='text-sm'>{dataSource?.attach.length ?? 0}</p>
                  <p className='text-xs'>Tài liệu</p>
                </div>
              </div>
            </div>
            <div className='flex gap-4 flex-wrap'>
            <div className='bg-slate-100 rounded-md flex-1 min-w-56'>
              <p className='p-4'>Thống kê tiến độ</p>
              <div className='max-w-full p-4 border-t-[1px]'>
                <div className='min-w-56 h-56'>
                <PieChart dataSource={[{type:'Hoàn thành',value:dataSource?.progress.completed ?? 0},{type:'Tạm ngưng',value:dataSource?.progress.pause ?? 0},{type:'Đã hủy',value:dataSource?.progress.cancel ?? 0},{type:'Đang tiến hành',value:dataSource?.progress.process ?? 0},{type:'Chờ',value:dataSource?.progress.waiting ?? 0}]} title={`${((dataSource?.progress.completed ?? 0) * 100/(dataSource?.progress.total ?? 1)).toString()}%`}/>

                </div>
              </div>
          </div>
          <div className='bg-slate-100 rounded-md flex-1 min-w-56'>
              <p className='p-4'>Lịch sử hoạt động</p>
              <div className='w-full p-4 border-t-[1px] flex flex-col h-72 overflow-y-auto'>
                  <StepActivity/>
              </div>
          </div>
            </div>
          </div>
        </div>
       
      </div>
    </>
   
  )
}