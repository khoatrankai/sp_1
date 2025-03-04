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

interface plotType {
  from: number;
  to: number;
  color: string;
}

type Props = {
  min: number;
  max: number;
  dataSrc: number;
  plotBands: plotType[];
  thinkness: number;
  tickPositions: number[];
  subtitle: string;
  title: string;
};

const GaugeChart = (props: Props) => {
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
      text: props.title,
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
      text: props.subtitle,
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
      min: props.min,
      max: props.max,
      tickPixelInterval: 72,
      tickPosition: "inside",
      tickColor: Highcharts.defaultOptions.chart?.backgroundColor || "#FFFFFF",
      tickLength: 10,
      tickWidth: 2,
      minorTickInterval: null,
      tickPositions: props.tickPositions,
      labels: {
        distance: 20,
        style: {
          fontSize: "14px",
        },
      },
      lineWidth: 0,
      plotBands: props.plotBands.map((dt) => {
        return { ...dt, thinkness: props.thinkness };
      }),
    },
    series: [
      {
        name: "Speed",
        data: [props.dataSrc],
        dataLabels: {
          format: "{y}",
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

export default GaugeChart;
