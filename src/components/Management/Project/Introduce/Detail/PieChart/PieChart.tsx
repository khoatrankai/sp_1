import React from 'react';
import { Pie } from '@ant-design/plots';

type Props = {
    dataSource:{type:string,value:number}[],
    title:string
}

export default function PieChart({dataSource,title}: Props) {
    const DemoPie = () => {
        const config = {
          data: dataSource,
          angleField: 'value',
          colorField: 'type',
          innerRadius: 0.6,
          label: {
            text: 'value',
            style: {
              fontWeight: 'bold',
            },
          },
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
                text: title,
                x: '50%',
                y: '50%',
                textAlign: 'center',
                fontSize: 20,
                fontStyle: 'bold',
              },
            },
          ],
        };
        return <Pie {...config} />;
    }
    return <DemoPie/>
}