"use client";
import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more.js";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
import "./styles.scss";

highchartsMore(Highcharts);
exporting(Highcharts);

type Props = {
  dataSrc: { name: string; y: number }[];
  titleSrc: string;
  subTitleSrc: string;
  nameSeries?:string
  typeValueSuffix?:string
  
};

const PieChart = (props: Props) => {
  const chartComponentRef = useRef(null);
  const [dataSrc, setDataSrc] = useState(props.dataSrc || []);
  const [titleSrc, setTitleSrc] = useState(props.titleSrc || "");
  const [subTitleSrc, setSubTitleSrc] = useState(props.subTitleSrc || "");
  useEffect(() => {
    setDataSrc(props.dataSrc);
    setSubTitleSrc(props.subTitleSrc);
    setTitleSrc(props.titleSrc);
  }, [props]);
  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      useHTML: true,
      text: titleSrc,
      align: "left",
      verticalAlign: "top",
      y: 20,
    },
    subtitle: {
      useHTML: true,
      text: subTitleSrc,
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
        valueSuffix: props.typeValueSuffix??"%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}",
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: props.nameSeries??"Phần trăm",
        colorByPoint: true,
        data: dataSrc,
      },
    ],
    exporting: {
      enabled: false, // Ẩn Chart Context Menu
    },
  };

  return (
    <>
      {dataSrc && dataSrc.length > 0 ? (
        <div className="pieChart">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartComponentRef}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PieChart;
