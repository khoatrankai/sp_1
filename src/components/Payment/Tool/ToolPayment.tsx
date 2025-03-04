import { DatePicker, Select, Tag } from "antd";
import React, { useEffect, useState } from "react";
// import { FaChartPie } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
import ModalAddPayment from "./Modal/ModalPayment";
import ModalTypeMethod from "./Modal/ModalTypeMethod/ModalTypeMethod";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { Option } from "antd/es/mentions";
import { useDispatch } from "react-redux";
import { fetchPayments } from "@/redux/store/slices/contractSlices/payment.slide";
import { useParams } from "next/navigation";

// type MenuItem = {
//   value: string;
//   label: string;
// };
interface FilterPayment {
  type?: string;
  date_start?: string;
  date_end?: string;
  status?: string;
  supplier?: string;
  contract?: string;
  customer?: string;
}

// const { RangePicker } = DatePicker;

export default function ToolPayment() {
  const { RangePicker } = DatePicker;
  const { customerID, projectID } = useParams();
  const [filterData, setFilterData] = useState<FilterPayment>({
    customer: (customerID as string) ?? undefined,
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (filterData) {
      dispatch(fetchPayments({ ...filterData, project: projectID as string }));
    }
  }, [filterData, projectID]);
  // const { data: dataUsers } = useFetchData<InfoUser[]>(userService.getUsers);

  const { datas: dataSupplier } = useSelector(
    (state: RootState) => state.get_supplier
  );
  const { datas: dataSource } = useSelector(
    (state: RootState) => state.get_payments
  );
  const { datas: dataContracts } = useSelector(
    (state: RootState) => state.get_contracts
  );
  // const [itemProject, setItemProject] = useState<MenuItem[]>([]);

  // useEffect(() => {
  //   if (dataProjects) {
  //     const customData =
  //       dataProjects.map((dt) => {
  //         return { value: dt.project_id, label: dt.name ?? "" };
  //       }) ?? [];
  //     setItemProject(customData);
  //   }
  // }, [dataProjects]);
  const optionTypePayment = [
    {
      value: "import",
      label: "Nhà cung cấp",
    },
    { value: "export", label: "Khách hàng" },
  ];
  const optionStatusPayment = [
    {
      value: "success",
      label: "Đã thanh toán",
    },
    { value: "pending", label: "Chưa thanh toán" },
    { value: "fail", label: "Thất bại" },
    { value: "expired", label: "Quá hạn" },
    { value: "ready", label: "Sắp tới" },
  ];
  return (
    <div className="flex items-start gap-4 w-full flex-col">
      <div className="flex gap-2 items-center  flex-wrap">
        {/* <Button
          className="bg-blue-400 border-0 text-white font-semibold"
          icon={<IoAddOutline />}
        >
          Thêm đề xuất
        </Button> */}
        <ModalAddPayment />
        <ModalTypeMethod />
        {/* <Button icon={<FaChartPie />} /> */}
      </div>
      {!projectID && (
        <div className="flex flex-col gap-2 w-full">
          <p className="text-sm font-semibold text-[#1BA399]">Được lọc theo:</p>
          <div className="flex flex-wrap w-full items-center justify-end gap-2   pb-4 ">
            {!customerID && (
              <>
                <Select
                  placeholder="Loại hóa đơn"
                  style={{ minWidth: 120, flex: "1 1 0%" }}
                  onChange={(e) => {
                    setFilterData({
                      ...filterData,
                      type: e,
                      supplier: undefined,
                      contract: undefined,
                    });
                  }}
                  showSearch
                  allowClear
                  filterOption={(input, option) => {
                    const text = Array.isArray(option?.label)
                      ? option.label.join("")
                      : option?.label ?? "";
                    return text.toLowerCase().includes(input.toLowerCase());
                  }}
                  options={optionTypePayment}
                />
                {filterData.type === "import" && (
                  <Select
                    placeholder="Nhà cung cấp"
                    showSearch
                    filterOption={(input, option) => {
                      return (option?.children?.join("") ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                    onChange={(e) => {
                      setFilterData({ ...filterData, supplier: e });
                    }}
                    style={{ minWidth: 120, flex: "1 1 0%" }}
                  >
                    {dataSupplier?.map((dt) => (
                      <Option key={dt.supplier_id} value={dt.supplier_id}>
                        {dt.name}
                      </Option>
                    ))}
                  </Select>
                )}
                {filterData.type === "export" && (
                  <Select
                    placeholder="Hợp đồng"
                    showSearch
                    allowClear
                    filterOption={(input, option) => {
                      return ((option?.children ?? "") as string)
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                    onChange={(e) => {
                      setFilterData({ ...filterData, contract: e });
                    }}
                    style={{ minWidth: 120, flex: "1 1 0%" }}
                  >
                    {dataContracts?.map((dt) => (
                      <Option key={dt.contract_id} value={dt.contract_id}>
                        {dt.name_contract}
                      </Option>
                    ))}
                  </Select>
                )}
              </>
            )}

            {["success", "pending", "fail", undefined].includes(
              filterData.status
            ) && (
              <RangePicker
                style={{ minWidth: 120, flex: "1 1 0%" }}
                onChange={(e, values) => {
                  setFilterData({
                    ...filterData,
                    date_start: values[0],
                    date_end: values[1],
                  });
                }}
              />
            )}

            <Select
              placeholder="Tình trạng"
              onChange={(e) => {
                setFilterData({ ...filterData, status: e });
              }}
              style={{ minWidth: 120, flex: "1 1 0%" }}
              showSearch
              allowClear
              filterOption={(input, option) => {
                const text = Array.isArray(option?.label)
                  ? option.label.join("")
                  : option?.label ?? "";
                return text.toLowerCase().includes(input.toLowerCase());
              }}
              options={optionStatusPayment}
            />
          </div>
        </div>
      )}

      <div className="w-full">
        {/* <h2 className="font-semibold text-[#1BA399]">Tóm lược dự án</h2> */}
        <div className="flex justify-around gap-2 flex-wrap">
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataSource
                .reduce((preValue, currValue) => {
                  if (currValue.status === "success") {
                    return preValue + (currValue.price ?? 0);
                  }
                  return preValue;
                }, 0)
                .toLocaleString("vi-vn")}
              đ
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Đã thanh toán
            </p>
          </Tag>
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataSource
                .reduce((preValue, currValue) => {
                  const today = new Date().getTime();
                  const expired = new Date(
                    currValue.date_expired ?? ""
                  ).getTime();
                  if (currValue.status === "pending" && today <= expired) {
                    return preValue + (currValue.price ?? 0);
                  }
                  return preValue;
                }, 0)
                .toLocaleString("vi-vn")}
              đ
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Chưa thanh toán
            </p>
          </Tag>
          <Tag className="lex flex-col pl-4 pt-8 rounded-lg gap-2 min-w-fit flex-1 h-32 bg-[#EB8823] border-0 shadow-lg  shadow-black/20">
            <p className="font-bold text-3xl text-white">
              {dataSource
                .reduce((preValue, currValue) => {
                  const today = new Date().getTime();
                  const expired = new Date(
                    currValue.date_expired ?? ""
                  ).getTime();
                  if (currValue.status === "pending" && today > expired) {
                    return preValue + (currValue.price ?? 0);
                  }
                  return preValue;
                }, 0)
                .toLocaleString("vi-vn")}
              đ
            </p>
            <p className="text-xs text-wrap text-slate-50/80 min-w-36">
              Đã quá hạn
            </p>
          </Tag>
        </div>
      </div>
    </div>
  );
}
