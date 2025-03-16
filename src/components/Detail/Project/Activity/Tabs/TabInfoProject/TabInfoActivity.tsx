/* eslint-disable @typescript-eslint/no-explicit-any */

import { RootState } from '@/redux/store/store';
// import { RootState } from '@/redux/store/store';
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';

type Props ={
  data:any
}

export default function TabInfoActivity({data}:Props) {
   const { datas: dataContract } = useSelector(
          (state: RootState) => state.get_contracts
        );
     
  return (
    <div>
     <div className="flex flex-col sm:flex-1 sm:w-auto w-96">
     <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Mã hợp đồng
        </p>
        <p
          className="flex-1 flex justify-start"
        >
          {data && dataContract.find((dt)=>{
            return dt.contract_id === data.contract as unknown as string
          })?.code_contract}
        </p>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Mô tả
        </p>
        <p
          className="flex-1 flex justify-start text-blue-500"
        >
          {data?.description}
        </p>
      </div>
      {/* <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Chi phí HĐ
        </p>
        <p className="flex-1 flex justify-start">
          {(dataContract?.price ?? 0).toLocaleString('vi-VN')}đ
        </p>
      </div> */}
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Tình trạng
        </p>
        <p className="flex-1 flex justify-start">
          {data?.statusinfo?.name}
        </p>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Ngày tạo
        </p>
        <p className="flex-1 flex justify-start">
          {moment(data?.created_at).format('DD/MM/YYYY')}
        </p>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Ngày bắt đầu
        </p>
        <p className="flex-1 flex justify-start">
          {moment(data?.time_start).format('DD/MM/YYYY')}
        </p>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Hạn hoàn thành
        </p>
        <p className="flex-1 flex justify-start">
          {moment(data?.time_end).format('DD/MM/YYYY')}
        </p>
      </div>
    </div>
    </div>
  )
}