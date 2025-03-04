// components/QRCodeScanner.js
import productService from "@/services/productService";
import { Button, Modal, QRCode } from "antd";
import { useState } from "react";

import { BiQrScan } from "react-icons/bi";

type Props = {
  productID: string;
  fetchListCode: () => void;
};

const ModalGenerateQr = ({ productID, fetchListCode }: Props) => {
  const [value, setValue] = useState<string | null>(null);
  const generateQR = async () => {
    const data = await productService.createCodeProduct(productID);
    if (data.statusCode === 201) {
      setValue(String(data.data.code));
      fetchListCode();
    }
  };
  const handleReset = () => {
    setValue(null);
  };

  return (
    <>
      <Button
        onClick={() => {
          // setStartScan(!startScan);
          generateQR();
        }}
        icon={<BiQrScan />}
      />
      <Modal
        title="QR Code sản phẩm"
        open={value ? true : false}
        onCancel={handleReset}
        footer={null}
        width={"100%"}
        style={{ maxWidth: "fit-content" }}
      >
        <QRCode value={value || "-"} />
      </Modal>
    </>
  );
};

export default ModalGenerateQr;
