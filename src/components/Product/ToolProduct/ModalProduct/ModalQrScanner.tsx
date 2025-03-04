// components/QRCodeScanner.js
import { Button, Modal, Table } from "antd";
// import QrReader from "react-qr-reader";
import { BiQrScan } from "react-icons/bi";
import { ColumnsType } from "antd/es/table";
import productService from "@/services/productService";
import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IGetCodeProduct } from "@/models/productInterface";

const ModalQrScanner = () => {
  const [startScan, setStartScan] = useState(false);
  const [scanText, setScanText] = useState<string | undefined>();
  const [dataSource, setDataSource] = useState<IGetCodeProduct[]>([]);
  const handleScan = (scanData: string) => {
    if (scanData && scanData !== "") {
      setScanText(scanData);
      // console.log(dataSource2);
      // setDataSource2([...dataSource2, scanData]);
      // const dataCode = scanData.split("@");
      // console.log(dataSource);
      // const check = dataSource?.find((dt) => {
      //   return dt.code.includes(dataCode?.[0]);
      // });
      // if (!check && dataCode.length === 2) {
      //   const res =  productService.getCodeID(dataCode[0]);
      //   if (res.statusCode === 200) {
      //     console.log(dataSource);
      //     setDataSource((prevDataSource) => {
      //       return [...prevDataSource, res.data];
      //     });
      //   }
      // }
      // setStartScan(false);
      // console.log(scanData);
    }
  };
  useEffect(() => {
    const fetchDataCode = async (code: string) => {
      const res = await productService.getCodeID(code);
      if (res.statusCode === 200) {
        setDataSource([res.data, ...dataSource]);
      }
    };
    if (scanText && scanText !== "") {
      const dataCode = scanText.split("@");
      const check = dataSource?.find((dt) => {
        return dt.code.includes(dataCode?.[0]);
      });
      if (!check && dataCode.length === 2) {
        fetchDataCode(dataCode[0]);
      }
    }
  }, [scanText]);

  useEffect(() => {
    console.log(dataSource);
  }, [dataSource]);

  const handleCancel = async () => {
    setDataSource([]);
    setStartScan(false);
  };

  const columns: ColumnsType<IGetCodeProduct> = [
    {
      title: "ID sản phẩm",
      dataIndex: "code_product_id",
      key: "code_product_id",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["product", "name"],
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        let text = "";

        switch (status) {
          case "inventory":
            color = "bg-blue-500";
            text = "Lưu kho";
            break;
          case "selled":
            color = "bg-purple-500";
            text = "Đã bán";
            break;
          case "borrowed":
            color = "bg-orange-500";
            text = "Đã thuê";
            break;
          case "export":
            color = "bg-yellow-500";
            text = "Đã xuất kho";
            break;
          case "error":
            color = "bg-red-500";
            text = "Lỗi";
            break;
          default:
            color = "bg-gray-500";
            text = "Không xác định";
        }

        return (
          <div
            className={`flex items-center gap-1 ${color} text-white px-2 font-bold justify-center rounded-md`}
          >
            {text}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Button
        onClick={() => {
          setStartScan(!startScan);
        }}
        icon={<BiQrScan />}
      />

      {startScan && (
        <>
          <Modal
            title="Quét check sản phẩm"
            open={startScan}
            onCancel={handleCancel}
            footer={null}
            width={"100%"}
            style={{ maxWidth: "1000px" }}
          >
            <div className="flex flex-wrap">
              <div className="w-72 h-72">
                <Scanner
                  onScan={(e) => {
                    // setStartScan(false);
                    console.log(e);
                    if (e.length > 0) handleScan(e[0].rawValue);
                  }}
                />
              </div>

              <Table<IGetCodeProduct>
                columns={columns}
                className="flex-1 min-w-96"
                dataSource={dataSource}
                scroll={{ x: "max-content" }}
                pagination={{
                  pageSize: 10,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
                showSorterTooltip={{ target: "sorter-icon" }}
              />
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalQrScanner;
