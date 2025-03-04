/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more.js";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import "./styles.scss";
import opportunityService from "@/services/opportunityService.";
import { useRouter } from "next/navigation";

highchartsMore(Highcharts);
exporting(Highcharts);
interface DataType {
  name: string;
  y: number;
}

const ModalPieChartOpportunity = () => {
  const router = useRouter()
  const chartComponentRef = useRef(null);
  const [dataSrc, setDataSrc] = useState<DataType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await opportunityService.getOpportunityDashboardStatus();
      if (res.statusCode === 200) {
        setDataSrc(
          res.data.map((dt: { status: string; count: number }) => {
            return {
              name:
              dt.status === "pending"
              ? "Đang tiếp cận"
              : dt.status === "success"
              ? "Thành công"
              : dt.status === "delete"
              ? "Đã xóa"
              : dt.status === "hide"
              ? "Đã ẩn"
              : dt.status === "cancel"
              ? "Đã hủy"
              : dt.status === "send"
              ? "Đã gửi"
              : dt.status === "pause"
              ? "Đang tạm dừng"
              : "Trạng thái không xác định",
              y: dt.count,
            };
          })
        );
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
      text: "Cơ hội",
      align: "left",
      verticalAlign: "top",
      y: 20,
    },
    subtitle: {
      useHTML: true,
      text: `<a style="font-size: 16px" href="/admin/opportunity">${dataSrc.reduce(
        (preValue, currValue) => {
          return preValue + currValue.y;
        },
        0
      )} cơ hội</a>`,
      align: "left",
      verticalAlign: "top",
      y: 50,
      style: {
        fontSize: "12px",
        color: "rgb(102, 102, 102)",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f} cơ hội</b>",
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
        name: "Số cơ hội",
        colorByPoint: true,
        data: dataSrc ?? [],
        events: {
          click: (event:any) => {
            if (event.name === "Đang tiếp cận") {
              handleLink("pending");
          } else if (event.name === "Thành công") {
              handleLink("success");
          } else if (event.name === "Đã xóa") {
              handleLink("delete");
          } else if (event.name === "Đã ẩn") {
              handleLink("hide");
          } else if (event.name === "Đã hủy") {
              handleLink("cancel");
          } else if (event.name === "Đã gửi") {
              handleLink("send");
          } else {
              handleLink("pause");
          } 
          },
        },
      },
    ],
    exporting: {
      enabled: false,
    },
  };
  const handleLink = async(status:string)=>{
    router.push(`/admin/opportunity?status=${status}`)
  }
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

export default ModalPieChartOpportunity;
