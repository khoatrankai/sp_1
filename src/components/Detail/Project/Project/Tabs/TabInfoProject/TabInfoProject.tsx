import { IGetProject } from '@/models/projectInterface';
// import { RootState } from '@/redux/store/store';
import projectService from '@/services/projectService';
import moment from 'moment'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';


export default function TabInfoProject() {
    const { id } = useParams();
    const [dataProject, setDataProject] = useState<IGetProject>();
    const fetchData = async () => {
        const res = await projectService.getFullProject(id as string);
        if (
          res.statusCode === 200 
        ) {
          setDataProject(res.data);
        }
      };
    
      useEffect(() => {
        if (id) {
          fetchData();
        }
      }, [id]);
  return (
    <div>
        <div className="flex flex-col sm:flex-1 sm:w-auto w-96">
                      <div className="border-t-[1px] flex w-full py-2">
                        <p className="flex-1 flex justify-start font-medium">
                          Khách hàng
                        </p>
                        <a
                          className="flex-1 flex justify-start text-blue-500"
                          href={`/admin/customer/info/${dataProject?.customer}`}
                        >
                          {
                            dataProject?.customer?.name_company
                          }
                        </a>
                      </div>
                      <div className="border-t-[1px] flex w-full py-2">
                        <p className="flex-1 flex justify-start font-medium">
                          Tổng chi phí
                        </p>
                        <p className="flex-1 flex justify-start">
                          {dataProject?.price?.toLocaleString("vi-vn")}đ
                        </p>
                      </div>
                      <div className="border-t-[1px] flex w-full py-2">
                        <p className="flex-1 flex justify-start font-medium">
                          Tình trạng
                        </p>
                        <p className="flex-1 flex justify-start">
                          {dataProject?.status === "cancel"
                            ? "Đã hủy"
                            : dataProject?.status === "completed"
                            ? "Hoàn thành"
                            : dataProject?.status === "pause"
                            ? "Tạm ngưng"
                            : dataProject?.status === "start"
                            ? "Đang thực hiện"
                            : "Đang chờ"}
                        </p>
                      </div>
                      <div className="border-t-[1px] flex w-full py-2">
                        <p className="flex-1 flex justify-start font-medium">
                          Ngày tạo
                        </p>
                        <p className="flex-1 flex justify-start">
                          {moment(dataProject?.created_at).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div className="border-t-[1px] flex w-full py-2">
                        <p className="flex-1 flex justify-start font-medium">
                          Ngày bắt đầu
                        </p>
                        <p className="flex-1 flex justify-start">
                          {" "}
                          {moment(dataProject?.start_date).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div className="border-t-[1px] flex w-full py-2">
                        <p className="flex-1 flex justify-start font-medium">
                          Hạn hoàn thành
                        </p>
                        <p className="flex-1 flex justify-start">
                          {" "}
                          {moment(dataProject?.end_date).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
    </div>
  )
}