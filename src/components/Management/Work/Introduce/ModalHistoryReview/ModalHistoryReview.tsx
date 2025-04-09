import { IGetReview } from '@/models/activityInterface'
import { Avatar, Button,  Table, TableColumnsType, Tag } from 'antd'
import Modal from 'antd/es/modal/Modal'
import React, { Ref, useState } from 'react'
import { FaStar } from 'react-icons/fa'


type Props={
    refBtn?:Ref<HTMLButtonElement>
    dataSource:IGetReview[]
}
export default function ModalHistoryReview({refBtn,dataSource}:Props) {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
    const dataQuality = [{quality:'good',star:4},{quality:'excellent',star:5},{quality:'satisfactory',star:3},{quality:'needs_improvement',star:2},{quality:'fail',star:1}]
    const showModal = () => {
        setIsModalVisible(true);
      };
      const handleCancel = () => {
        setIsModalVisible(false);
        
      };
     const columns: TableColumnsType<IGetReview> = [
        {
          title: "Người đánh giá",
          className: "text-xs",
          dataIndex: "user",
          render: (value: string, red) => (
           <>
            <Avatar
                                        src={red?.user_create?.picture_url}
                                        alt={
                                          red?.user_create?.first_name ??
                                          "" + red?.user_create?.last_name ??
                                          ""
                                        }
                                        style={{ backgroundColor: "#87d068" }}
                                      />
           </>
          ),
        
        },
    
        {
          title: "Thời gian",
          dataIndex: "name",
          className: "text-xs",
          render: (value?: string,record?:IGetReview) => (new Date(record?.created_at ?? "").toLocaleString("vi-VN", { 
            timeZone: "UTC", 
            hour12: false 
        })) || "N/A",
        },
        {
          title: "Đánh giá tiến độ",
          dataIndex: "progress",
          className: "text-xs",
          render: (value?: number) =>
            value ? `${value}%` : "N/A",
        },
        {
          title: "Kết quả đánh giá",
          dataIndex: ["quality"],
          className: "text-xs",
          render: (value) =>{
            const dataStar = dataQuality.find(dt => dt.quality === value)
           return <>
            <div className='flex items-center gap-1'>
            {
                Array.from({length:dataStar?.star ?? 0}).map(()=>{
                  return <>
                    <FaStar className='text-yellow-500'/>
                  </>
                })
              }
               {
                Array.from({length:5-(dataStar?.star ?? 0)}).map(()=>{
                  return <>
                    <FaStar/>
                  </>
                })
              }
              <p className='font-semibold capitalize'>{value}</p>
            </div>
             
           </>
          },
        },
        {
          title: "Ý kiến đánh giá",
          dataIndex: "description",
          className: "text-xs",
          render: (value?: string) => value || "N/A",
          
        },
    
        {
          title: "Trạng thái",
          dataIndex: "status",
          className: "text-xs",
          render: (value?: string) =>
            {
              let color = "";
                let text = "";
        
                switch (value) {
                  case "success":
                    color = "green";
                    text = "Hoàn thành";
                    break;
                  case "fail":
                    color = "red";
                    text = "Thất bại";
                    break;
                  case "waitting":
                    color = "gold";
                    text = "Đang thực hiện";
                    break;
                  default:
                    color = "default";
                    text = "Không xác định";
                }
              return <>
                 <Tag color={color}>
                      {text}
                    </Tag>
              </>
            },
        },
        {
          title: "Kết thúc thực tế",
          dataIndex: "time_end",
          className: "text-xs",
          render: (value?: Date) =>
            value ? (new Date(value)).toLocaleDateString("vi-VN") : "N/A",
        },
      ];
  return (
    <>
    {/* {!type && ( */}
    <Button
      hidden={refBtn ? true : false}
      className="  text-xs text-yellow-500 font-semibold"
      type="text"
      ref={refBtn}
      onClick={showModal}
    />
    {/* )} */}

    <Modal
      title="Lịch sử đánh giá"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={"100%"}
      style={{ maxWidth: "800px" }}
    >
    <Table<IGetReview>
            columns={columns}
            // className="text-xs"
            // rowSelection={rowSelection}
            dataSource={dataSource}
            scroll={{ x: "max-content" }}
            pagination={{
              // pageSize: pageLimit, 
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
    </Modal>
    
  </>
  )
}