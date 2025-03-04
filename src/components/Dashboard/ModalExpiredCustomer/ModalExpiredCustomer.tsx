import contractService from "@/services/contractService.";
import { Table, TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";

interface DataType {
  contract_id: string;
  name_contract: string;
  total: number;
}

export default function ModalExpiredCustomer() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Tên khách hàng",
      dataIndex: "name_contract",
    },
    {
      title: "Số nợ",
      dataIndex: "total",
      align: "right",
      render: (value: number) => <strong>{value.toLocaleString()}đ</strong>,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await contractService.getPaymentExpiredCustomer();
      if (res.statusCode === 200) {
        setDataSource(res.data);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex-1 h-[322px] sm:min-w-[322px] max-w-full rounded-sm bg-white p-[10px]">
      <div className="flex justify-between mb-3">
        <h3 className="text-base font-semibold">Nợ quá hạn</h3>
        <a className="text-xs text-blue-400" href="">
          Xem tất cả
        </a>
      </div>
      <div className="max-h-full overflow-y-scroll">
        <Table<DataType>
          className="max-h-52"
          bordered
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={dataSource as DataType[]}
          pagination={false}
        />
      </div>
    </div>
  );
}
