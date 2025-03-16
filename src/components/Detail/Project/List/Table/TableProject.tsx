/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Button, Table, TableColumnsType, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import './styles.scss'
import { IoIosAdd } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store/store'
import { IGetProject } from '@/models/projectInterface'
import { MdOutlineStar } from 'react-icons/md'
import { useDispatch } from 'react-redux';
import { fetchProjects } from '@/redux/store/slices/projectSlices/get_all_project.slice';

export default function TableProject() {
  const [dataFilter,setDataFilter] = useState<any>()
  const dispatch = useDispatch<AppDispatch>()
  const { datas: dataType } = useSelector(
    (state: RootState) => state.type_full_projects
  );
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_projects
  );
  const { datas: dataUsers } = useSelector(
    (state: RootState) => state.get_users
  );
  useEffect(()=>{
    if(dataFilter){
      dispatch(fetchProjects(dataFilter))
    }else{
      dispatch(fetchProjects())
    }
  },[dataFilter])
  const [dataProjectToday,setDataProjectToday] = useState<IGetProject[]>([])
  const [dataProjectOther,setDataProjectOther] = useState<any>()
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
        const time = new Date(currValue.created_at).toLocaleDateString("vi-VN")
        if(!preValue[time]){
          preValue[time] = []
        }
        preValue[time].push(currValue)
        return preValue
      },{})
      setDataProjectOther(data)
      setDataProjectToday(dataToday)
    }
  },[dataSource])

   const columns: TableColumnsType<IGetProject> = [
     
    {
      title: "",
      dataIndex: "project_id",
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
        render: (value: string,record:IGetProject) => {
          let color = "";
          let text = "";
  
          switch (record.status) {
            case "waiting":
              color = "gold";
              text = "Đang chờ";
              break;
            case "start":
              color = "blue";
              text = "Bắt đầu";
              break;
            case "pause":
              color = "orange";
              text = "Tạm dừng";
              break;
            case "cancel":
              color = "red";
              text = "Đã hủy";
              break;
            case "completed":
              color = "green";
              text = "Hoàn thành";
              break;
            default:
              color = "default";
              text = "Không xác định";
          }
          return <div className='flex gap-2 items-center'>
        <a className='capitalize'  href={`/detail/project/${record.project_id}?project=${record.project_id}&&customer=${record.customer?.info_id}`}>
        {/* `${(value ?? "").slice(0, 40)}...` || "N/A"` */}
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
        dataIndex: "project_id",
        className: "text-xs",
        render: (value:string,record:IGetProject) => <div className='flex gap-1 w-full items-center font-medium justify-end'>
        <p>
          { new Date(record.start_date ?? record.created_at??"")?.toLocaleDateString('vi-vn')}-{new Date(record.end_date ??record.created_at??"")?.toLocaleDateString('vi-vn')}
        </p>
        <Avatar style={{ backgroundColor: '#87d068' }} src={dataUsers?.find((dt)=> dt.user_id === record.user_support)?.picture_url} icon={<UserOutlined className='text-xs'/>} >{dataUsers?.find((dt)=> dt.user_id === record.user_support)?.last_name}</Avatar>
        <p>{dataUsers?.find((dt)=> dt.user_id === record.user_support)?.first_name} {dataUsers?.find((dt)=> dt.user_id === record.user_support)?.last_name}</p>
        </div> ,
      }
      
   
    ];
  return (
    <div  className="p-4 flex flex-col gap-2 max-w-full w-full rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] h-96">

    <div className='flex flex-col gap-2'>
      <div >
        <div className='w-full border-b-[1px] pb-2'>
              <select
        className='outline-none text-lg font-light'
                defaultValue={'all'}
                onChange={(e) => {
                  if(e.target.value === "all"){
                    setDataFilter({ ...dataFilter, type: null });
                  }else{
                    setDataFilter({ ...dataFilter, type: e.target.value });

                  }
                }}
               
              >
                  <option key={'all'} value={'all'}>
                    Tất cả
                  </option>
                {dataType?.map((dt) => (
                  <option key={dt.type_id} value={dt.type_id}>
                    {dt.name_type}
                  </option>
                ))}
               
              </select>
        </div>
     
              <div className=' overflow-y-auto max-h-80'>
              <div>
        <div className='w-full flex items-center'>
        <p className='font-bold text-sm text-center'>Ngày hôm nay <span className='font-light'>({dataProjectToday.length})</span></p>
          <div>
            <Button className='text-xs font-medium !text-green-500 ' type='link' icon={<IoIosAdd className='font-semibold text-xl'/>}></Button>
          </div>
       
        </div>
       
       <div>
       <Table<IGetProject>
           columns={columns}
           dataSource={dataProjectToday}
           scroll={{ x: "max-content" }}
           showHeader={false}
           pagination={false}
           showSorterTooltip={{ target: "sorter-icon" }}
         />
       </div>

       
              </div>
              {
                dataProjectOther && Object.keys(dataProjectOther).map((dt)=>{
                  return <>
                     <div className='my-4'>
                        <p className='font-bold text-sm'>Ngày {dt} <span className='font-light'>({dataProjectOther[dt].length})</span> </p>
                      
                      <div>
                      <Table<IGetProject>
                          columns={columns}
                          dataSource={dataProjectOther[dt]}
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