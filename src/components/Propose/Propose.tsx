import React, { useState } from "react";
import ToolPropose from "./ToolPropose/ToolPropose";
import { FilterPropose } from "@/models/proposeInterface";
import ListPropose from "./ListPropose/ListPropose";

// type Props = {}

export default function Propose() {
  // const [dataSource, setDataSource] = useState<GetPropose[] | []>([]);
  const [filterData, setFilterData] = useState<FilterPropose>({});
  // const fetchData = async (filter: FilterPropose) => {
  // const data = await proposeService.getFilterPropose(filter);
  // if (data.statusCode === 200) {
  //   setDataSource(data.data);
  // }
  // };
  // useEffect(() => {
  //   fetchData(filterData);
  // }, [filterData]);
  return (
    <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
      <div className="rounded-md">
        <ToolPropose filterData={filterData} setFilterData={setFilterData} />
      </div>
      <div className="rounded-md">
        <ListPropose dataSource={[]} />
      </div>
    </div>
  );
}
