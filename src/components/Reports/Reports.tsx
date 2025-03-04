import { Button } from "antd";
import React, { useEffect, useState } from "react";
import * as ExcelJS from "exceljs";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { fetchTypeActivities } from "@/redux/store/slices/activitySlices/type_activity.slice";
import { fetchGroupCustomer } from "@/redux/store/slices/customerSlices/get_all_group.slice";
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide";
import { fetchClassifyType } from "@/redux/store/slices/productSlices/get_classify.slice";
import { CalculateRowHeight, getColumnName } from "@/utils/ExcelCustomer";
import productService from "@/services/productService";
import { ITypeProduct } from "@/models/productInterface";
import contractService from "@/services/contractService.";
import { IGetTypeContract } from "@/models/contractInterface";
import { fetchPaymentTotal } from "@/redux/store/slices/contractSlices/payment_total.slide";
// type Props = {}

export default function Reports() {
  const [year, setYear] = useState<number>();
  const [dataExpense, setDataExpense] = useState<ITypeProduct[]>([]);
  const [dataTypeContracts, setDataTypeContracts] = useState<
    IGetTypeContract[]
  >([]);
  const [statusExport, setStatusExport] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (year) {
      setStatusExport(true);
    }
  }, [year, dispatch]);
  const { datas: dataTypeActivity } = useSelector(
    (state: RootState) => state.get_type_activities
  );
  const { datas: dataVats } = useSelector(
    (state: RootState) => state.vat_system
  );
  const { datas: dataPayments } = useSelector(
    (state: RootState) => state.get_payment_total
  );
  const { datas: dataGroupCustomer } = useSelector(
    (state: RootState) => state.get_type_activities
  );
  const { datas: dataContracts } = useSelector(
    (state: RootState) => state.get_contracts
  );
  const { datas: dataClassify } = useSelector(
    (state: RootState) => state.get_classify_type
  );

  useEffect(() => {
    console.log(dataTypeContracts, dataExpense);
    if (
      dataClassify.length > 0 &&
      dataContracts.length > 0 &&
      dataGroupCustomer.length > 0 &&
      dataTypeActivity.length > 0 &&
      dataPayments.length > 0 &&
      dataExpense.length > 0 &&
      dataTypeContracts.length > 0 &&
      statusExport &&
      year
    ) {
      createExcelPriceQuote();
    }
  }, [
    dataClassify,
    dataContracts,
    dataGroupCustomer,
    dataTypeActivity,
    dataPayments,
    dataExpense,
    dataTypeContracts,
    statusExport,
    year,
  ]);

  const handleExport = async (yearNew: number) => {
    dispatch(fetchTypeActivities());
    dispatch(fetchGroupCustomer());
    dispatch(fetchContracts({ year: yearNew }));
    dispatch(fetchClassifyType());
    dispatch(fetchPaymentTotal({}));
    const res = await productService.getNameClassifies();
    const res2 = await contractService.getTypeFullContracts();
    if (res && res2) {
      setDataExpense(
        res.statusCode === 200 ? (res.data.types_product as ITypeProduct[]) : []
      );
      setDataTypeContracts(
        res2.statusCode === 200 ? (res2.data as IGetTypeContract[]) : []
      );
    }

    if (year) {
      setStatusExport(true);
    } else {
      setYear(yearNew);
    }
  };

  const createExcelPriceQuote = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheetCSDL = workbook.addWorksheet("CSDL");
    const sheetSumExpense = workbook.addWorksheet("SUM CHI PHÍ");
    const sheetExpense = workbook.addWorksheet("CHI PHÍ");
    const sheetRevenue = workbook.addWorksheet("DOANH THU");

    const FillSheetCSDL = () => {
      const dataWidth = [6.44, 25, 34, 22.44, 21.67, 33, 33];
      let row = 2;
      const column = 4;
      dataWidth.forEach((dt, index) => {
        sheetCSDL.getColumn(column + index).width = (dt * 100) / 90;
      });
      dataClassify.forEach((dt) => {
        sheetCSDL.getCell(row, column).value = "TT";
        sheetCSDL.getCell(row, column + 1).value =
          "Phân loại " + dt.description;
        sheetCSDL.getCell(row, column + 2).value = "Diễn giải ";
        for (let i = 0; i < 3; i++) {
          sheetCSDL.getCell(row, column + i).font = {
            bold: true,
          };
          sheetCSDL.getCell(row, column + i).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        }
        row++;
        dt.types_product?.forEach((dtt, iType) => {
          sheetCSDL.getCell(row, column).value = iType + 1;
          sheetCSDL.getCell(row, column).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
          sheetCSDL.getCell(row, column + 1).value = dtt.name;
          sheetCSDL.getCell(row, column + 2).value = dtt.description;
          row++;
        });
        row++;
      });
      sheetCSDL.getCell(row, column).value = "TT";
      sheetCSDL.getCell(row, column + 1).value = "Mã công trình/đơn hàng";
      sheetCSDL.getCell(row, column + 2).value = "Số hợp đồng/đơn hàng";
      sheetCSDL.getCell(row, column + 3).value = "Dự án";
      sheetCSDL.getCell(row, column + 4).value = "Phân loại dự án";
      sheetCSDL.getCell(row, column + 5).value = "Phân loại chi phí nhân công";
      sheetCSDL.getCell(row, column + 6).value = "Phân loại khách hàng";
      for (let i = 0; i < 7; i++) {
        sheetCSDL.getCell(row, column + i).font = {
          bold: true,
        };
        sheetCSDL.getCell(row, column + i).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      }
      row++;
      let rowExpense = row;
      let rowGroup = row;
      dataContracts.forEach((dt, index) => {
        sheetCSDL.getCell(row, column).value = index + 1;
        sheetCSDL.getCell(row, column).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        sheetCSDL.getCell(row, column + 1).value = dt.name_contract;
        sheetCSDL.getCell(row, column + 2).value = dt.code_contract;
        sheetCSDL.getCell(row, column + 3).value = dt.project?.name;
        sheetCSDL.getCell(row, column + 4).value = dt.project?.type?.name_type;
        row++;
      });
      dataTypeActivity.forEach((dt) => {
        sheetCSDL.getCell(rowExpense, column + 5).value = dt.name;
        rowExpense++;
      });
      dataGroupCustomer.forEach((dt) => {
        sheetCSDL.getCell(rowGroup, column + 6).value = dt.name;
        rowGroup++;
      });
      sheetCSDL.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell((cell) => {
          if (!cell.font) {
            cell.font = {};
          }
          cell.font.name = "Aptos Narrow";
        });
      });
    };

    const FillSheetExpense = () => {
      const dataWidth = [
        8, 0.81, 0.81, 0.81, 9.44, 19.67, 14.67, 43.67, 14.67, 17, 19.67, 18.44,
        14.22,
      ];
      sheetExpense.getCell(1, 10).value = {
        formula: `SUBTOTAL(9,J${3}:J${2 + dataPayments.length})`,
      };
      sheetExpense.getCell(1, 10).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
      let row = 2;
      const column = 5;
      dataWidth.forEach((dt, index) => {
        sheetExpense.getColumn(index + 1).width = (dt * 100) / 90;
      });
      sheetExpense.getCell(row, column).value = "TT";
      sheetExpense.getCell(row, column + 1).value = "Mã công trình/đơn hàng";
      sheetExpense.getCell(row, column + 2).value = "Ngày ký";
      sheetExpense.getCell(row, column + 3).value = "Nội dung";
      sheetExpense.getCell(row, column + 4).value = "Ngày hóa đơn";
      sheetExpense.getCell(row, column + 5).value = "Giá trị";
      sheetExpense.getCell(row, column + 6).value = "Loại chi phí";
      sheetExpense.getCell(row, column + 7).value = "NCC";
      sheetExpense.getCell(row, column + 8).value = "Ghi chú";
      sheetExpense.getRow(row).height = 30;
      for (let i = 0; i < 9; i++) {
        sheetExpense.getCell(row, column + i).font = {
          bold: true,
        };
        sheetExpense.getCell(row, column + i).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        sheetExpense.getCell(row, column + i).border = {
          top: { style: "dotted" },
          right: { style: "dotted" },
          left: { style: "dotted" },
          bottom: { style: "dotted" },
        };
      }
      row++;
      dataPayments.forEach((dt, index) => {
        sheetExpense.getRow(row).height = CalculateRowHeight(
          dt.description,
          15,
          30
        );
        sheetExpense.getCell(row, column).value = index + 1;
        sheetExpense.getCell(row, column).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        sheetExpense.getCell(row, column + 1).value =
          dt.contract?.name_contract;
        sheetExpense.getCell(row, column + 1).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        sheetExpense.getCell(row, column + 2).value = new Date(
          dt?.contract?.date_start ?? ""
        ).toLocaleDateString("vi-VN");
        sheetExpense.getCell(row, column + 2).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        sheetExpense.getCell(row, column + 3).value = dt.description;
        sheetExpense.getCell(row, column + 3).alignment = {
          vertical: "middle",
        };
        sheetExpense.getCell(row, column + 4).value = new Date(
          dt?.created_at ?? ""
        ).toLocaleDateString("vi-VN");
        sheetExpense.getCell(row, column + 4).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        sheetExpense.getCell(row, column + 5).value = dt?.price;
        sheetExpense.getCell(row, column + 5).numFmt = "#,##0";
        sheetExpense.getCell(row, column + 5).alignment = {
          horizontal: "right",
          vertical: "middle",
        };

        sheetExpense.getCell(row, column + 6).value = dt?.type_product?.name;
        sheetExpense.getCell(row, column + 6).alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        sheetExpense.getCell(row, column + 7).value = dt?.supplier?.name;
        sheetExpense.getCell(row, column + 7).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        for (let i = 0; i < 9; i++) {
          sheetExpense.getCell(row, column + i).border = {
            top: { style: "dotted" },
            right: { style: "dotted" },
            left: { style: "dotted" },
            bottom: { style: "dotted" },
          };
        }
        row++;
      });
      sheetExpense.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell((cell) => {
          if (!cell.font) {
            cell.font = {};
          }
          cell.font.name = "Aptos Narrow";
        });
      });
    };

    const FillSheetSumExpense = async () => {
      const dataWidth = [2.67, 3.67, 5.44, 15.44, 17.44, 21.56];

      let row = 2;
      const column = 3;
      sheetSumExpense.getRow(2).height = 28.8;
      dataWidth.forEach((dt, index) => {
        sheetSumExpense.getColumn(1 + index).width = (dt * 100) / 80;
        if (index > 1) {
          sheetSumExpense.getCell(row, index + 1).border = {
            top: { style: "dotted" },
            bottom: { style: "dotted" },
            left: { style: "dotted" },
            right: { style: "dotted" },
          };
        }
      });
      sheetSumExpense.getCell(row, column).value = "TT";
      sheetSumExpense.getRow(row).height = (28.8 * 100) / 80;
      sheetSumExpense.getCell(row, column).font = {
        bold: true,
      };
      sheetSumExpense.getCell(row, column).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      sheetSumExpense.getCell(
        row,
        column + 1
      ).value = `Mã công trình/đơn\n hàng`;

      sheetSumExpense.getCell(row, column + 1).font = {
        bold: true,
      };
      sheetSumExpense.getCell(row, column + 1).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      sheetSumExpense.getCell(
        row,
        column + 2
      ).value = `Tổng chi phí gồm\n hạch toán nhân công`;
      sheetSumExpense.getCell(row, column + 2).font = {
        bold: true,
      };
      sheetSumExpense.getCell(row, column + 2).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      sheetSumExpense.getCell(
        row,
        column + 3
      ).value = `Tổng chi phí chưa bao gồm\n hạch toán nhân công`;
      sheetSumExpense.getCell(row, column + 3).font = {
        bold: true,
      };
      sheetSumExpense.getCell(row, column + 3).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      let vtLabor = 0;
      dataExpense.forEach((dt, index) => {
        sheetSumExpense.getColumn(column + index + 4).width = 13.44;
        sheetSumExpense.getCell(row, column + index + 4).value = dt.name;
        if (dt.name_tag === "labor") {
          vtLabor = column + index + 4;
        }
        sheetSumExpense.getCell(row, column + index + 4).font = {
          bold: true,
        };
        sheetSumExpense.getCell(row, column + index + 4).alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        sheetSumExpense.getCell(row, column + index + 4).border = {
          top: { style: "dotted" },
          right: { style: "dotted" },
          left: { style: "dotted" },
          bottom: { style: "dotted" },
        };
      });
      row++;
      dataTypeContracts.forEach((dt) => {
        sheetSumExpense.getCell(row, column).value = dt.name_type;
        if (!sheetSumExpense.getCell(row, column).font) {
          sheetSumExpense.getCell(row, column).font = {};
        }
        sheetSumExpense.getCell(row, column).font.color = { argb: "275317" };
        sheetSumExpense.getCell(row, column).font.bold = true;
        sheetSumExpense.getCell(row, column).alignment = {
          horizontal: "left",
          vertical: "middle",
        };
        sheetSumExpense.getRow(row).height = (23 * 100) / 80;
        for (let i = 3; i <= 3 + 3 + dataExpense.length; i++) {
          sheetSumExpense.getCell(row, i).border = {
            top: { style: "dotted" },
            right: { style: "dotted" },
            left: { style: "dotted" },
            bottom: { style: "dotted" },
          };
        }
        row++;
        dt.contracts?.forEach((dtt, index) => {
          for (let i = 3; i <= 3 + 3 + dataExpense.length; i++) {
            sheetSumExpense.getCell(row, i).border = {
              top: { style: "dotted" },
              right: { style: "dotted" },
              left: { style: "dotted" },
              bottom: { style: "dotted" },
            };
          }
          sheetSumExpense.getCell(row, column).value = index + 1;
          sheetSumExpense.getCell(row, column).alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          sheetSumExpense.getCell(row, column + 1).value = dtt.name_contract;
          sheetSumExpense.getCell(row, column + 1).alignment = {
            horizontal: "left",
            vertical: "middle",
          };
          sheetSumExpense.getCell(row, column + 2).value = {
            formula: `SUM(G${row}:${
              getColumnName(column + 3 + dataExpense.length) + row
            })`,
          };
          sheetSumExpense.getCell(row, column + 2).numFmt = "#,##0";
          sheetSumExpense.getCell(row, column + 2).alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          sheetSumExpense.getCell(row, column + 3).alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          sheetSumExpense.getCell(row, column + 3).numFmt = "#,##0";
          if (vtLabor) {
            sheetSumExpense.getCell(row, column + 3).value = {
              formula: `SUM(G${row}:${
                getColumnName(column + 3 + dataExpense.length) + row
              })-${getColumnName(vtLabor) + row}`,
            };
          } else {
            sheetSumExpense.getCell(row, column + 3).value = {
              formula: `SUM(G${row}:${
                getColumnName(column + 3 + dataExpense.length) + row
              })`,
            };
          }
          dataExpense.forEach((dttt, iType) => {
            sheetSumExpense.getCell(row, column + 4 + iType).value = {
              formula: `SUMIFS('CHI PHÍ'!$J$3:$J$${
                dataPayments.length + 2
              },'CHI PHÍ'!$F$3:$F$${
                dataPayments.length + 2
              },'SUM CHI PHÍ'!D${row},'CHI PHÍ'!$K$3:$K$${
                dataPayments.length + 2
              },'SUM CHI PHÍ'!$${getColumnName(column + 4 + iType)}$2)`,
            };
            sheetSumExpense.getCell(row, column + 4 + iType).numFmt = "#,##0";
            sheetSumExpense.getCell(row, column + 4 + iType).alignment = {
              horizontal: "right",
              vertical: "middle",
            };
          });
          sheetSumExpense.getRow(row).height = (23 * 100) / 80;
          row++;
        });
      });
      for (let i = 1; i < row; i++) {
        if (i > 1) {
          sheetSumExpense.getCell(i, 5).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F6FAC8" },
          };
          sheetSumExpense.getCell(i, 6).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEEF4" },
          };
        }
        if (!sheetSumExpense.getCell(i, 5).font) {
          sheetSumExpense.getCell(i, 5).font = {};
        }
        sheetSumExpense.getCell(i, 5).font.color = { argb: "275317" };
        if (!sheetSumExpense.getCell(i, 6).font) {
          sheetSumExpense.getCell(i, 6).font = {};
        }
        sheetSumExpense.getCell(i, 6).font.color = { argb: "275317" };
      }
      sheetSumExpense.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell((cell) => {
          if (!cell.font) {
            cell.font = {};
          }
          cell.font.name = "Aptos Narrow";
        });
      });
    };

    const FillSheetRevenue = async () => {
      const paymentExport = dataPayments.filter(
        (dt) =>
          dt.type === "export" &&
          dt.type_product.classify_type.name !== "expense"
      );
      const dataWidth = [
        6.44, 5, 13.44, 13.44, 15.78, 21.78, 18, 30.44, 31, 23, 45.22, 17,
        16.22, 17.11, 15, 10,
      ];
      dataWidth.forEach((dt, index) => {
        sheetRevenue.getColumn(index + 1).width = (dt * 100) / 80;
      });
      const dataClassifyEx = dataClassify.filter((dt) => dt.name !== "expense");
      const vtRow =
        dataClassifyEx.reduce((preValue, currValue) => {
          return preValue + (currValue.types_product?.length ?? 0);
        }, 0) +
        dataClassifyEx.length +
        2;
      let row = 1;
      dataClassifyEx.forEach((dt) => {
        sheetRevenue.getCell(row, 9).value = (
          "Doanh thu " + dt.description
        ).toUpperCase();
        sheetRevenue.getRow(row).height = (36 * 100) / 80;
        sheetRevenue.getCell(row, 9).alignment = {
          vertical: "middle",
        };
        sheetRevenue.getCell(row, 9).font = {
          size: 12,
        };
        if (dt.types_product?.length ?? 0 > 0) {
          sheetRevenue.getCell(row, 10).value = {
            formula: `SUBTOTAL(9,L${row + 1}:L${
              row + (dt.types_product?.length ?? 1)
            })`,
          };
        }

        sheetRevenue.getCell(row, 9).font = {
          color: { argb: "FF0000" },
        };
        sheetRevenue.getCell(row, 10).font = {
          bold: true,
        };
        sheetRevenue.getCell(row, 9).alignment = {
          horizontal: "left",
          vertical: "middle",
        };
        sheetRevenue.getCell(row, 10).alignment = {
          horizontal: "right",
          vertical: "middle",
        };
        sheetRevenue.getCell(row, 9).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" },
        };
        sheetRevenue.getCell(row, 10).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" },
        };
        row++;
        dt.types_product?.forEach((dtt) => {
          sheetRevenue.getRow(row).height = (20 * 100) / 80;
          sheetRevenue.getCell(row, 9).value = dtt.name;
          sheetRevenue.getCell(row, 9).alignment = {
            horizontal: "left",
            vertical: "middle",
          };
          sheetRevenue.getCell(row, 10).value = {
            formula: `SUMIFS($J$${vtRow + 3}:$J$${
              vtRow + 2 + paymentExport.length
            },$L$${vtRow + 3}:$L$${vtRow + 2 + paymentExport.length},$L$${
              vtRow + 3
            },$I$${vtRow + 3}:$I$${vtRow + 2 + paymentExport.length},I${row})`,
          };
          sheetRevenue.getCell(row, 10).alignment = {
            horizontal: "right",
            vertical: "middle",
          };
          row++;
        });
      });
      sheetRevenue.getRow(row).height = (25.2 * 100) / 80;
      sheetRevenue.getCell(row, 9).value = "TỔNG DOANH THU";
      sheetRevenue.getCell(row, 9).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      sheetRevenue.getCell(row, 9).fill = {
        pattern: "solid",
        type: "pattern",
        fgColor: {
          argb: "FBE2D5",
        },
      };

      sheetRevenue.getCell(row, 10).value = {
        formula: `SUBTOTAL(9,L1:L${row - 1})`,
      };
      sheetRevenue.getCell(row, 10).alignment = {
        horizontal: "right",
        vertical: "middle",
      };
      sheetRevenue.getCell(row, 10).font = {
        size: 15,
        color: { argb: "FF0000" },
      };
      sheetRevenue.getCell(row, 10).fill = {
        pattern: "solid",
        type: "pattern",
        fgColor: {
          argb: "FBE2D5",
        },
      };
      row++;
      row++;
      sheetRevenue.getRow(row).height = (57 * 100) / 80;
      sheetRevenue.getCell(row, 2).value = "TT";
      sheetRevenue.getCell(row, 3).value = "THỜI GIAN";
      sheetRevenue.getCell(row, 4).value = "MÃ";
      sheetRevenue.getCell(row, 5).value = "LOẠI CÔNG TRÌNH";
      sheetRevenue.getCell(row, 6).value = "TÊN CÔNG TRÌNH";
      sheetRevenue.getCell(row, 7).value = "PHÂN LOẠI KHÁCH HÀNG";
      sheetRevenue.getCell(row, 8).value = "SÔ CHỨNG TỪ";
      sheetRevenue.getCell(row, 9).value = "SẢN PHẨM DỊCH VỤ";
      sheetRevenue.getCell(row, 10).value = {
        richText: [
          { text: "Doanh thu\n", font: { bold: true } },
          { text: "(chưa VAT)" },
        ],
      };
      sheetRevenue.getCell(row, 10).alignment = {
        wrapText: true,
      };
      sheetRevenue.getCell(row, 11).value = "MÔ TẢ";
      sheetRevenue.getCell(row, 12).value = "Phân loại";
      sheetRevenue.getCell(row, 13).value = {
        richText: [
          { text: "Doanh thu\n", font: { bold: true } },
          { text: "(Gồm VAT)" },
        ],
      };
      sheetRevenue.getCell(row, 14).value = "GIÁ VỐN\n MUA HÀNG";
      sheetRevenue.getCell(row, 15).value = "LỢI NHUẬN GỘP";
      sheetRevenue.getCell(row, 16).value = "Tỉ lệ lợi nhuận %";
      for (let i = 2; i < 17; i++) {
        sheetRevenue.getCell(row, i).alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        if (i < 16) {
          sheetRevenue.getCell(row, i).font = {
            bold: true,
            size: 12,
          };
          sheetRevenue.getCell(row, i).border = {
            top: { style: "dotted" },
            left: { style: "dotted" },
            right: { style: "dotted" },
            bottom: { style: "dotted" },
          };
          sheetRevenue.getCell(row + 1, i).alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          sheetRevenue.getCell(row + 1, i).font = {
            bold: true,
          };
          sheetRevenue.getCell(row + 1, i).border = {
            top: { style: "dotted" },
            left: { style: "dotted" },
            right: { style: "dotted" },
            bottom: { style: "dotted" },
          };
        }
        sheetRevenue.getCell(row, i).fill = {
          pattern: "solid",
          type: "pattern",
          fgColor: {
            argb: i < 14 ? "C0E6F5" : "F6FAC8",
          },
        };
        sheetRevenue.getCell(row + 1, i).fill = {
          pattern: "solid",
          type: "pattern",
          fgColor: {
            argb: "DAE9F8",
          },
        };
      }
      row++;
      sheetRevenue.getCell(row, 10).value = {
        formula: `SUBTOTAL(9,J${row + 1}:J${row + paymentExport.length})`,
      };
      sheetRevenue.getCell(row, 13).value = {
        formula: `SUBTOTAL(9,M${row + 1}:M${row + paymentExport.length})`,
      };
      sheetRevenue.getCell(row, 14).value = {
        formula: `SUBTOTAL(9,N${row + 1}:N${row + paymentExport.length})`,
      };
      sheetRevenue.getCell(row, 15).value = {
        formula: `SUBTOTAL(9,O${row + 1}:O${row + paymentExport.length})`,
      };
      for (let i = 10; i < 17; i++) {
        sheetRevenue.getCell(row, i).numFmt = "#,##0";
        if (i < 16) {
          sheetRevenue.getCell(row, i).font = {
            color: { argb: "FF0000" },
            bold: true,
            size: 12,
          };
          sheetRevenue.getCell(row, i).alignment = {
            horizontal: "right",
            vertical: "middle",
          };
        } else {
          sheetRevenue.getCell(row, i).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        }
      }
      sheetRevenue.getCell(row, 16).value = {
        formula: `O${row}/N${row}`,
      };
      sheetRevenue.getRow(row).height = (36.5 * 100) / 80;
      row++;
      paymentExport.forEach((dt, index) => {
        sheetRevenue.getRow(row).height = (33.6 * 100) / 80;
        sheetRevenue.getCell(row, 2).value = index + 1;
        sheetRevenue.getCell(row, 3).value = new Date(
          dt?.created_at ?? ""
        ).toLocaleDateString("vi-VN");
        sheetRevenue.getCell(row, 4).value = dt.contract?.name_contract;
        sheetRevenue.getCell(row, 5).value =
          dt.contract?.project?.type?.name_type;
        sheetRevenue.getCell(row, 6).value = dt.contract?.project?.name;
        sheetRevenue.getCell(row, 7).value =
          dt.contract?.customer?.group_customer?.name_group;
        sheetRevenue.getCell(row, 8).value = dt.contract?.code_contract;
        sheetRevenue.getCell(row, 9).value = dt.type_product.name;
        sheetRevenue.getCell(row, 10).value = dt.price;
        sheetRevenue.getCell(row, 11).value = dt.description;
        sheetRevenue.getCell(row, 12).value =
          dt.contract?.type_contract?.name_type;
        sheetRevenue.getCell(row, 13).value =
          dt.price ??
          0 * (dataVats.find((dtt) => dtt.vat_id === dt.vat)?.type_vat ?? 0) +
            (dt.price ?? 0);
        sheetRevenue.getCell(row, 14).value = {
          formula: `VLOOKUP(D${row},'SUM CHI PHÍ'!$D$4:$E$${
            dataTypeContracts.reduce((preValue, currValue) => {
              return preValue + (currValue.contracts?.length ?? 0);
            }, 0) +
            dataTypeContracts.length +
            2
          },2,0)`,
        };
        sheetRevenue.getCell(row, 15).value = {
          formula: `J${row}-N${row}`,
        };
        for (let i = 2; i < 16; i++) {
          sheetRevenue.getCell(row, i).numFmt = "#,##0";
          sheetRevenue.getCell(row, i).border = {
            top: { style: "dotted" },
            left: { style: "dotted" },
            right: { style: "dotted" },
            bottom: { style: "dotted" },
          };
          sheetRevenue.getCell(row, i).alignment = {
            vertical: "middle",
          };
          sheetRevenue.getCell(row, i).alignment.horizontal = "right";
          if (i === 12) {
            sheetRevenue.getCell(row, i).alignment.horizontal = "center";
          }

          if (i < 5) {
            sheetRevenue.getCell(row, i).alignment = {
              horizontal: "center",
              vertical: "middle",
            };
          }
          if (i > 4 && i < 10) {
            sheetRevenue.getCell(row, i).alignment = {
              horizontal: "left",
              vertical: "middle",
            };
          }
        }
        row++;
      });
      sheetRevenue.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell((cell) => {
          if (!cell.font) {
            cell.font = {};
          }
          cell.font.name = "Times New Roman";
        });
      });
    };
    FillSheetCSDL();
    FillSheetExpense();
    FillSheetSumExpense();
    FillSheetRevenue();
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Báo cáo Tổng kết" + ".xlsx");
      setStatusExport(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full">
      <Button
        type="primary"
        className="ml-4 bg-[#23A69D]"
        onClick={() => {
          handleExport(2024);
        }}
      >
        Xuất báo cáo tổng kêt
      </Button>
    </div>
  );
}
