import React, { Ref, useState } from 'react'
import Kanban from './DragDrop/Kanban'
import { Button, Modal } from 'antd'

type Props ={
  refBtn?:Ref<HTMLButtonElement>
}
export default function ListTask({refBtn}:Props) {
  const [isTab,setIsTab] = useState<boolean>(false)
  const showModal = ()=>{
    setIsTab(true)
  }
  const cancelModal = ()=>{
    setIsTab(false)
  }
  return (
    <>
      <Button ref={refBtn} onClick={showModal}/>
      <Modal
          title="Danh sách task"
          open={isTab}
          footer={null}
          onCancel={cancelModal}
          width={"100%"}
          style={{ minHeight: "100vh",minWidth:'90vw' }}
          >
            <Kanban/>
          </Modal>
     
    </>
  )
}