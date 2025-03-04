"use client";
import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more.js";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import "./styles.scss";
import contractService from "@/services/contractService.";
import systemService from "@/services/systemService";

highchartsMore(Highcharts);
exporting(Highcharts);
interface DataType {
  name: string;
  y: number;
}

const ModalPieChart = () => {
  const chartComponentRef = useRef(null);
  const [dataSrc, setDataSrc] = useState<DataType[]>([]);
  const [revenueCurrent, setRevenueCurrent] = useState<number>(0);
  const [targetRevenue, setTargetRevenue] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      const res = await contractService.getRevenueTotal();
      if (res.statusCode === 200) {
        const total = res.data;
        setRevenueCurrent(total);
        if (total <= targetRevenue) {
          setDataSrc([
            { name: "Đã đạt được", y: (total / targetRevenue) * 100 },
            {
              name: "Chưa đạt được",
              y: ((targetRevenue - total) / targetRevenue) * 100,
            },
          ]);
        } else {
          setDataSrc([
            { name: "Đã đạt được", y: (total / targetRevenue) * 100 },
            { name: "Chưa đạt được", y: 0 },
          ]);
        }
      }
      const resTarget = await systemService.getTargetYear();
      if (resTarget.statusCode === 200) {
        setTargetRevenue(resTarget?.data?.revenue ?? 0);
      }
    };
    fetchData();
  }, []);
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      useHTML: true,
      text: "Tổng doanh thu",
      align: "left",
      verticalAlign: "top",
      y: 20,
    },
    subtitle: {
      useHTML: true,
      text: `<p style="font-size: 16px">${revenueCurrent.toLocaleString(
        "vi-vn"
      )}đ / ${targetRevenue.toLocaleString("vi-vn")}đ</p>`,
      align: "left",
      verticalAlign: "top",
      y: 50,
      style: {
        fontSize: "12px",
        color: "rgb(102, 102, 102)",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Phần trăm",
        colorByPoint: true,
        data: dataSrc ?? [],
      },
    ],
    exporting: {
      enabled: false,
    },
  };

  return (
    <>
      {/* {dataSrc && dataSrc.length > 0 ? ( */}
      <div className="pieChart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />
      </div>
      {/* ) : (
        <></>
      )} */}
    </>
  );
};

export default ModalPieChart;
