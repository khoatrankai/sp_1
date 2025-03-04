/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
// import useFetchData from "@/hooks/useFetchData";
import {
  IExportPriceQuote,
  IGetPriceQuote,
} from "@/models/priceQuoteInterface";
// import { Vat } from "@/models/systemInterface";
import { AppDispatch, RootState } from "@/redux/store/store";
// import systemService from "@/services/systemService";
import { Button, Modal, Select, Table, TableColumnsType, Tag } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
// import fs from "fs";
import ModalUpdatePriceQuote from "../Tool/Modal/ModalUpdatePriceQuote/ModalUpdatePriceQuote";
import priceQuoteService from "@/services/priceQuoteService";
import usePostData from "@/hooks/usePostData";
import { useDispatch } from "react-redux";
import { fetchPriceQuotes } from "@/redux/store/slices/priceQuoteSlices/get_price_quotes.slice";
import { MdDeleteForever } from "react-icons/md";
import { useParams, useSearchParams } from "next/navigation";
import useCheckRole from "@/utils/CheckRole";

export default function ListPropose() {
  // const { data: dataVats } = useFetchData<Vat[]>(systemService.getVats);
  const isAuthorized = useCheckRole([
    "admin-top",
    "price_quote",
    "price_quote-edit",
  ]);
  const { customerID } = useParams();
  const [pageLimit, setPageLimit] = useState<number>(25);
  const { datas: dataSources } = useSelector(
    (state: RootState) => state.get_price_quotes
  );
  const { datas: dataUnits } = useSelector(
    (state: RootState) => state.unit_product
  );
  // const { datas: dataProfits } = useSelector(
  //   (state: RootState) => state.get_profits
  // );
  useEffect(() => {
    if (customerID) {
      dispatch(fetchPriceQuotes({ customer: customerID as string }));
    }
  }, [customerID]);
  const createExcelPriceQuote = async (dataPriceQuote: IExportPriceQuote) => {
    const calculateRowHeight = (
      content: string,
      columnWidths: number,
      font: number
    ) => {
      const ROW_HEIGHT_PER_LINE = font;
      const manualLines = content.split("\n");
      const lengthLines =
        manualLines.length +
        manualLines.reduce((preValue, currValue) => {
          const lengthContent = Math.ceil(currValue.length / columnWidths) - 1;
          return lengthContent + preValue;
        }, 0);
      return (ROW_HEIGHT_PER_LINE * lengthLines * 100) / 80;
    };
    const listPriceQuote = dataPriceQuote.parts.map((dt) => {
      return {
        title: dt.title,
        list: dt.products.map((dtt) => {
          return {
            name: dtt.name,
            description: dtt.description,
            refresh_code: dtt.code_original,
            brand: dtt.brand.name + " " + dtt.original.name,
            unit: dtt.unit_product.name_unit,
            quantity: dtt.quantity,
            profit: dtt.profit.type_profit,
            price: dtt.price,
            list_detail: dtt.list_detail,
          };
        }),
        type: dt.products.find((dtt) => dtt.list_detail.length > 0)
          ? true
          : false,
      };
    });
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Sheet 1");

    const imagePath = "/image/header.png"; // Đường dẫn tới ảnh trong thư mục public
    const imageBuffer = await fetch(imagePath).then((res) => res.arrayBuffer());

    const listPolicy = [
      {
        title: "Điều khoản thương mại chung",
        list: [
          "Địa điểm giao hàng: Giá trên được hiểu là giá giao hàng đến công trình",
          "Thiết bị cung cấp và thi công, lắp đặt là hàng hóa mới 100%",
          "Bảng giá này có giá trị 30 ngày kể từ ngày báo giá",
          "Thời hạn thực hiện: Trong vòng 4-6 tuần kể từ ngày ký hợp đồng hoặc báo giá có hiệu lực",
        ],
      },
    ];
    console.log("qua roi");
    const myBuffer = Buffer.from(imageBuffer);
    const imageId = workbook.addImage({
      buffer: myBuffer as any,
      extension: "png",
    });
    worksheet.addImage(imageId, {
      tl: { col: 1, row: 0 },
      ext: { width: 1021, height: 120 },
    });
    const setupHeight = [
      { index: 10, height: 22.8 },
      { index: 11, height: 20.4 },
      { index: 14, height: 20.1 },
      { index: 15, height: 20.1 },
      { index: 16, height: 20.1 },
      { index: 17, height: 20.1 },
      { index: 18, height: 20.1 },
      { index: 19, height: 20.1 },
      { index: 24, height: 59.1 },
    ];

    worksheet.mergeCells("B10:J10");
    worksheet.getCell("B10").alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    worksheet.mergeCells("B11:J11");
    worksheet.getCell("B11").alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    for (let i = 0; i < setupHeight.length; i++) {
      worksheet.getRow(setupHeight[i].index).height =
        (setupHeight[i].height * 100) / 80;
    }

    worksheet.getCell("B10").value = {
      richText: [
        {
          text: dataPriceQuote?.project?.name ?? "",
          font: { bold: true, size: 18, name: "Arial" },
        },
      ],
    };

    worksheet.getCell("B11").value = {
      richText: [
        {
          text: "Option 2: Entrance and Exit controlled by manpower (Parking Toll: BOOTH)",
          font: {
            bold: false,
            size: 16,
            color: { argb: "FF0000" },
            name: "Arial",
          },
        },
      ],
    };
    worksheet.getCell("B14").value = {
      richText: [
        { text: "Kính gửi/To: ", font: { bold: false } },
        {
          text: dataPriceQuote?.project?.customer?.name_company.toUpperCase() ?? dataPriceQuote?.customer?.name_company.toUpperCase() ?? "",
          font: { bold: true },
        },
      ],
    };
    worksheet.getCell("B15").value = {
      richText: [
        { text: "Địa chỉ/Address: ", font: { bold: false } },
        {
          text: (
            dataPriceQuote?.project?.customer?.address_delivery ?? dataPriceQuote?.customer?.address_delivery?? "" +
            "," +
            dataPriceQuote?.project?.customer?.province_delivery?.name_province
          ).toUpperCase() ?? dataPriceQuote?.customer?.province_delivery?.name_province.toUpperCase() ?? "",
          font: { bold: true },
        },
      ],
    };
    worksheet.getCell("B16").value = {
      richText: [
        { text: "Người nhận/Receiver: ", font: { bold: false } },
        {
          text: dataPriceQuote?.project?.customer?.name_company?.toUpperCase() ?? dataPriceQuote?.customer?.name_company?.toUpperCase() ?? "",
          font: { bold: true },
        },
      ],
    };
    worksheet.getCell("B17").value = {
      richText: [
        { text: "Tel: ", font: { bold: false } },
        {
          text: dataPriceQuote?.project?.customer?.phone_number?.toUpperCase() ?? dataPriceQuote?.customer?.phone_number?.toUpperCase() ?? "",
          font: { bold: true },
        },
      ],
    };
    worksheet.getCell("B18").value = {
      richText: [
        { text: "Email: ", font: { bold: false } },
        {
          text: dataPriceQuote?.project?.customer?.phone_number ?? dataPriceQuote?.customer?.phone_number ?? "",
          font: { bold: true },
        },
      ],
    };

    worksheet.getCell("G14").value = {
      richText: [
        { text: "Số báo giá/Quotation: ", font: { bold: false } },
        {
          text: dataPriceQuote.price_quote_id.toUpperCase(),
          font: { bold: true },
        },
      ],
    };

    // Thêm các nội dung khác
    worksheet.getCell("G15").value = {
      richText: [
        { text: "Ngày báo giá/Date: ", font: { bold: false } },
        {
          text:
            new Date(dataPriceQuote.created_at).toLocaleDateString("vi-VN") ??
            "N/A",
          font: { bold: true },
        },
      ],
    };
    worksheet.getCell("G16").value = {
      richText: [
        { text: "Người báo giá/ Quoted by: ", font: { bold: false } },
        {
          text: (
            dataPriceQuote.user_support?.first_name ??
            "" + " " + dataPriceQuote.user_support?.last_name ??
            ""
          ).toUpperCase(),
          font: { bold: true },
        },
      ],
    };
    worksheet.getCell("G17").value = {
      richText: [
        { text: "Phone: ", font: { bold: false } },
        { text: "+84.906.862.780", font: { bold: true } },
      ],
    };
    worksheet.getCell("G18").value = {
      richText: [
        { text: "Email: ", font: { bold: false } },
        { text: "contact@sparking.com.vn", font: { bold: true } },
      ],
    };

    worksheet.getCell("B24").value = {
      richText: [
        { text: "STT\n", font: { bold: true, name: "Arial", size: 12 } },
        { text: "No.", font: { bold: false, name: "Arial", size: 12 } },
      ],
    };

    worksheet.getCell("C24").value = {
      richText: [
        { text: "Mô tả\n", font: { bold: true, name: "Arial", size: 12 } },
        { text: "Description", font: { bold: false, name: "Arial", size: 12 } },
      ],
    };
    worksheet.getCell("D24").value = {
      richText: [
        { text: "Diễn giải\n", font: { bold: true, name: "Arial", size: 12 } },
        { text: "Note", font: { bold: false, name: "Arial", size: 12 } },
      ],
    };

    worksheet.getCell("E24").value = {
      richText: [
        { text: "Mã hiệu\n", font: { bold: true, name: "Arial", size: 12 } },
        { text: "Code", font: { bold: false, name: "Arial", size: 12 } },
      ],
    };

    worksheet.getCell("F24").value = {
      richText: [
        {
          text: "Thương hiệu/ Xuất xứ\n",
          font: { bold: true, name: "Arial", size: 12 },
        },
        {
          text: "Brand/ Original",
          font: { bold: false, name: "Arial", size: 12 },
        },
      ],
    };

    worksheet.getCell("G24").value = {
      richText: [
        { text: "ĐVT\n", font: { bold: true, name: "Arial", size: 12 } },
        { text: "Unit", font: { bold: false, name: "Arial", size: 12 } },
      ],
    };

    worksheet.getCell("H24").value = {
      richText: [
        { text: "Số lượng\n", font: { bold: true, name: "Arial", size: 12 } },
        { text: "Qty.", font: { bold: false, name: "Arial", size: 12 } },
      ],
    };

    worksheet.getCell("I24").value = {
      richText: [
        { text: "Đơn giá\n", font: { bold: true, name: "Arial", size: 12 } },
        {
          text: "Unit Price\n",
          font: { bold: false, name: "Arial", size: 12 },
        },
        { text: "(VND)", font: { bold: false, name: "Arial", size: 12 } },
      ],
    };

    worksheet.getCell("J24").value = {
      richText: [
        { text: "Thành tiền\n", font: { bold: true, name: "Arial", size: 12 } },
        {
          text: "Amount Price",
          font: { bold: false, name: "Arial", size: 12 },
        },
      ],
    };
    worksheet.getCell("M24").value = {
      richText: [{ text: "MUA", font: { bold: true } }],
    };

    worksheet.getCell("M24").border = {
      top: { style: "dashed" },
      left: { style: "dashed" },
      bottom: { style: "dashed" },
      right: { style: "dashed" },
    };

    worksheet.getCell("N24").value = {
      richText: [{ text: "TỶ LỆ", font: { bold: true } }],
    };

    worksheet.getCell("N24").border = {
      top: { style: "dashed" },
      left: { style: "dashed" },
      bottom: { style: "dashed" },
      right: { style: "dashed" },
    };

    worksheet.getCell("O24").value = {
      richText: [
        { text: "TỔNG MUA", font: { bold: true, color: { argb: "FF0000" } } },
      ],
    };
    worksheet.getCell("O24").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFCC" },
    };
    worksheet.getCell("O24").border = {
      top: { style: "dashed" },
      left: { style: "dashed" },
      bottom: { style: "dashed" },
      right: { style: "dashed" },
    };

    worksheet.getCell("P24").value = {
      richText: [{ text: "BÁN", font: { bold: true } }],
    };

    worksheet.getCell("P24").border = {
      top: { style: "dashed" },
      left: { style: "dashed" },
      bottom: { style: "dashed" },
      right: { style: "dashed" },
    };

    const fillDataList = () => {
      let row = 25;
      let count = 1;
      const listCategory: number[] = [];
      listPriceQuote.forEach((dt) => {
        listCategory.push(row);
        worksheet.getCell(`B${row}`).value = {
          richText: [
            {
              text: `${dt.title.toUpperCase()}`,
              font: { bold: true, color: { argb: "FF0000" } },
            },
          ],
        };

        for (let col = 2; col <= 16; col++) {
          worksheet.getCell(row, col).alignment = {
            vertical: "middle",
          };
        }

        worksheet.getRow(row).height = (35.1 * 100) / 80;
        worksheet.getCell(`J${row}`).value = {
          formula: `SUBTOTAL(9,J${row + 1}:J${dt.list.length + row})`,
          result: 0,
        };
        worksheet.getCell(`J${row}`).font = {
          color: { argb: "FF0000" },
          bold: true,
        };

        worksheet.getCell(row, 10).numFmt = "#,##0";
        worksheet.getCell(`M${row}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F2F2F2" },
        };

        worksheet.getCell(`O${row}`).value = {
          formula: `SUBTOTAL(9,O${row + 1}:O${
            dt.list.length +
            dt.list.reduce((preValue, currValue) => {
              if (currValue?.list_detail.length > 0) {
                return currValue.list_detail.length + preValue;
              }
              return preValue;
            }, 0) +
            row
          })`,
          result: 0,
        };
        worksheet.getCell(`O${row}`).font = {
          bold: true,
        };
        worksheet.getCell(row, 15).numFmt = "#,##0";

        worksheet.getCell(`O${row}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFCC" },
        };

        worksheet.getCell(`P${row}`).numFmt = "0%";
        worksheet.getCell(`P${row}`).value = {
          formula: `(J${row}-O${row})/J${row}`, // Công thức
          result: 0, // Giá trị hiển thị ban đầu (tuỳ chọn)
        };
        worksheet.getCell(`P${row}`).font = {
          color: { argb: "FF0000" },
          bold: true,
        };
        worksheet.getCell(`P${row}`).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "CAEDFB" },
        };

        worksheet.getCell(`J${row}`).border = {
          right: { style: "thin" },
        };

        for (let col = 1; col <= 11; col++) {
          const cell = worksheet.getCell(row, col);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CAEDFB" },
          };
        }
        for (let col = 13; col < 17; col++) {
          worksheet.getCell(row, col).border = {
            top: { style: "dashed" },
            left: { style: "dashed" },
            bottom: { style: "dashed" },
            right: { style: "dashed" },
          };
        }

        worksheet.getCell(`B${row}`).border = {
          left: { style: "thin" },
        };
        row++;
        if (dt.type) {
          dt.list.forEach((dtt, iProduct) => {
            // let count = 1;
            worksheet.getRow(row).height = calculateRowHeight(
              dtt.description,
              30,
              18
            );
            worksheet.getCell(row, 2).value = iProduct + 1;
            worksheet.getCell(row, 2).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            for (let col = 2; col < 11; col++) {
              worksheet.getCell(row, col).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            }
            worksheet.getCell(row, 3).value = dtt.name;
            worksheet.getCell(row, 3).alignment = {
              vertical: "middle",
              wrapText: true,
            };
            worksheet.getCell(row, 4).value = dtt.description;
            worksheet.getCell(row, 4).alignment = {
              vertical: "middle",
              wrapText: true,
            };
            worksheet.getCell(row, 5).value = dtt.refresh_code;
            worksheet.getCell(row, 5).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 6).value = dtt.brand;
            worksheet.getCell(row, 6).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 7).value = dtt.unit;
            worksheet.getCell(row, 7).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 8).value = dtt.quantity;
            worksheet.getCell(row, 8).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 9).value = {
              formula: `ROUNDUP(P${row},-4)`,
            };
            worksheet.getCell(row, 9).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };
            worksheet.getCell(row, 9).numFmt = "#,##0";
            worksheet.getCell(row, 10).numFmt = "#,##0";
            worksheet.getCell(row, 15).numFmt = "#,##0";
            worksheet.getCell(row, 16).numFmt = "#,##0";

            worksheet.getCell(row, 10).value = {
              formula: `H${row}*I${row}`,
            };
            worksheet.getCell(row, 10).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };

            worksheet.getCell(row, 13).value = {
              formula: `O${row}`,
            };
            worksheet.getCell(row, 13).numFmt = "#,##0";
            worksheet.getCell(row, 13).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 13).font = { color: { argb: "FF0000" } };
            worksheet.getCell(row, 13).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "F2F2F2" },
            };

            worksheet.getCell(row, 14).value = dtt.profit / 100;
            worksheet.getCell(row, 14).numFmt = "0%";
            worksheet.getCell(row, 14).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };

            worksheet.getCell(row, 15).value = {
              formula: `SUBTOTAL(9,O${row + 1}:O${
                dtt.list_detail.length + row
              })`,
            };

            worksheet.getCell(row, 15).font = {
              bold: true,
            };
            worksheet.getCell(row, 15).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };
            worksheet.getCell(row, 15).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFCC" },
            };

            worksheet.getCell(row, 16).value = {
              formula: `M${row}*N${row}+M${row}`,
            };

            worksheet.getCell(row, 16).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };

            for (let col = 13; col < 17; col++) {
              worksheet.getCell(row, col).border = {
                top: { style: "dashed" },
                left: { style: "dashed" },
                bottom: { style: "dashed" },
                right: { style: "dashed" },
              };
            }
            row++;
            dtt.list_detail.forEach((dataDetail) => {
              const name_unit = dataUnits.find(
                (dataUnit) => dataUnit.unit_id === dataDetail.unit
              )?.name_unit;
              worksheet.getCell(row, 2).border = {
                left: { style: "thin" },
                top: { style: "dashed" },
                bottom: { style: "dashed" },
                right: { style: "dashed" },
              };
              worksheet.getCell(row, 10).border = {
                left: { style: "dashed" },
                top: { style: "dashed" },
                bottom: { style: "dashed" },
                right: { style: "thin" },
              };
              for (let col = 3; col < 10; col++) {
                worksheet.getCell(row, col).border = {
                  top: { style: "dashed" },
                  left: { style: "dashed" },
                  bottom: { style: "dashed" },
                  right: { style: "dashed" },
                };
              }

              worksheet.getCell(row, 4).value = dataDetail.description;
              worksheet.getCell(row, 4).alignment = {
                vertical: "middle",
                wrapText: true,
              };

              worksheet.getCell(row, 7).alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
              };
              worksheet.getCell(row, 8).value = dataDetail.quantity;
              worksheet.getCell(row, 8).alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
              };
              worksheet.getCell(row, 13).value = dataDetail.price;
              worksheet.getCell(row, 13).numFmt = "#,##0";
              worksheet.getCell(row, 13).alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
              };
              worksheet.getCell(row, 13).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F2F2F2" },
              };

              if (!isNaN(Number(name_unit))) {
                worksheet.getCell(row, 7).value = Number(name_unit);
                worksheet.getCell(row, 15).value = {
                  formula: `M${row}/G${row}*H${row}`,
                };
              } else {
                worksheet.getCell(row, 7).value = name_unit;
                worksheet.getCell(row, 15).value = {
                  formula: `M${row}*H${row}`,
                };
              }

              worksheet.getCell(row, 15).alignment = {
                vertical: "middle",
                horizontal: "right",
                wrapText: true,
              };
              worksheet.getCell(row, 15).numFmt = "#,##0";
              worksheet.getCell(row, 15).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFCC" },
              };
              for (let col = 13; col < 17; col++) {
                worksheet.getCell(row, col).border = {
                  top: { style: "dashed" },
                  left: { style: "dashed" },
                  bottom: { style: "dashed" },
                  right: { style: "dashed" },
                };
              }
              row++;
            });
          });
        } else {
          dt.list.forEach((dtt) => {
            worksheet.getRow(row).height = calculateRowHeight(
              dtt.description,
              30,
              18
            );
            worksheet.getCell(row, 2).value = count++;
            worksheet.getCell(row, 2).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            // worksheet.getCell(row,2).border = { top: { style: 'thin' },
            // left: { style: 'thin' },
            // bottom: { style: 'thin' },
            // right: { style: 'thin' }
            // };
            for (let col = 2; col < 11; col++) {
              worksheet.getCell(row, col).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            }
            worksheet.getCell(row, 3).value = dtt.name;
            worksheet.getCell(row, 3).alignment = {
              vertical: "middle",
              wrapText: true,
            };
            worksheet.getCell(row, 4).value = dtt.description;
            worksheet.getCell(row, 4).alignment = {
              vertical: "middle",
              wrapText: true,
            };
            worksheet.getCell(row, 5).value = dtt.refresh_code;
            worksheet.getCell(row, 5).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 6).value = dtt.brand;
            worksheet.getCell(row, 6).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 7).value = dtt.unit;
            worksheet.getCell(row, 7).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 8).value = dtt.quantity;
            worksheet.getCell(row, 8).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 9).value = {
              formula: `ROUNDUP(P${row},-4)`,
            };
            worksheet.getCell(row, 9).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };
            worksheet.getCell(row, 9).numFmt = "#,##0";
            worksheet.getCell(row, 10).numFmt = "#,##0";
            worksheet.getCell(row, 15).numFmt = "#,##0";
            worksheet.getCell(row, 16).numFmt = "#,##0";

            worksheet.getCell(row, 10).value = {
              formula: `H${row}*I${row}`,
            };
            worksheet.getCell(row, 10).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };

            worksheet.getCell(row, 13).value = dtt.price;
            worksheet.getCell(row, 13).numFmt = "#,##0";
            worksheet.getCell(row, 13).alignment = {
              vertical: "middle",
              horizontal: "center",
              wrapText: true,
            };
            worksheet.getCell(row, 13).font = { color: { argb: "FF0000" } };
            worksheet.getCell(row, 13).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "F2F2F2" },
            };

            worksheet.getCell(row, 14).value = dtt.profit / 100;
            worksheet.getCell(row, 14).numFmt = "0%";
            worksheet.getCell(row, 14).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };

            worksheet.getCell(row, 15).value = {
              formula: `M${row}*H${row}`,
            };
            worksheet.getCell(row, 15).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };
            worksheet.getCell(row, 15).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFCC" },
            };

            worksheet.getCell(row, 16).value = {
              formula: `M${row}*N${row}+M${row}`,
            };

            worksheet.getCell(row, 16).alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };

            for (let col = 13; col < 17; col++) {
              worksheet.getCell(row, col).border = {
                top: { style: "dashed" },
                left: { style: "dashed" },
                bottom: { style: "dashed" },
                right: { style: "dashed" },
              };
            }
            row++;
          });
        }
      });
      for (let col = 3; col <= 10; col++) {
        worksheet.getCell(row, col).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "61CBF3" },
        };
        if (col > 3 && col < 10) {
          worksheet.getCell(row + 4, col).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9D9D9" },
          };
        }
      }

      for (let col = 13; col <= 16; col++) {
        if (col === 15 || col === 16) {
          worksheet.getCell(row, col).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "61CBF3" },
          };
        }
        worksheet.getCell(row, col).border = {
          top: { style: "dashed" },
          left: { style: "dashed" },
          bottom: { style: "dashed" },
          right: { style: "dashed" },
        };
      }
      worksheet.getCell(row, 8).value = {
        richText: [{ text: "Amount before VAT", font: { bold: true } }],
      };

      worksheet.getRow(row).height = (48.5 * 100) / 80;

      worksheet.getCell(row, 10).value = {
        formula: `SUBTOTAL(9,J25:J${row - 1})`,
      };
      worksheet.getCell(row, 10).numFmt = "#,##0";

      worksheet.getCell(row, 10).font = { bold: true };

      worksheet.getCell(row, 15).value = {
        formula: `SUBTOTAL(9,O25:O${row - 1})`,
      };
      worksheet.getCell(row, 15).numFmt = "#,##0";

      worksheet.getCell(row, 15).font = { bold: true };
      worksheet.getRow(row).eachCell((cell) => {
        if (!cell.alignment) {
          cell.alignment = {};
        }
        cell.alignment.vertical = "middle";
      });
      worksheet.getCell(row + 1, 15).value = {
        formula: `J${row}-O${row}`,
      };
      worksheet.getCell(row + 1, 15).numFmt = "#,##0";

      worksheet.getCell(row + 2, 15).value = {
        formula: `O${row + 1}/J${row}`,
      };
      worksheet.getCell(row + 2, 15).numFmt = "0%";

      worksheet.getCell(row + 4, 4).value = {
        richText: [
          {
            text: "SUMARY",
            font: { color: { argb: "FF0000" } },
          },
        ],
      };
      listCategory.forEach((dt, i) => {
        worksheet.getCell(row + 4 + 1 + i, 4).value = {
          richText: [{ text: listPriceQuote[i].title, font: { bold: true } }],
        };

        worksheet.getCell(row + 4 + 1 + i, 9).value = {
          formula: `J${dt}`,
        };

        worksheet.getCell(row + 4 + 1 + i, 9).numFmt = "#,##0";
      });

      let rowPolicy = row + 8 + listCategory.length;

      listPolicy.forEach((dt) => {
        worksheet.getCell(rowPolicy, 2).value = {
          richText: [{ text: dt.title + ":", font: { bold: true } }],
        };
        rowPolicy++;
        dt.list.forEach((dtt) => {
          worksheet.getCell(rowPolicy, 3).value = {
            richText: [{ text: dtt, font: { bold: false } }],
          };
          rowPolicy++;
        });
      });
    };

    fillDataList();
    for (let row = 13; row <= 19; row++) {
      for (let col = 1; col <= 11; col++) {
        const cell = worksheet.getCell(row, col);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F2F2F2" },
        };
      }
    }
    const columns = [
      2.4, 5.2, 21.1, 47.1, 18.9, 15.9, 10.6, 9.9, 14.5, 15.9, 2.7, 2.6, 13.4,
      7.3, 16.8, 15.9,
    ];
    for (let col = 1; col <= 16; col++) {
      const cell = worksheet.getColumn(col);
      cell.width = (columns[col - 1] * 100) / 98;
      if (col > 12) {
        const cell2 = worksheet.getCell(24, col);
        cell2.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
      }
      if (col < 12) {
        const cell3 = worksheet.getCell(24, col);
        if (col > 1 && col < 11) {
          cell3.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
          cell3.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
        cell3.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" },
        };
      }
    }
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell((cell) => {
        if (!cell.font) {
          cell.font = {};
        }
        cell.font.name = "Arial";
        cell.font.size = 12;
      });
    });
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, dataPriceQuote.price_quote_id + ".xlsx");
    } catch (err) {
      console.log(err);
    }
  };
  const [dataFilter, setDataFilter] = useState<
    IGetPriceQuote[] | [] | undefined
  >([]);
  const columns: TableColumnsType<IGetPriceQuote> = [
    {
      title: "Báo giá#",
      className: "text-xs",
      dataIndex: "price_quote_id",
      render: (value: string, red, index) => (
        <div className="flex flex-col gap-1 ">
          <strong>
            #{index + 1}.{`${value.slice(0, 10)}...`}
          </strong>
          <div className="flex gap-2">
            <Button
              type="text"
              ghost
              className="text-xs text-blue-600"
              onClick={() => {
                handleExport(value);
              }}
            >
              Xuất
            </Button>
            {isAuthorized && <ModalUpdatePriceQuote ID={value} />}
          </div>
        </div>
      ),
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.price_quote_id.localeCompare(b.price_quote_id),
    },

    {
      title: "Dự án",
      className: "text-xs",
      dataIndex: ["project", "name"],
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        (a.project.name ?? "").localeCompare(b.project.name ?? ""),
      render: (value) => {
        return `${value}`;
      },
    },
    {
      title: "Ngày báo giá",
      className: "text-xs",
      dataIndex: "date_start",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.date_start.toString().localeCompare(b.date_start.toString()),
    },
    {
      title: "Ngày hết hạn",
      className: "text-xs",
      dataIndex: "date_expired",
      render: (value?: Date) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.date_expired.toString().localeCompare(b.date_expired.toString()),
    },
    {
      title: "Mã tham chiếu",
      className: "text-xs",
      dataIndex: "reference_code",
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.reference_code.localeCompare(b.reference_code),
    },
    {
      title: "Tình trạng",
      className: "text-xs",
      dataIndex: "status",
      render: (value: string) => (
        <>
          <Tag
            color={
              value === "draff"
                ? "gray"
                : value === "send"
                ? "lightblue"
                : value === "open"
                ? "blue"
                : value === "edit"
                ? "yellow"
                : value === "refuse"
                ? "red"
                : value === "accept"
                ? "green"
                : ""
            }
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}{" "}
            {/* Chuyển chữ cái đầu thành viết hoa */}
          </Tag>
        </>
      ),
      sorter: (a: IGetPriceQuote, b: IGetPriceQuote) =>
        a.status.localeCompare(b.status),
    },
  ];

  const handleSearchFilter = (value: string) => {
    setDataFilter(
      dataSources?.filter((dt) => {
        return String(
          dt.created_at +
            " " +
            dt.date_expired +
            " " +
            dt.date_start +
            " " +
            dt.project.name +
            " " +
            dt.price_quote_id +
            " " +
            dt.user_support.last_name +
            " " +
            dt.status
        )
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  const handleExport = async (id: string) => {
    const dataRes = await priceQuoteService.getExportPriceQuote(id);
    if (dataRes.statusCode === 200) {
      await createExcelPriceQuote(dataRes.data);
    }
  };

  const { postdata } = usePostData();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const [listSelect, setListSelect] = useState<string[]>([]);
  const rowSelection: TableRowSelection<IGetPriceQuote> = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: IGetPriceQuote[]
    ) => {
      setListSelect(selectedRows.map((dt) => dt.price_quote_id ?? ""));
    },
  };
  const handleDelete = async () => {
    const statusCode = await postdata(() =>
      priceQuoteService.deletePriceQuotes(listSelect)
    );
    if (statusCode === 200) {
      dispatch(fetchPriceQuotes({ customer: customerID as string }));
      setListSelect([]);
      setIsModalConfirmDelete(false);
    }
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get("id");
    if (dataSources && id) {
      handleSearchFilter(id);
    } else {
      setDataFilter(
        dataSources.map((dt, index) => {
          return { ...dt, key: index };
        })
      );
    }
  }, [dataSources, searchParams]);
  return (
    <div className="">
      <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
        <div className="flex items-center gap-1">
          <Select
            defaultValue={pageLimit}
            style={{ width: 83 }}
            onChange={(e) => setPageLimit(e)}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
              { value: 100, label: 100 },
              { value: 500, label: 500 },
              { value: 1000, label: 1000 },
              { value: 100000000, label: "Tất cả" },
            ]}
          />
          <Button hidden={!(listSelect.length > 0)}>Xuất ra</Button>
          <Button
            onClick={() => {
              setIsModalConfirmDelete(true);
            }}
            danger
            hidden={!(listSelect.length > 0)}
            className="text-xl"
            icon={<MdDeleteForever />}
          />
          <Modal
            open={isModalConfirmDelete}
            title={"Xóa dữ liệu"}
            onOk={handleDelete}
            onCancel={() => {
              setIsModalConfirmDelete(false);
            }}
          >
            Bạn có chắc chắn muốn xóa không ?
          </Modal>
        </div>
        <div className="flex items-center">
          <Search
            onChange={(e) => {
              handleSearchFilter(e.target.value);
            }}
            placeholder="Tìm kiếm"
            style={{ width: 200 }}
          />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <div className="min-w-fit">
          <Table<IGetPriceQuote>
            columns={columns}
            // className="text-xs"
            rowSelection={rowSelection}
            dataSource={dataFilter}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: pageLimit, // Items per page
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </div>
      </div>
    </div>
  );
}
