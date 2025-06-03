// import usePostData from "@/hooks/usePostData";
import {
  Button,
  Modal,
  Select,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, {  useEffect, useState } from "react";
import { AppDispatch } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
// import useCheckRole from "@/utils/CheckRole";
import { useSearchParams } from "next/navigation";
import { GetAsset } from "@/models/productInterface.js";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { fetchAssets } from "@/redux/store/slices/productSlices/get_asset.slice";
import ModalUpdateAsset from "../ToolAsset/ModalAsset/ModalUpdateAsset";
import HistoryAsset from "../HistoryAsset/HistoryAsset";

export default function ListAsset() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const [idModal,setIdModal] = useState<string>()
  const handleCancel = ()=>{
    setIdModal(undefined)
  }
  // const isAuthorized = useCheckRole(["admin-top", "product"]);
  // const [filterData, setFilterData] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  // const { postdata } = usePostData();
   const [dataFilter, setDataFilter] = useState<
    GetAsset[] | [] | undefined
  >([]);
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.asset_product
  );
  const columns: TableColumnsType<GetAsset> = [
  {
    title: "#",
    dataIndex: "asset_code",
    render: (value: string,record) => (
      <div className="flex flex-col gap-1">
        <strong>{value.slice(0, 10)}...</strong>
        <div className="flex gap-2">
                    {/* {isAuthorized && ( */}
                      <>
                        <ModalUpdateAsset asset_id={record.id} />
                      </>
                    {/* )} */}
                    <Button
          type="link"
          onClick={() => {
            setIdModal(record.id)
          }}
        >
          Lịch sử
        </Button>
                  </div>
        
      </div>
    ),
  },
  {
    title: "Tên tài sản",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Serial",
    dataIndex: "serial_number",
  },
  {
    title: "Khách hàng",
    dataIndex: ["customer", "name_company"],
    sorter: (a, b) =>
      a.customer.name_company.localeCompare(b.customer.name_company),
  },
   {
    title: "Dự án",
    dataIndex: ["project", "name"],
    sorter: (a, b) =>
      (a.project?.name ?? "").localeCompare(b.project?.name ?? ""),
  },
  {
    title: "Loại sản phẩm",
    dataIndex: ["code_product", "product",'name'],
  },
  {
    title: "Ngày mua",
    dataIndex: "purchase_date",
    render: (value: string) => new Date(value).toLocaleDateString("vi-VN"),
  },
  {
    title: "Hết bảo hành",
    dataIndex: "warranty_expiry",
    render: (value: string) => new Date(value).toLocaleDateString("vi-VN"),
  },
 {
  title: "Trạng thái",
  dataIndex: "status",
  render: (value: string) => {
    const statusColorMap: Record<string, string> = {
      new: "blue",
      in_use: "green",
      under_repair: "orange",
      retired: "gray",
      damaged: "red",
      lost: "magenta",
      disposed: "volcano",
    };
    const statusLabelMap: Record<string, string> = {
      new: "Mới",
      in_use: "Đang dùng",
      under_repair: "Đang sửa",
      retired: "Ngưng dùng",
      damaged: "Hỏng",
      lost: "Mất",
      disposed: "Đã thanh lý",
    };
    return <Tag color={statusColorMap[value]}>{statusLabelMap[value]}</Tag>;
  },
}
];

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSource?.filter((dt) => {
        return String(
          dt.id +
            " " +
            dt.created_at +
            " " +
            dt.name +
            " " +
            dt.code_product
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      }) ?? []
    );
  };
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<GetAsset> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: GetAsset[]) => {
      setListSelect(selectedRows.map((dt) => dt.id));
    },
  };
  const handleDelete = async () => {
    // const statusCode = await postdata(() =>
    //   customerService.deleteInfoCustomer(listSelect)
    // );
    // if (statusCode === 200) {
    //   dispatch(
    //     fetchCustomerFilter({
    //       group: filterData === "" ? undefined : filterData,
    //     })
    //   );
    //   dispatch(fetchCustomerAbout());
    //   setListSelect([]);
    //   setIsModalConfirmDelete(false);
    // }
  };
  const searchParams = useSearchParams();
  useEffect(() => {
    // const id = searchParams.get("id");
    // if (dataSource && id) {
    //   handleSearchFilter(id);
    // } else {
      setDataFilter(
        dataSource.map((dt, index) => {
          return { ...dt, key: index };
        }) ?? []
      );
    // }
  }, [dataSource, searchParams]);
  useEffect(()=>{
    dispatch(fetchAssets())
  },[])
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
        </div>
        <div className="flex gap-2 items-center">
          {/* <Select
            placeholder="Nhóm khách hàng"
            style={{ minWidth: 120, flex: "1 1 0%" }}
            onChange={(e) => {
              // setFilterData({ ...filterData, project: e });
              setFilterData(e);
            }}
            showSearch
            allowClear
            filterOption={(input, option) => {
              const text = Array.isArray(option?.label)
                ? option.label.join("")
                : option?.label ?? "";
              return text.toLowerCase().includes(input.toLowerCase());
            }}
            options={itemGroup}
          /> */}
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
          <Table<GetAsset>
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataFilter}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: pageLimit, // Items per page
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </div>
      </div>
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
      <HistoryAsset id={idModal as string} handleCancel={handleCancel}/>
    </div>
  );
}
