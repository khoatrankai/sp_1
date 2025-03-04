"use client";
import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more.js";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
highchartsMore(Highcharts);
exporting(Highcharts);

type Props = {
  dataSrc: { name: string; y: number }[];
  titleSrc: string;
  subTitleSrc: string;
};

const ColumnChart = (props: Props) => {
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
      animation: {
        duration: 500,
      },
      marginRight: 50,
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
    legend: {
      enabled: false,
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      opposite: true,
      tickPixelInterval: 150,
      title: {
        text: null,
      },
      labels: {
        y: 340,
      },
    },
    plotOptions: {
      series: {
        animation: false,
        pointWidth: 16,
        groupPadding: 0,
        pointPadding: 0.1,
        borderWidth: 0,
        colorByPoint: true,
        dataSorting: {
          enabled: true,
          matchByName: true,
        },
        type: "bar",
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        type: "bar",
        data: dataSrc,
      },
    ],
  };

  return (
    <>
      {dataSrc && dataSrc.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ColumnChart;
