// import usePostData from "@/hooks/usePostData";
import {
  Button,
  Modal,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, {  useEffect, useState } from "react";
import { AppDispatch } from "@/redux/store/store";
import { useDispatch } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
// import useCheckRole from "@/utils/CheckRole";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import ModalUpdateContractor from "../ToolContractor/ModalContractor/ModalUpdateContractor";
import { fetchContractors } from "@/redux/store/slices/projectSlices/get_contractor.slice";
import { IGetContractor } from "@/models/projectInterface";

export default function ListContractor() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  // const isAuthorized = useCheckRole(["admin-top", "product"]);
  // const [filterData, setFilterData] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  // const { postdata } = usePostData();
   const [dataFilter, setDataFilter] = useState<
    IGetContractor[] | [] | undefined
  >([]);
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_contractors
  );
  const columns: TableColumnsType<IGetContractor> = [
  {
    title: "#",
    dataIndex: "id",
    render: (value: string,record) => (
      <div className="flex flex-col gap-1">
        <strong>{value.slice(0, 10)}...</strong>
        <div className="flex gap-2">
                    {/* {isAuthorized && ( */}
                      <>
                        <ModalUpdateContractor contractor_id={record.id} />
                      </>
                    {/* )} */}
                    {/* <Button
          type="link"
          onClick={() => {
            window.location.href = `/assets/detail/${value}`;
          }}
        >
          Xem
        </Button> */}
                  </div>
        
      </div>
    ),
  },
  {
    title: "Tên nhà thầu",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
   {
    title: "Số điện thoại",
    dataIndex: "phone",
    sorter: (a, b) => (a.phone??"").localeCompare(b.phone ?? ""),
  },
  {
    title: "Thuộc khách hàng",
    dataIndex: ["customer", "name_company"],
    sorter: (a, b) =>
      (a?.customer?.name_company??"").localeCompare(b?.customer?.name_company??""),
  },
    {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => (a.email??"").localeCompare(b.email??""),
  },
   {
    title: "Mã thuế",
    dataIndex: "tax_code",
    sorter: (a, b) => (a.tax_code ?? "").localeCompare(b.tax_code??""),
  },
   {
    title: "Chất lượng",
    dataIndex: "rating",
    sorter: (a, b) => (a.rating??0)-(b.rating??0),
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
            dt.email +" "+
            dt.phone +" "+
            dt.tax_code +" "+
            dt.address +" "
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      }) ?? []
    );
  };
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetContractor> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IGetContractor[]) => {
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
    dispatch(fetchContractors())
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
          <Table<IGetContractor>
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
    </div>
  );
}
