import { Tabs, TabsProps } from 'antd';
import React from 'react'
import ListOpportunityByPriceQuote from './ListOpportunityByPriceQuote';
import ListOpportunityHaveContract from './ListOpportunityHaveContract';


export default function TabList() {
    const items: TabsProps['items'] = [
        {
          key: '1',
          label: 'Có Báo Giá',
          children: <ListOpportunityByPriceQuote/>,
        },
        {
          key: '2',
          label: 'Có Hợp Đồng',
          children: <ListOpportunityHaveContract/>,
        }
      ];
  return (
    
        <div className="p-8 border-b-[1px]">
                <p className="mb-2 text-xl font-semibold">Danh sách cơ hội</p>
                <Tabs defaultActiveKey="1" items={items} />
              </div>

 
  )
}