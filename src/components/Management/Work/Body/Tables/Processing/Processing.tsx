import { IGetWork2 } from '@/models/activityInterface'
import { RootState } from '@/redux/store/store';
import { Avatar, Progress, Table, TableColumnsType, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import React from 'react'
import { useSelector } from 'react-redux';


export default function Processing() {
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
              <div>
                <p className='text-xs font-medium'>{value}</p>
                <p className='text-xs'>{record.description}</p>
              </div>
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
            sorter: (a:IGetWork2, b: IGetWork2) =>
              a.created_at.toLocaleDateString('vi-vn').localeCompare(b.created_at.toLocaleDateString('vi-vn')),
          },
          {
            title: "Ngày bắt đầu",
            className: "text-xs",
            dataIndex: "time_start",
            render: (value?: Date) =>
              value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
            sorter: (a: IGetWork2, b: IGetWork2) =>
              a.time_start.toLocaleDateString('vi-vn').localeCompare(b.time_start.toLocaleDateString('vi-vn')),
          },
          {
            title: "Ngày kết thúc",
            className: "text-xs",
            dataIndex: "time_end",
            render: (value?: Date) =>
              value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
            sorter: (a: IGetWork2, b: IGetWork2) =>
              a.time_end.toLocaleDateString('vi-vn').localeCompare(b.time_end.toLocaleDateString('vi-vn')),
          },
          
       
        ];
  return (
    <div className='w-full'>
         <Table<IGetWork2>
                                  columns={columns}
                                  dataSource={[]}
                                  scroll={{ x: "max-content" }}
                                  showHeader={false}
                                  pagination={false}
                                  showSorterTooltip={{ target: "sorter-icon" }}
                                />
    </div>
  )
}