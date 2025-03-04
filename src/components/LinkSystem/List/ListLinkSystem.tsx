import { RootState } from "@/redux/store/store";
import { Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
// import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LinkSystem } from "@/models/systemInterface";
import ModalUpdateLinkSystem from "../Tool/Modal/ModalUpdateLinkSystem/ModalUpdateLinkSystem";
import useCheckRole from "@/utils/CheckRole";

export default function ListLinkSystem() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole(["admin-top", "system", "system-edit"]);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_link_system
  );
  const [dataFilter, setDataFilter] = useState<LinkSystem[] | [] | undefined>(
    []
  );
  const columns: TableColumnsType<LinkSystem> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "link_system_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
          <div className="flex gap-2">
            {isAuthorized && <ModalUpdateLinkSystem ID={value} />}
          </div>
        </div>
      ),
      sorter: (a: LinkSystem, b: LinkSystem) =>
        (a.link_system_id ?? "").localeCompare(b.link_system_id ?? ""),
    },

    {
      title: "Link",
      dataIndex: "link",
      className: "text-xs",
      render: (value?: string) => `${value}` || "N/A",
      sorter: (a: LinkSystem, b: LinkSystem) =>
        (a.link ?? "").localeCompare(b.link ?? ""),
    },
    {
      title: "Name_tag",
      dataIndex: "name_tag",
      className: "text-xs",
      render: (value?: string) => `${value}` || "N/A",
      sorter: (a: LinkSystem, b: LinkSystem) =>
        (a.name_tag ?? "").localeCompare(b.name_tag ?? ""),
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
        return String(dt.link_system_id + " " + dt.link + " " + dt.name_tag)
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  // const { postdata } = usePostData();
  // const dispatch = useDispatch<AppDispatch>();
  // const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  // const [listSelect, setListSelect] = useState<string[]>([]);
  // const rowSelection: TableRowSelection<LinkSystem> = {
  //   onChange: (
  //     selectedRowKeys: React.Key[],
  //     selectedRows: LinkSystem[]
  //   ) => {
  //     setListSelect(selectedRows.map((dt) => dt.LinkSystem_id));
  //   },
  // };
  // const handleDelete = async () => {
  //   const statusCode = await postdata(() =>
  //     systemService.deleteLinkSystem(listSelect)
  //   );
  //   if (statusCode === 200) {
  //     dispatch(fetchLinkSystems());
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
          <Table<LinkSystem>
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
