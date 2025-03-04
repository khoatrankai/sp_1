import { AppDispatch, RootState } from "@/redux/store/store";
import { Button, Modal, Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalUpdateActivity from "../Tool/Modal/ModalUpdateSupplier/ModalUpdateSupplier";
import { IGetSupplierProduct } from "@/models/productInterface";
import usePostData from "@/hooks/usePostData";
import { useDispatch } from "react-redux";
import productService from "@/services/productService";
import { fetchSuppliers } from "@/redux/store/slices/productSlices/get_supplier.slice";
import { MdDeleteForever } from "react-icons/md";
import useCheckRole from "@/utils/CheckRole";

export default function ListSupplier() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole(["admin-top", "product", "product-edit"]);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_supplier
  );
  const [dataFilter, setDataFilter] = useState<
    IGetSupplierProduct[] | [] | undefined
  >([]);
  const columns: TableColumnsType<IGetSupplierProduct> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "supplier_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
          <div className="flex gap-2">
            {isAuthorized && <ModalUpdateActivity ID={value} />}
          </div>
        </div>
      ),
      sorter: (a: IGetSupplierProduct, b: IGetSupplierProduct) =>
        a.supplier_id.localeCompare(b.supplier_id),
    },

    {
      title: "Tên nhà cung ứng",
      dataIndex: "name",
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetSupplierProduct, b: IGetSupplierProduct) =>
        (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      className: "text-xs",
      render: (value?: number) => (value ? `${value}` : "N/A"),
      sorter: (a: IGetSupplierProduct, b: IGetSupplierProduct) =>
        (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      className: "text-xs",
      render: (value) => value || "N/A",
      sorter: (a: IGetSupplierProduct, b: IGetSupplierProduct) =>
        (a.phone_number || "").localeCompare(b.phone_number || ""),
    },
  ];
  useEffect(() => {
    setDataFilter(
      dataSources.map((dt, index) => {
        return { ...dt, key: index };
      })
    );
  }, [dataSources]);
  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          dt.email +
            " " +
            dt.name +
            " " +
            dt.phone_number +
            " " +
            dt.supplier_id
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetSupplierProduct> = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IGetSupplierProduct[]
    ) => {
      setListSelect(selectedRows.map((dt) => dt.supplier_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      productService.deleteSupplier(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchSuppliers());
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
          <Table<IGetSupplierProduct>
            columns={columns}
            // className="text-xs"
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
    </div>
  );
}
