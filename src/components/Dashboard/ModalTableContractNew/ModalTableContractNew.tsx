import { IGetContract } from "@/models/contractInterface";
import contractService from "@/services/contractService.";
import { Table, TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";

export default function ModalTableContractNew() {
  const [dataSource, setDataSource] = useState<IGetContract[]>([]);
  const columns: TableColumnsType<IGetContract> = [
    {
      title: "Hợp đồng",
      dataIndex: "name_contract",
    },
    {
      title: "Giá trị",
      dataIndex: "price",
      align: "right",
      render: (value: number) => <strong>{value.toLocaleString()}đ</strong>,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await contractService.getYearCurrentContracts();
      if (res.statusCode === 200) {
        setDataSource(res.data);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex-1 h-[322px] min-w-[322px] rounded-sm bg-white p-[10px]">
      <div className="flex justify-between mb-3">
        <h3 className="text-base font-semibold">Hợp đồng mới</h3>
        <a className="text-xs text-blue-400" href="">
          Xem tất cả
        </a>
      </div>
      <div className="max-h-full overflow-y-scroll">
        <Table<IGetContract>
          className="max-h-52"
          bordered
          columns={columns}
          scroll={{ x: "max-content" }}
          dataSource={dataSource as IGetContract[]}
          pagination={false}
        />
      </div>
    </div>
  );
}
