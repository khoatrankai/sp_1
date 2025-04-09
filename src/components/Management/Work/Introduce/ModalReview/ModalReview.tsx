/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from '@/hooks/usePostData'
import { ICreateReview } from '@/models/activityInterface'
import activityService from '@/services/activityService'
import { Button, DatePicker, Input, Progress, Radio, Select } from 'antd'
import { Option } from 'antd/es/mentions'
import Modal from 'antd/es/modal/Modal'
import { useSearchParams } from 'next/navigation'
import React, { Ref, useState } from 'react'


type Props={
    refBtn?:Ref<HTMLButtonElement>
    handleOnclick?:any
}
export default function ModalReview({refBtn,handleOnclick}:Props) {
    const {postdata} = usePostData()
    const searchParams = useSearchParams()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const dataQuality = [{quality:'good',name:'Tốt'},{quality:'excellent',name:'Xuất sắc'},{quality:'satisfactory',name:'Đạt yêu cầu'},{quality:'fail',name:'Thất bại'},{quality:'needs_improvement',name:'Chưa đạt yêu cầu'}]
    const dataStatus = [{status:'fail',name:'Thất bại'},{status:'waitting',name:'Đang thực hiện'},{status:'success',name:'Hoàn thành'}]
    const [dataCreate,setDataCreate] = useState<ICreateReview>({progress:5,status:'waitting'})
    const showModal = () => {
        setIsModalVisible(true);
      };
      const handleCancel = () => {
        setIsModalVisible(false);
        
      };
      const handleSubmit = async()=>{
        const statusCode = await  postdata(()=> activityService.createReview({...dataCreate,work:searchParams.get('id') as string}))
        if(statusCode === 201){
          setIsModalVisible(false)
          handleOnclick()
        }
      }
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
      title="Mẫu đánh giá"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={"100%"}
      style={{ maxWidth: "800px" }}
    >
      <div className='flex'>
            <div className='flex flex-col w-fit'>
                <p className='font-semibold p-2 border-[1px] min-h-14 flex items-center'>Tiêu chí đánh giá</p>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>Tiến độ công việc</p>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>Chất lượng công việc</p>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>Thời gian hoàn thành</p>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>Trạng thái</p>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>Ý kiến</p>
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex'>
                <div className='flex flex-col flex-1'>
                <p className='font-semibold p-2 border-[1px] min-h-14 flex items-center'>Người thực hiện báo cáo</p>
                <div className='p-2 border-[1px] min-h-14 flex items-center'>
                <Progress
              percent={dataCreate.progress}
            />
                </div>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>{dataQuality.find((dt)=> dataCreate.quality === dt.quality)?.name}</p>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>{dataCreate.time_end?.toLocaleDateString('vi-VN')}</p>
                <p className='p-2 border-[1px] min-h-14 flex items-center'>{dataStatus.find((dt)=> dataCreate.status === dt.status)?.name}</p>
            </div>
            <div className='flex flex-col flex-1'>
                <p className='font-semibold p-2 border-[1px] min-h-14 flex items-center'>Người quản lý đánh giá</p>
                <div className='p-2 border-[1px]  min-h-14 flex items-center'>
                <Radio.Group defaultValue="5" size='small' onChange={(e)=>{
                  if(e.target.value === "100"){
                    setDataCreate((preValue)=>{
                      return {...preValue,status:'success'}
                    })
                  }
                  if(e.target.value !== "100"){
                    setDataCreate((preValue)=>{
                      return {...preValue,status:'waitting'}
                    })
                  }
                  setDataCreate((preValue)=>{
                    return {...preValue,progress:Number(e.target.value)}
                  })
                }}>
      <Radio.Button value="5">5</Radio.Button>
      <Radio.Button value="10">10</Radio.Button>
      <Radio.Button value="20">20</Radio.Button>
      <Radio.Button value="30">30</Radio.Button>
      <Radio.Button value="50">50</Radio.Button>
      <Radio.Button value="70">70</Radio.Button>
      <Radio.Button value="80">80</Radio.Button>
      <Radio.Button value="90">90</Radio.Button>
      <Radio.Button value="100">100</Radio.Button>
    </Radio.Group>
                </div>
                <div className='p-2 border-[1px] min-h-14 flex items-center'>
                    <Select placeholder={'Chọn'} className='w-full' onChange={(e)=>{
                       setDataCreate((preValue)=>{
                        return {...preValue,quality:e}
                      })
                    }}>
                      {
                        dataQuality.map((dt)=>{
                          return <>
                            <Option key={dt.quality} value={dt.quality}>{dt.name}</Option>
                          </>
                        })
                      }
                    </Select>
                </div>
                <div className='p-2 border-[1px] min-h-14 flex items-center'><DatePicker  className='w-full' onChange={(e)=>{
                  setDataCreate((preValue)=>{
                    return {...preValue,time_end:e ? new Date(e.toString()):undefined}
                  })
                }}/></div>
                <div className='p-2 border-[1px] min-h-14 flex items-center'>
                  <Select placeholder={'Chọn'} className='w-full'
                  value={dataCreate.status}
                 onChange={(e)=>{
                  setDataCreate((preValue)=>{
                   return {...preValue,status:e}
                 })
               }}
                >
                {
                        dataStatus.map((dt)=>{
                          return <>
                            <Option key={dt.status} value={dt.status}>{dt.name}</Option>
                          </>
                        })
                      }</Select></div>
            </div>
                </div>
                <div className='p-2 border-[1px] h-full flex items-center'>
                    <Input placeholder='Ý kiến đánh giá'  onChange={(e)=>{
                       setDataCreate((preValue)=>{
                        return {...preValue,description:e.target.value}
                       })
                    }}/>
                </div>

            </div>
          
      </div>
      <div className='flex w-full justify-start mt-4 gap-2'>
            <Button type='primary' onClick={()=>{
              handleSubmit()
            }}>Đánh giá</Button>
            <Button>Hủy bỏ</Button>
      </div>
    </Modal>
    
  </>
  )
}