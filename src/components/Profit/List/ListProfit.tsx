import { RootState } from "@/redux/store/store";
import { Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
// import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Profit } from "@/models/systemInterface";
import ModalUpdateProfit from "../Tool/Modal/ModalUpdateProfit/ModalUpdateProfit";
import useCheckRole from "@/utils/CheckRole";

export default function ListProfit() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole(["admin-top", "system", "system-edit"]);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_profits
  );
  const [dataFilter, setDataFilter] = useState<Profit[] | [] | undefined>([]);
  const columns: TableColumnsType<Profit> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "profit_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
          <div className="flex gap-2">
            {isAuthorized && <ModalUpdateProfit ID={value} />}
          </div>
        </div>
      ),
      sorter: (a: Profit, b: Profit) => a.profit_id.localeCompare(b.profit_id),
    },

    {
      title: "Lợi nhuận",
      dataIndex: "type_profit",
      className: "text-xs",
      render: (value?: string) => `${value}%` || "N/A",
      sorter: (a: Profit, b: Profit) => a.type_profit - b.type_profit,
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
        return String(dt.type_profit + " " + dt.profit_id)
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  // const { postdata } = usePostData();
  // const dispatch = useDispatch<AppDispatch>();
  // const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  // const [listSelect, setListSelect] = useState<string[]>([]);
  // const rowSelection: TableRowSelection<Profit> = {
  //   onChange: (
  //     selectedRowKeys: React.Key[],
  //     selectedRows: Profit[]
  //   ) => {
  //     setListSelect(selectedRows.map((dt) => dt.profit_id));
  //   },
  // };
  // const handleDelete = async () => {
  //   const statusCode = await postdata(() =>
  //     systemService.deleteProfit(listSelect)
  //   );
  //   if (statusCode === 200) {
  //     dispatch(fetchProfits());
  //     setListSelect([]);
  //     setIsModalConfirmDelete(false);
  //   }
  // };
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
          {/* <Button hidden={!(listSelect.length > 0)}>Xuất ra</Button> */}
          {/* <Button
            onClick={() => {
              setIsModalConfirmDelete(true);
            }}
            danger
            hidden={!(listSelect.length > 0)}
            className="text-xl"
            icon={<MdDeleteForever />}
          /> */}
          {/* <Modal
            open={isModalConfirmDelete}
            title={"Xóa dữ liệu"}
            onOk={handleDelete}
            onCancel={() => {
              setIsModalConfirmDelete(false);
            }}
          >
            Bạn có chắc chắn muốn xóa không ?
          </Modal> */}
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
          <Table<Profit>
            columns={columns}
            // className="text-xs"
            // rowSelection={rowSelection}
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
