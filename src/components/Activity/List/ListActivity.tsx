import { AppDispatch, RootState } from "@/redux/store/store";
import { Button, Modal, Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalUpdateActivity from "../Tool/Modal/ModalUpdateActivity/ModalUpdateActivity";
import { IGetActivity } from "@/models/activityInterface";
import usePostData from "@/hooks/usePostData";
import activityService from "@/services/activityService";
import { useDispatch } from "react-redux";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { MdDeleteForever } from "react-icons/md";
import { useParams, useSearchParams } from "next/navigation";
import ModalWordStatus from "../Tool/Modal/ModalWordStatus/ModalWordStatus";
import useCheckRole from "@/utils/CheckRole";

export default function ListActivity() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const isAuthorized = useCheckRole(["admin-top", "activity", "activity-edit"]);
  const { projectID } = useParams();
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_activities
  );
  const [dataFilter, setDataFilter] = useState<IGetActivity[] | [] | undefined>(
    []
  );
  useEffect(() => {
    if (projectID) {
      dispatch(fetchActivities({ project: projectID as string }));
    }
  }, [projectID]);
  const columns: TableColumnsType<IGetActivity> = [
    {
      title: "Hợp đồng#",
      className: "text-xs",
      dataIndex: "activity_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
          <div className="flex gap-2">
            {isAuthorized && (
              <>
                <ModalUpdateActivity ID={value} />
                <ModalWordStatus ID={value} />
              </>
            )}
          </div>
        </div>
      ),
      sorter: (a: IGetActivity, b: IGetActivity) =>
        a.activity_id.localeCompare(b.activity_id),
    },

    {
      title: "Tên hoạt động",
      dataIndex: "name",
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetActivity, b: IGetActivity) =>
        (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Hợp đồng",
      dataIndex: ["contract", "name_contract"],
      className: "text-xs",
      render: (value?: number) =>
        value ? `${value.toLocaleString("vi-VN")}đ` : "N/A",
      sorter: (a: IGetActivity, b: IGetActivity) =>
        (a.contract?.name_contract || "").localeCompare(
          b.contract?.name_contract || ""
        ),
    },
    {
      title: "Loại hoạt động",
      dataIndex: ["type", "name"],
      className: "text-xs",
      render: (value) => value || "N/A",
      sorter: (a: IGetActivity, b: IGetActivity) =>
        (a.type?.name || "").localeCompare(b.type?.name || ""),
    },
    {
      title: "Tình trạng",
      dataIndex: ["status", "name"],
      className: "text-xs",
      render: (value?: string) => value || "N/A",
      sorter: (a: IGetActivity, b: IGetActivity) =>
        (a.status?.name || "").localeCompare(b.status?.name || ""),
    },

    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetActivity, b: IGetActivity) =>
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime(),
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
            dt.contract?.name_contract +
            " " +
            dt.created_at +
            " " +
            dt.status +
            " " +
            dt.activity_id
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
  const rowSelection: TableRowSelection<IGetActivity> = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IGetActivity[]) => {
      setListSelect(selectedRows.map((dt) => dt.activity_id));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      activityService.deleteActivities(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchActivities({}));
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
          <Table<IGetActivity>
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
