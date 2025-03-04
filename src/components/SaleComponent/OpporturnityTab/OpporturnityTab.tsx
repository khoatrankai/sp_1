import { Table } from "antd";
import { Button, Dropdown, Menu, Select, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useState } from "react";
import { FaArrowsRotate } from "react-icons/fa6";

interface DataType {
  opportunity_id: string;
  name_contact: string;
  company_name: string;
  phone_number: string;
  price: number;
  image_sp: string;
  name_sp: string;
  sp_id: string;
  status_id_op: string;
  point?: number;
}

const OpporturnityTab = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const items = [
    {
      key: "1",
      label: "1st item",
    },
    {
      key: "2",
      label: "2nd item",
    },
    {
      key: "3",
      label: "3rd item",
    },
  ];
  const dataTest: DataType[] = [
    {
      opportunity_id: "OPP001",
      name_contact: "John Doe",
      company_name: "Tech Solutions Inc.",
      phone_number: "123-456-7890",
      price: 15000,
      image_sp: "https://example.com/product1.jpg",
      name_sp: "Smartphone X1",
      sp_id: "SP001",
      status_id_op: "Active",
    },
    {
      opportunity_id: "OPP002",
      name_contact: "Jane Smith",
      company_name: "Innovative Tech Co.",
      phone_number: "987-654-3210",
      price: 22000,
      image_sp: "https://example.com/product2.jpg",
      name_sp: "Laptop Pro 15",
      sp_id: "SP002",
      status_id_op: "Pending",
    },
    {
      opportunity_id: "OPP003",
      name_contact: "Alice Johnson",
      company_name: "Alpha Enterprises",
      phone_number: "456-789-0123",
      price: 18000,
      image_sp: "https://example.com/product3.jpg",
      name_sp: "Tablet Z5",
      sp_id: "SP003",
      status_id_op: "Closed",
    },
    {
      opportunity_id: "OPP004",
      name_contact: "Bob Williams",
      company_name: "NextGen Solutions",
      phone_number: "321-654-0987",
      price: 25000,
      image_sp: "https://example.com/product4.jpg",
      name_sp: "Gaming Console V2",
      sp_id: "SP004",
      status_id_op: "In Progress",
    },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      title: "#",
      dataIndex: "opportunity_id",
      sorter: (a: DataType, b: DataType) =>
        a.opportunity_id.localeCompare(b.opportunity_id),
    },
    {
      title: "Tên",
      dataIndex: "name_contact",
      sorter: (a: DataType, b: DataType) =>
        a.name_contact.localeCompare(b.name_contact),
    },
    {
      title: "Công ty",
      dataIndex: "company_name",
      sorter: (a: DataType, b: DataType) =>
        a.company_name.localeCompare(b.company_name),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone_number",
      sorter: (a: DataType, b: DataType) =>
        a.phone_number.localeCompare(b.phone_number),
    },
    {
      title: "Giá trị dự kiến",
      dataIndex: "price",
      sorter: (a: DataType, b: DataType) => a.price - b.price,
    },
    {
      title: "Người phụ trách",
      dataIndex: "name_sp",
      sorter: (a: DataType, b: DataType) => a.name_sp.localeCompare(b.name_sp),
    },
    {
      title: "Tình trạng",
      dataIndex: "status_id_op",
      sorter: (a: DataType, b: DataType) =>
        a.status_id_op.localeCompare(b.status_id_op),
    },
    {
      title: "Điểm cơ hội",
      dataIndex: "point",
    },
  ];
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const menu = <Menu items={items} />;
  return (
    <div>
      <div className="flex justify-end">
        <a className=" text-blue-400 hover:text-black" href="">
          Xem tất cả
        </a>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Select
            defaultValue="10"
            style={{ width: 83 }}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
              { value: 100, label: 100 },
              { value: 500, label: 500 },
              { value: 1000, label: 1000 },
              { value: 1, label: "Tất cả" },
            ]}
          />
          <Dropdown className="ml-1" overlay={menu} trigger={["click"]}>
            <Button>Xuất ra</Button>
          </Dropdown>
          <Button>
            <FaArrowsRotate />
          </Button>
        </div>
        <div className="flex items-center">
          <Search placeholder="Tìm kiếm" style={{ width: 200 }} />
        </div>
      </div>
      <Table<DataType>
        columns={columns}
        rowSelection={rowSelection}
        dataSource={dataTest}
        scroll={{ x: "max-content" }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </div>
  );
};

export default OpporturnityTab;
