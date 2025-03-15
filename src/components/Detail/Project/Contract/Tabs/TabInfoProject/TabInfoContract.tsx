
import { IGetContract } from '@/models/contractInterface';
import { RootState } from '@/redux/store/store';
// import { RootState } from '@/redux/store/store';
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';

type Props={
  data:IGetContract
}
export default function TabInfoContract({data}:Props) {
  const { datas: dataCustomer } = useSelector(
    (state: RootState) => state.infos_customer
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
          {data?.code_contract}
        </p>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Khách hàng
        </p>
        <a
          className="flex-1 flex justify-start text-blue-500"
        >
          {data && dataCustomer.find(dt=> dt.info_id === (data?.customer as unknown as string))?.name_company}
        </a>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Chi phí HĐ
        </p>
        <p className="flex-1 flex justify-start">
          {(data?.price ?? 0).toLocaleString('vi-VN')}đ
        </p>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Tình trạng
        </p>
        <p className="flex-1 flex justify-start">
          {data?.status === 'delete'
            ? 'Đã xóa'
            : data?.status === 'active'
            ? 'Hoạt động'
            : data?.status === 'hide'
            ? 'Ẩn'
            : 'Hoàn thành'}
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
          {moment(data?.date_start).format('DD/MM/YYYY')}
        </p>
      </div>
      <div className="border-t-[1px] flex w-full py-2">
        <p className="flex-1 flex justify-start font-medium">
          Hạn hoàn thành
        </p>
        <p className="flex-1 flex justify-start">
          {moment(data?.date_expired).format('DD/MM/YYYY')}
        </p>
      </div>
    </div>
    </div>
  )
}