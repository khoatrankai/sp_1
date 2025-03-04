/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";



export default async function exportToExcel(name:string,data: {key:number,time_start:string,time_end:string,time_total:number}[]) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BaoCaoChamCong");

    worksheet.addRow([]);
    worksheet.mergeCells("B2:H2");
    worksheet.getCell("B2").value = `BÁO CÁO CHẤM CÔNG CỦA ${name.toUpperCase()}`;
    worksheet.getCell("B2").font = { size: 24, bold: true };
    worksheet.getCell("B2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.columns = [
      { key: "empty1", width: 5 },
      { key: "key", width: 30 },
      { key: "time_start", width: 30 },
      { key: "time_end", width: 30 },
      { key: "time_total", width: 30 },

    ];

    worksheet.addRow(3).values = [
      "",
      "STT".toUpperCase(),
      "Thời gian vào".toUpperCase(),
      "Thời gian ra".toUpperCase(),
      "Tổng số giờ".toUpperCase(),
    ];

    worksheet.getRow(3).font = {
      bold: true,
      size: 12,
      color: { argb: "ffffff" },
    };
    worksheet.getRow(3).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    const row = worksheet.getRow(3);
    for (let col = 2; col <= 7; col++) {
      row.getCell(col).border = {
        bottom: { style: "thin" },
        top: { style: "thin" },
        right: { style: "thin" },
        left: { style: "thin" },
      };
      row.getCell(col).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1BA49D" },
      };
    }

     data.reduce((preValue: any, currValue: any, index: number) => {
      
      worksheet.addRow({
        empty1: "",
        ...currValue
      });
      const rowCurrent = worksheet.getRow(index + 4);
      for (let col = 2; col <= 7; col++) {
        rowCurrent.getCell(col).border = {
          bottom: { style: "thin" },
          top: { style: "thin" },
          right: { style: "thin" },
          left: { style: "thin" },
        };
        rowCurrent.getCell(col).font = {
          size: 12,
        };
      }

      return preValue;
    }, {});
    

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Báo cáo chấm công` + ".xlsx");
  } catch (err) {
    console.log(err);
  }
}
