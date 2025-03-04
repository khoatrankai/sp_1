import { IGetProductInfo } from "@/models/productInterface"; // Updated import
import { Button, Modal, Select, Switch, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import ModalUpdateProduct from "../ToolProduct/ModalProduct/ModalUpdateProduct";
import productService from "@/services/productService";
import usePostData from "@/hooks/usePostData";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { fetchProductAbout } from "@/redux/store/slices/productSlices/get_about.slice";
import { useDispatch } from "react-redux";
import { fetchProductInfos } from "@/redux/store/slices/productSlices/get_products";
import { MdDeleteForever } from "react-icons/md";
import useCheckRole from "@/utils/CheckRole";
// import ModalUpdateProduct from "../ToolProduct/ModalProduct/ModalUpdateProduct"

export default function ListProduct() {
  const { postdata } = usePostData();
  const isAuthorized = useCheckRole(["admin-top", "product", "product-edit"]);
  const dispatch = useDispatch<AppDispatch>();
  const { datas: dataVats } = useSelector(
    (state: RootState) => state.vat_system
  );
  const { datas: dataProfits } = useSelector(
    (state: RootState) => state.get_profits
  );

  const [pageLimit, setPageLimit] = useState<number>(25);
  const [dataFilter, setDataFilter] = useState<
    IGetProductInfo[] | [] | undefined
  >();
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.info_products
  );
  const columns: TableColumnsType<IGetProductInfo> = [
    {
      title: "#",
      className: "",
      dataIndex: "code_original",
      render: (value: string, record) => (
        <div className="flex flex-col gap-1 ">
          <strong>#{`${value ?? "".slice(0, 10)}...`}</strong>
          <div className="flex gap-2">
            {/* <Button type="text" ghost className=" text-blue-600">
              View
            </Button> */}
            {isAuthorized && (
              <ModalUpdateProduct productID={record.product_id} />
            )}
          </div>
        </div>
      ),
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        (a.code_original ?? "").localeCompare(b.code_original ?? ""),
    },
    {
      title: "Tên sản phẩm",
      className: "",
      dataIndex: "name",
      render: (value: string) => (
        <>{value.length > 15 ? `${value.slice(0, 15)}...` : value}</>
      ),
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        a.name.localeCompare(b.name),
    },
    {
      title: "Loại sản phẩm",
      className: "",
      dataIndex: ["type", "name"],
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        a.type.name.localeCompare(b.type.name),
      render: (value) => <>{value}</>,
    },
    {
      title: "Giá trị",
      className: "",
      dataIndex: "price",
      render: (value: number) => `${value.toLocaleString("vi-VN")}đ`,
      sorter: (a: IGetProductInfo, b: IGetProductInfo) => a.price - b.price,
    },
    {
      title: "Thuế",
      className: "",
      dataIndex: "vat",
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        (a.vat ?? "").localeCompare(b.vat ?? ""),
      render: (value) => (
        <>
          {
            dataVats?.find((dt) => {
              return dt.vat_id === value;
            })?.type_vat
          }
          %
        </>
      ),
    },
    {
      title: "Lợi nhuận",
      className: "",
      dataIndex: "profit",
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        (a.profit ?? "").localeCompare(b.profit ?? ""),
      render: (value) => (
        <>
          {
            dataProfits?.find((dt) => {
              return dt.profit_id === value;
            })?.type_profit
          }
          %
        </>
      ),
    },
    {
      title: "Trạng thái",
      className: "",
      dataIndex: "status",
      render: (value: string, record: IGetProductInfo) => (
        <>
          <Switch
            defaultChecked={value === "active"}
            onChange={async (check) => {
              const statusCode = await postdata(() =>
                productService.updateStatusProduct(
                  record.product_id,
                  check ? "active" : "hide"
                )
              );
              if (statusCode === 200) {
                dispatch(fetchProductAbout());
              }
            }}
          />
        </>
      ),
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        a.status.localeCompare(b.status),
    },
    {
      title: "Số lượng",
      className: "",
      dataIndex: "quantity",
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        a.quantity - b.quantity,
    },
    {
      title: "Đơn vị",
      className: "",
      dataIndex: ["unit_product", "name_unit"],
      sorter: (a: IGetProductInfo, b: IGetProductInfo) =>
        a.unit_product.name_unit.localeCompare(b.unit_product.name_unit),
      render: (value) => <>{value}</>,
    },
  ];

  useEffect(() => {
    setDataFilter(
      dataSource.map((dt, index) => {
        return { ...dt, key: index };
      })
    );
  }, [dataSource]);

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSource?.filter((dt) => {
        return String(
          dt.code_original +
            " " +
            dt.name +
            " " +
            dt.type +
            " " +
            dt.price +
            " " +
            dt.quantity
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetProductInfo> = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IGetProductInfo[]
    ) => {
      setListSelect(selectedRows.map((dt) => dt.product_id ?? ""));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      productService.deleteProducts(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchProductInfos());
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
              { value: 100000000, label: "All" },
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
            placeholder="Search"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<IGetProductInfo>
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
    </div>
  );
}
