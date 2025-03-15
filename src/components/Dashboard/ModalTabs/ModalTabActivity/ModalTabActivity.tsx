import { AppDispatch, RootState } from "@/redux/store/store";
import { Button, Modal, Select, Table, TableColumnsType } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { IGetActivity } from "@/models/activityInterface";
import usePostData from "@/hooks/usePostData";
import activityService from "@/services/activityService";
import { useDispatch } from "react-redux";
import { fetchActivities } from "@/redux/store/slices/activitySlices/activity.slice";
import { MdDeleteForever } from "react-icons/md";
import { Option } from "antd/es/mentions";
import { useSelector } from "react-redux";
import useCheckRole from "@/utils/CheckRole";

export default function ModalTabActivity() {
  const [pageLimit, setPageLimit] = useState<number>(25);
  const [dataFilters, setDataFilters] = useState<{
    group_user?: string;
    project?: string;
    contract?: string;
  }>();
  const isAuthorized = useCheckRole(["admin-top", "activity"]);
  const [typeID, setTypeID] = useState<string>("");
  const [dataSources, setDataSources] = useState<IGetActivity[]>([]);
  const [dataFilter, setDataFilter] = useState<IGetActivity[] | [] | undefined>(
    []
  );
  const { datas: dataTypeActivities } = useSelector(
    (state: RootState) => state.get_type_activities
  );
  const { datas: dataGroup } = useSelector(
    (state: RootState) => state.get_group_user
  );
  const { datas: dataProject } = useSelector(
    (state: RootState) => state.get_projects
  );
  const { datas: dataContract } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const columns: TableColumnsType<IGetActivity> = [
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
      sorter: (a: IGetActivity, b: IGetActivity) =>
        a.activity_id.localeCompare(b.activity_id),
    },

    {
      title: "Tên hoạt động",
      dataIndex: "name",
      fixed: "left",
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
      title: "Ngày thực hiện",
      dataIndex: "time_start",
      className: "text-xs",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetActivity, b: IGetActivity) =>
        new Date(a.time_start || 0).getTime() -
        new Date(b.time_start || 0).getTime(),
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
    const res = isAuthorized
      ? await activityService.getAllActivitiesReady(typeID ?? "", dataFilters)
      : await activityService.getAllActivitiesReadyByUser(
          typeID ?? "",
          dataFilters
        );
    if (res.statusCode === 200) {
      setDataSources(res.data);
    }
  };
  useEffect(() => {
    if (typeID) {
      fetchData();
    }
  }, [typeID, isAuthorized]);
  useEffect(() => {
    if (dataFilters) {
      fetchData();
    }
  }, [dataFilters]);
  useEffect(() => {
    if (dataTypeActivities.length > 0) {
      setTypeID(dataTypeActivities[0].type_activity_id);
    }
  }, [dataTypeActivities]);

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
            dt.status
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
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1 flex-wrap">
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
          <Select
            placeholder="Chọn hoạt động"
            showSearch
            allowClear
            defaultValue={dataTypeActivities?.[0]?.type_activity_id}
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
            {dataTypeActivities?.map((dt) => (
              <Option key={dt.type_activity_id} value={dt.type_activity_id}>
                {dt.name}
              </Option>
            ))}
          </Select>
          {isAuthorized && (
            <>
              <Select
                placeholder="Chọn "
                showSearch
                allowClear
                onChange={(e) => {
                  setDataFilters({ ...dataFilters, group_user: e });
                }}
                filterOption={(input, option) => {
                  const text = Array.isArray(option?.children)
                    ? option.children.join("")
                    : option?.children ?? "";
                  return text.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataGroup?.map((dt) => (
                  <Option key={dt.group_id} value={dt.group_id}>
                    {dt.name_group}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Chọn dự án"
                showSearch
                allowClear
                onChange={(e) => {
                  setDataFilters({ ...dataFilters, project: e });
                }}
                filterOption={(input, option) => {
                  const text = Array.isArray(option?.children)
                    ? option.children.join("")
                    : option?.children ?? "";
                  return text.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataProject?.map((dt) => (
                  <Option key={dt.project_id} value={dt.project_id}>
                    {dt.name}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Chọn hợp đồng"
                showSearch
                allowClear
                onChange={(e) => {
                  setDataFilters({ ...dataFilters, contract: e });
                }}
                filterOption={(input, option) => {
                  const text = Array.isArray(option?.children)
                    ? option.children.join("")
                    : option?.children ?? "";
                  return text.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataContract?.map((dt) => (
                  <Option key={dt.contract_id} value={dt.contract_id}>
                    {dt.name_contract}
                  </Option>
                ))}
              </Select>
            </>
          )}

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
