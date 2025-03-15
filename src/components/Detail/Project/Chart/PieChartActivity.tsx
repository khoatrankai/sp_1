/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import { useParams } from 'next/navigation';
import activityService from '@/services/activityService';

export const PieChartActivity = () => {
  const {id} = useParams()
  const [dataDashboard,setDataDashboard] = useState<any>()
  const fetchData = async ()=>{
    const res = await activityService.dashboardActivity(id as string)
    if(res.statusCode === 200){
      setDataDashboard(res.data)
    }
  }
  useEffect(()=>{
    if(id){
      fetchData()
    }
  },[id])
  const config = {
    data: [
      { type: 'Hoàn tất', value: dataDashboard?.completed ?? 0 },
      { type: 'Đang thực hiện', value: dataDashboard?.process ?? 0 },
      { type: 'Đã hủy', value: dataDashboard?.delete ?? 0 },
    ],
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    label: false,
    
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,

      },
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: `${(dataDashboard?.completed??1)/(dataDashboard?.total===0 ? 1:dataDashboard?.total)*100}`+'%',
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 15,
          fontStyle: 'bold',
        },
      },
    ],
  };
  return <>
  {dataDashboard && <Pie {...config} />}
  </> ;
};

