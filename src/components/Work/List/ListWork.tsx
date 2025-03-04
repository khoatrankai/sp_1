import { IGetWork } from "@/models/activityInterface";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Button, Modal, Select, Switch, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalUpdateWork from "../Tool/Modal/ModalUpdateWork/ModalUpdateWork";
import usePostData from "@/hooks/usePostData";
import { useDispatch } from "react-redux";
import activityService from "@/services/activityService";
import { fetchWorks } from "@/redux/store/slices/activitySlices/work.slide";
import { MdDeleteForever } from "react-icons/md";
import useCheckRole from "@/utils/CheckRole";
import { useSearchParams } from "next/navigation";

export default function ListActivity() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole([
    "admin-top",
    "activity",
    "activity-edit",
    "work",
    "work-edit",
  ]);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_works
  );
  const [dataFilter, setDataFilter] = useState<IGetWork[] | [] | undefined>([]);
  const columns: TableColumnsType<IGetWork> = [
    {
      title: "#",
      className: "text-xs",
      dataIndex: "work_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>#{index + 1}</strong>
          <div className="flex gap-2">
            {/* <Button type="text" ghost className="text-xs text-blue-600">
              Xem
            </Button> */}
            {isAuthorized && <ModalUpdateWork ID={value} />}
          </div>
        </div>
      ),
      sorter: (a: IGetWork, b: IGetWork) => a.work_id.localeCompare(b.work_id),
    },

    {
      title: "Tên công việc",
      dataIndex: "name",
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetWork, b: IGetWork) =>
        (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Hoạt động",
      dataIndex: ["activity", "name"],
      className: "text-xs",
      render: (value?: number) => (value ? `${value}` : "N/A"),
      sorter: (a: IGetWork, b: IGetWork) =>
        (a.activity?.name || "").localeCompare(b.activity?.name || ""),
    },
    {
      title: "Loại công việc",
      dataIndex: ["type", "name"],
      className: "text-xs",
      render: (value) => value || "N/A",
      sorter: (a: IGetWork, b: IGetWork) =>
        (a.type?.name || "").localeCompare(b.type?.name || ""),
    },
    {
      title: "Tình trạng",
      dataIndex: ["status", "name"],
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetWork, b: IGetWork) =>
        (a.status?.name || "").localeCompare(b.status?.name || ""),
    },
    {
      title: "Khẩn cấp",
      className: "text-xs",
      dataIndex: "urgent",
      render: (value, record) => (
        <>
          <Switch
            defaultChecked={value}
            onChange={async (e) => {
              handleChangeUrgent(record.work_id, e);
              // const statusCode = await postdata(() =>
              //   productService.updateStatusProduct(
              //     record.product_id,
              //     check ? "active" : "hide"
              //   )
              // );
              // if (statusCode === 200) {
              //   dispatch(fetchProductAbout());
              // }
            }}
          />
        </>
      ),
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "time_start",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetWork, b: IGetWork) =>
        new Date(a.time_start || 0).getTime() -
        new Date(b.time_start || 0).getTime(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "time_end",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetWork, b: IGetWork) =>
        new Date(a.time_end || 0).getTime() -
        new Date(b.time_end || 0).getTime(),
    },
  ];
  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          dt.created_at +
            " " +
            dt.name +
            " " +
            dt.activity?.name +
            " " +
            dt.time_start +
            " " +
            dt.time_end +
            " " +
            dt.status.name +
            " " +
            dt.work_id
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };
  const handleChangeUrgent = async (work_id: string, urgent: boolean) => {
    const res = await postdata(() =>
      activityService.updateWork(work_id, { urgent })
    );
    if (res === 200 || res === 201) {
      dispatch(fetchWorks());
    }
  };
  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetWork> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IGetWork[]) => {
      setListSelect(selectedRows.map((dt) => dt.work_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      activityService.deleteWorks(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchWorks());
      setListSelect([]);
      setIsModalConfirmDelete(false);
    }
  };
  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (dataSources && id) {
      handleSearchFilter(id);
    } else {
      setDataFilter(
        dataSources.map((dt, index) => {
          return { ...dt, key: index };
        })
      );
    }
  }, [dataSources, searchParams]);
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
          <Table<IGetWork>
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
