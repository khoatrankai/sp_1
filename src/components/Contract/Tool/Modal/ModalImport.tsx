
import {
  Button,
  Modal,
} from "antd";
import React, { Ref,  useState } from "react";
import { ContractExcelManager } from "../../contract-excel-manager";
import { CiImport } from "react-icons/ci";

type Props = {
  refBtnImport?: Ref<HTMLButtonElement>;
};

export default function ModalImport({ refBtnImport }: Props) {


  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

 
  return (
    <>
      <Button
        hidden={refBtnImport ? true : false}
        className="bg-blue-400 border-0 text-white font-semibold"
        icon={<CiImport />}
        onClick={showModal}
        ref={refBtnImport}
      />
      <Modal
        title="Quản lý hợp đồng"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "800px" }}
      >
        <ContractExcelManager/>
      </Modal>
      
    </>
  );
}
