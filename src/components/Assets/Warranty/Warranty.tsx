import React, { Ref, useState } from "react";
import ToolWarranty from "./ToolWarranty/ToolWarranty";
import ListWarranty from "./ListWarranty/ListWarranty";
import { Button, Modal } from "antd";
// import { IoAddOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { fetchWarranties } from "@/redux/store/slices/productSlices/get_all_warranty.slice";

type Props = {
  idAsset?:string
  refBtnWarranty?:Ref<HTMLButtonElement>
};

export default function Warranty({idAsset,refBtnWarranty}:Props) {
  const dispatch = useDispatch<AppDispatch>();
  
  
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  
    const showModal = () => {
      setIsModalVisible(true);
      dispatch(fetchWarranties(idAsset??""))
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  
    
  return (
    
    <>
          <Button
            hidden={refBtnWarranty ? true : false}
            className="text-blue-400 font-semibold"
            // icon={<IoAddOutline />}
            type="link"
            onClick={showModal}
            ref={refBtnWarranty}
          >
            Bảo hành
          </Button>
          <Modal
            title="Bảo hành"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={"100%"}
            style={{ maxWidth: "800px" }}
          >
            <div>
      <div className="flex flex-col gap-4 rounded-md p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white">
        <div className="rounded-md">
          <ToolWarranty idAsset={idAsset}/>
        </div>
        <div className="rounded-md">
          <ListWarranty idAsset={idAsset}/>
        </div>
      </div>
    </div>
          </Modal>
        </>
  );
}
