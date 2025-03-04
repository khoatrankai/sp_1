// import { RootState } from "@/redux/store/store";
import { Button, Modal, Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import usePostData from "@/hooks/usePostData";
// import { useDispatch } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import { IGetPayment } from "@/models/contractInterface";
import contractService from "@/services/contractService.";
import useCheckRole from "@/utils/CheckRole";
// import { Option } from "antd/es/mentions";
// import { useSelector } from "react-redux";
// import { fetchWorks } from "@/redux/store/slices/activitySlices/work.slide";

export default function ModalTabPaymentReadySupplier() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole(["admin-top", "contract"]);
  // const [typeID, setTypeID] = useState<string>("");
  const [dataSources, setDataSources] = useState<IGetPayment[]>([]);
  const [dataFilter, setDataFilter] = useState<IGetPayment[] | [] | undefined>(
    []
  );
  // const { datas: dataTypeWork } = useSelector(
  //   (state: RootState) => state.get_type_work
  // );
  const columns: TableColumnsType<IGetPayment> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "",
      fixed: "left",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>#{index + 1}</strong>
          <div className="flex gap-2">
            {/* <Button type="text" ghost className="text-xs text-blue-600">
              Xem
            </Button> */}
          </div>
        </div>
      ),
    },

    {
      title: "Tên nhà cung cấp",
      dataIndex: ["supplier", "name"],
      className: "text-xs",
      fixed: "left",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.supplier?.name || "").localeCompare(b.supplier?.name || ""),
    },
    {
      title: "Số nợ NCC",
      dataIndex: ["price"],
      className: "text-xs",
      render: (value?: number) =>
        value ? `${value.toLocaleString("vi-VN")}đ` : "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        (a.price || 0) - (b.price || 0),
    },

    {
      title: "Hạn chót",
      dataIndex: "date_expired",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetPayment, b: IGetPayment) =>
        new Date(a.date_expired || 0).getTime() -
        new Date(b.date_expired || 0).getTime(),
    },
  ];
  useEffect(() => {
    setDataFilter(
      dataSources.map((dt, index) => {
        return { ...dt, key: index };
      })
    );
  }, [dataSources]);
  const fetchData = async () => {
    const res = await contractService.getPaymentReadySupplier();
    if (res.statusCode === 200) {
      setDataSources(res.data);
    }
  };
  useEffect(() => {
    if (isAuthorized) fetchData();
  }, [isAuthorized]);

  // useEffect(() => {
  //   if (dataTypeWork.length > 0) {
  //     setTypeID(dataTypeWork[0].type_work_id);
  //   }
  // }, [dataTypeWork]);

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          " " + dt.supplier?.name + " " + dt?.price + " " + dt.date_expired
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const { postdata } = usePostData();
  // const dispatch = useDispatch<AppDispatch>();
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetPayment> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IGetPayment[]) => {
      setListSelect(selectedRows.map((dt) => dt.payment_id ?? ""));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      contractService.deletePayment(listSelect)
    );
    if (statusCode === 200) {
      // dispatch(fetchWorks());
      fetchData();
      setListSelect([]);
      setIsModalConfirmDelete(false);
    }
  };
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1">
          <Select
            defaultValue={pageLimit}
            style={{ width: 83 }}
            onChange={(e) => setPageLimit(e)}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
              { value: 100, label: 100 },
              { value: 500, label: 500 },
              { value: 1000, label: 1000 },
              { value: 100000000, label: "Tất cả" },
            ]}
          />
          {/* <Select
            placeholder="Chọn hoạt động"
            showSearch
            defaultValue={dataTypeWork?.[0]?.type_work_id}
            onChange={(e) => {
              setTypeID(e);
            }}
            filterOption={(input, option) => {
              const text = Array.isArray(option?.children)
                ? option.children.join("")
                : option?.children ?? "";
              return text.toLowerCase().includes(input.toLowerCase());
            }}
          >
            {dataTypeWork?.map((dt) => (
              <Option key={dt.type_work_id} value={dt.type_work_id}>
                {dt.name}
              </Option>
            ))}
          </Select> */}
          <Button hidden={!(listSelect.length > 0)}>Xuất ra</Button>
          <Button
            onClick={() => {
              setIsModalConfirmDelete(true);
            }}
            danger
            hidden={!(listSelect.length > 0)}
            className="text-xl"
            icon={<MdDeleteForever />}
          />
          <Modal
            open={isModalConfirmDelete}
            title={"Xóa dữ liệu"}
            onOk={handleDelete}
            onCancel={() => {
              setIsModalConfirmDelete(false);
            }}
          >
            Bạn có chắc chắn muốn xóa không ?
          </Modal>
        </div>
        <div className="flex items-center">
          <Search
            onChange={(e) => {
              handleSearchFilter(e.target.value);
            }}
            placeholder="Tìm kiếm"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<IGetPayment>
            columns={columns}
            // className="text-xs"
            scroll={{ x: "max-content" }}
            rowSelection={rowSelection}
            dataSource={dataFilter}
            pagination={{
              pageSize: pageLimit, // Items per page
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </div>
      </div>
    </div>
  );
}
