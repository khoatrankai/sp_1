/* eslint-disable @typescript-eslint/no-explicit-any */
import usePostData from '@/hooks/usePostData';
import { IGetWork2 } from '@/models/activityInterface';
import { RootState } from '@/redux/store/store';
import activityService from '@/services/activityService';
import { Avatar, Button, Modal, Select, SelectProps, Tooltip } from 'antd'
import { useSearchParams } from 'next/navigation';
import React, { Ref, useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { IoIosAddCircle, IoIosAddCircleOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';

type Props = {
    refBtn?:Ref<HTMLButtonElement>
}
export default function ListUser({refBtn}:Props) {
  const [dataWork,setDataWork] = useState<IGetWork2>()
  const [optionsListUser, setOptionsListUser] = useState<
      SelectProps["options"]
    >([]);
    const {postdata} = usePostData()
  const [checkAdd,setCheckAdd] = useState<boolean>(false)
  const [listUsers, setListUsers] = useState<string[]>([]);
  const searchParams = useSearchParams(); 
  const { datas: dataUsers } = useSelector(
      (state: RootState) => state.get_users
    );
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const showModal = () => {
        setIsModalVisible(true);
        fetchData();
      };
      const fetchData = async () => {
        const res = await activityService.getWorkById(searchParams.get('id')??"");
        if(res.statusCode === 200){
          setDataWork(res.data)
          setListUsers(res.list_user?.map((dt:any) => dt.user_id) ?? []);
        }
      };
      const handleCancel = () => {
        setIsModalVisible(false);
       
      };
        useEffect(() => {
          if (dataUsers) {
            setOptionsListUser(
              dataUsers.map((dt) => {
                return {
                  label: dt.first_name + " " + dt.last_name,
                  value: dt.user_id,
                  group:dt.group_user?.name_group
                };
              })
            );
          }
        }, [dataUsers]);
  const handleSubmit = async () => {
      const res = await postdata(() =>
        activityService.updateWork(searchParams.get('id')??"", { list_users: listUsers })
      );
      if (res === 200 || res === 201) {
        fetchData()
        setCheckAdd(false)
       
      }
    };
  return (
    <>
    <Button
      ref={refBtn}
      hidden={refBtn?true:false}
      onClick={showModal}
    ></Button>
      <Modal
    title="Danh sách thực hiện"
    open={isModalVisible}
    onCancel={handleCancel}
    footer={null}
    width={"100%"}
    style={{ maxWidth: "600px" }}
    >
    <div className='flex flex-col'>
      {
        dataWork?.list_user?.map((dt)=>{
          return <>
            <div className='flex gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-sm items-center'>
              <Avatar src={dt.picture_url}/>
              <div className='flex text-xs flex-col h-full justify-between'>
                <p className='font-medium'>{dt.first_name} {dt.last_name}</p>
                <p className='text-gray-400'>{dataUsers?.find(dt => dt.user_id === dt.user_id)?.group_user?.name_group}</p>
              </div>
            </div>
          </>
        })
      }
      {
        checkAdd ? <div className="flex items-center gap-1">
        <Avatar.Group
          max={{
            count: 5,
            style: {
              color: "#f56a00",
              backgroundColor: "#fde3cf",
            },
          }}
        >
          {listUsers?.map((dt,index) => {
            const dataFil = dataUsers?.find((dtt) => dtt.user_id === dt);
            return (
              <Tooltip
                key={index}
                title={
                  dataFil?.first_name ?? "" + dataFil?.last_name ?? ""
                }
                placement="top"
              >
                <Avatar
                  src={dataFil?.picture_url}
                  alt={
                    dataFil?.first_name ?? "" + dataFil?.last_name ?? ""
                  }
                  style={{ backgroundColor: "#87d068" }}
                />
              </Tooltip>
            );
          })}
        </Avatar.Group>
        {!checkAdd ? (
          <IoIosAddCircle
            className="w-8 h-8 text-[#ED8C1F] cursor-pointer"
            onClick={() => {
              setCheckAdd(!checkAdd);
            }}
          />
        ) : (
          <>
            <Select
              mode="multiple"
              
              allowClear
              maxTagCount={"responsive"}
              style={{ width: "220px" }}
              value={listUsers}
              placeholder="Please select"
              onChange={(e) => {
                setListUsers(e);
              }}
              options={optionsListUser?.map((user) => ({
                label: (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div>
                      <strong>{user.label}</strong>
                      <div style={{ fontSize: "12px", color: "gray" }}>{user.group}</div>
                    </div>
                  </div>
                ),
                value: user.value,
              }))}
            />
            <FaCheckCircle
              className="w-6 h-6 text-green-500 cursor-pointer"
              onClick={(e) => {
                handleSubmit()
                e.stopPropagation()
                e.preventDefault()
              }}
            />
          </>
        )}
      </div>:
      <Button icon={<IoIosAddCircleOutline className='text-2xl'/>} className='flex gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-sm items-center' onClick={()=>
        {
        setCheckAdd(true)
       
      }
        }>
              
              <p>Thay đổi</p>
            </Button>
      }
      
    </div>
    </Modal>
    </>
  
  )
}