/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import TableProject from './Table/TableProject'


export default function List() {
  return (
    <div className='flex flex-col gap-2 px-4'>
      <div className='flex gap-4'>
        {/* <div className='w-full max-w-80'>
          <ModalChartColumn/>
        </div> */}
        <div className='flex-1 max-w-full'>
          <TableProject/>
        </div>
      </div>
    </div>
  )
}