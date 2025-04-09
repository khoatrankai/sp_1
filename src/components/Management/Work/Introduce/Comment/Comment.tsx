import { IGetComment } from '@/models/activityInterface'
import activityService from '@/services/activityService'
import { Avatar, Button, List, Tooltip } from 'antd'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Comment } from '@ant-design/compatible';
import { Form } from 'antd/lib'
import { Input } from 'antd';
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import usePostData from '@/hooks/usePostData'
const { TextArea } = Input;
// type PaginationPosition = 'top' | 'bottom' | 'both';

// type PaginationAlign = 'start' | 'center' | 'end';

export default function ModalComment() {
    
    const { datas: dataProfile } = useSelector(
        (state: RootState) => state.get_profile
      );
      const {postdata} = usePostData()
      const [dataComment,setDataComment] = useState<string>('')
      const [isLoading,setIsLoading] = useState<boolean>(false)
    const [dataSource,setDataSource] = useState<IGetComment[]>([])
    const searchParams = useSearchParams()
    const fetchData = async()=>{
        const res = await activityService.getComments(searchParams.get('id') ?? "")
        if(res.statusCode === 200){
            setDataSource(res.data)
        }
    }
    useEffect(()=>{
        fetchData()
    },[searchParams])
    const handleSubmit = async()=>{
        setIsLoading(true)
        const statusCode = await postdata(()=> activityService.createComment({description:dataComment,work:searchParams.get('id')?? ""})) 
        if(statusCode){
            setIsLoading(false)
            if(statusCode === 201){
                fetchData()
            }
        }
        
    }
    
    const position = 'bottom'
  const align = 'center'
  return (
    <div className='flex flex-col px-4'>
        <Comment
        avatar={<Avatar src={dataProfile?.picture_url} alt={`${dataProfile?.first_name} ${dataProfile?.last_name}`} />}
        content={
            <>
            <Form.Item>
            {/* <TextArea onChange={(e)=>{setDataComment(e.target.value)}} rows={4} defaultValue={dataComment}/>
             */}
             <TextArea onChange={(e)=>{setDataComment(e.target.value)}} value={dataComment} rows={4}/>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={isLoading} onClick={handleSubmit} type="primary">   
              Gửi
            </Button>
          </Form.Item>
            </>
            
        }
      />
        <List
        pagination={{ position, align }}
        header={`${dataSource.length} bình luận`}
        dataSource={dataSource}
        renderItem={(item) => (
          <li>
        <Comment
      author={<a>{item.user_create?.first_name} {item.user_create?.last_name}</a>}
      avatar={<Avatar src={item.user_create?.picture_url} alt={`${item.user_create?.first_name} ${item.user_create?.last_name}`} />}
      content={
        <p>
         {
            item.description
         }
        </p>
      }
      datetime={
        <Tooltip title={new Date(item?.created_at ?? "")?.toLocaleString("vi-VN", { 
            timeZone: "UTC", 
            hour12: false 
        })}>
          <span>{new Date(item?.created_at ?? "")?.toLocaleString("vi-VN", { 
            timeZone: "UTC", 
            hour12: false 
        })}</span>
        </Tooltip>
      }
    />
      </li>
        )}
      />
    </div>
  )
}