"use client";
import React, { useRef } from "react";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";
import HighchartsReact from "highcharts-react-official";
import exporting from "highcharts/modules/exporting";
highchartsMore(Highcharts);
solidGauge(Highcharts);
exporting(Highcharts);
const GaugeChart2 = () => {
  const chartComponentRef = useRef(null);

  const options = {
    chart: {
      type: "gauge",
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: "300px",
    },
    title: {
      text: '<span class="slim-dashboard-title">Doanh thu của tôi</span>',
      useHTML: true,
      align: "left",
      verticalAlign: "top",
      style: {
        fontFamily:
          '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
        fontSize: "18px",
        color: "rgb(51, 51, 51)",
        marginLeft: "0px",
        marginTop: "0px",
      },
    },
    subtitle: {
      text: `Thiết lập mục tiêu doanh thu <a style="color: blue" href="https://crm.slimsoft.vn/demo/admin/goals" target="_blank">(Tại đây)</a>`,
      useHTML: true,
      align: "left",
      verticalAlign: "top",
      style: {
        fontFamily:
          '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
        fontSize: "12px",
        color: "rgb(102, 102, 102)",
        marginLeft: "0px",
        marginTop: "0px",
      },
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      background: null,
      center: ["50%", "75%"],
      size: "110%",
    },
    yAxis: {
      min: -10,
      max: 10,
      tickPixelInterval: 72,
      tickPosition: "inside",
      tickPositions: [0],
      tickColor: Highcharts.defaultOptions.chart?.backgroundColor || "#FFFFFF",
      tickLength: 10,
      tickWidth: 2,
      minorTickInterval: null,
      labels: {
        distance: 20,
        style: {
          fontSize: "14px",
        },
      },
      lineWidth: 1,
    },
    series: [
      {
        name: "Speed",
        data: [200000000],
        dataLabels: {
          format: "{y} đ",
          borderWidth: 0,
          color:
            (Highcharts?.defaultOptions?.title &&
              Highcharts?.defaultOptions?.title?.style &&
              Highcharts?.defaultOptions?.title?.style?.color) ||
            "#333333",
          style: {
            fontSize: "16px",
          },
        },
        dial: {
          radius: "80%",
          backgroundColor: "gray",
          baseWidth: 12,
          baseLength: "0%",
          rearLength: "0%",
        },
        pivot: {
          backgroundColor: "gray",
          radius: 6,
        },
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
    />
  );
};

export default GaugeChart2;
