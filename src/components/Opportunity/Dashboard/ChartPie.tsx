/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PieChart from "@/components/SaleComponent/PieChart/PieChart";
import {
  IGetDashboardOpportunityDto,
  IGetSourcesOpportunityDto,
} from "@/models/opportunityInterface";
import { fetchDashboardOpportunities } from "@/redux/store/slices/opportunitySlices/get_dashboard_opportunity.slice";
import { AppDispatch, RootState } from "@/redux/store/store";
import opportunityService from "@/services/opportunityService.";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// type Props = {}

export default function ChartPie() {
  const dispatch = useDispatch<AppDispatch>();
  const { RangePicker } = DatePicker;
  const [timeStartType,setTimeStartType] = useState<number>(new Date().getFullYear())
  const [timeEndType,setTimeEndType] = useState<number>(new Date().getFullYear())
  const [dataSrcType, setDataSrcType] = useState<{ name: string; y: number }[]>(
    []
  );

  const [dataSrcReason, setDataSrcReason] = useState<{ name: string; y: number }[]>(
    []
  );
  const { datas: dataOpportunityInYear } = useSelector(
    (state: RootState) => state.get_opportunities_dashboard
  );
  const [dataSrcSource, setDataSrcSource] = useState<
    { name: string; y: number }[]
  >([]);
  const fetchData = async () => {
    const resSource = await opportunityService.getSourcesFullOpportunity();
    const resReason = await opportunityService.getOpportunityDashReason();
    if (resSource.statusCode === 200 && resReason.statusCode === 200) {
    
      const dataSourceOK = resSource.data
        .sort(
          (a: IGetSourcesOpportunityDto, b: IGetSourcesOpportunityDto) =>
            (b?.opportunities?.length ?? 0) - (a?.opportunities?.length ?? 0)
        )
        .map((dt: IGetSourcesOpportunityDto) => {
          return { name: dt.name, y: dt.opportunities?.length };
        });
      setDataSrcReason([{name:'Tạm dừng',y:resReason?.data?.pause?.length},{name:'Đã hủy',y:resReason?.data?.cancel?.length}])
      setDataSrcSource(dataSourceOK);
    }
  };
  const fetchType = async ()=>{
    if (dataOpportunityInYear) {
      const dataTypeOK = dataOpportunityInYear.slice().sort(
          (a: IGetDashboardOpportunityDto, b: IGetDashboardOpportunityDto) =>
            (b?.opportunities ?? 0) - (a?.opportunities ?? 0)
        )
        .map((dt: IGetDashboardOpportunityDto) => {
          return { name: dt.name, y: dt.opportunities };
        });
      setDataSrcType(dataTypeOK as { name: string; y: number }[]);
    }
  }
  useEffect(() => {
    fetchType();
  }, [dataOpportunityInYear]);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(()=>{
    if(timeEndType && timeStartType){
      dispatch(fetchDashboardOpportunities({start_year:timeStartType,end_year:timeEndType}))
    }
  },[timeEndType,timeStartType])
  return (
    <div className="flex flex-wrap justify-between p-4 lg:flex-nowrap gap-8">
      <div className="p-4 flex-1 min-w-80">
        <div className="flex flex-wrap gap-2">
                  <RangePicker
                    picker={'year'}
                    value={[dayjs(new Date(timeStartType,0,1).getTime()), dayjs(new Date(timeEndType,0,1).getTime())]}
                    onChange={(e, values) => {
                      setTimeStartType(Number(values[0]));
                      setTimeEndType(Number(values[1]));
                    }}
                   
                  />
                </div>
        <PieChart
          dataSrc={dataSrcType}
          titleSrc={'<p class="slim-dashboard-title">Loại cơ hội</p>'}
          subTitleSrc={``}
          typeValueSuffix=" "
          nameSeries="Số cơ hội"

        />
      </div>
      <div className="p-4 flex-1 min-w-80">
        <PieChart
          dataSrc={dataSrcSource}
          titleSrc={'<p class="slim-dashboard-title">Nguồn cơ hội</p>'}
          subTitleSrc={``}
        />
      </div>
      <div className="p-4 flex-1 min-w-80">
        <PieChart
          dataSrc={dataSrcReason}
          titleSrc={'<p class="slim-dashboard-title">Cơ hội kém</p>'}
          subTitleSrc={``}
          typeValueSuffix=" "
          nameSeries="Số cơ hội"

        />
      </div>
    </div>
  );
}
