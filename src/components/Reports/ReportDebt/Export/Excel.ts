/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default async function exportToExcel(data: any) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BaoCaoCongNoCanTra");

    worksheet.addRow([]);
    worksheet.mergeCells("B2:H2");
    worksheet.getCell("B2").value = `BÁO CÁO CÔNG NỢ CẦN TRẢ`;
    worksheet.getCell("B2").font = { size: 24, bold: true };
    worksheet.getCell("B2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.columns = [
      { key: "empty1", width: 5 },
      { key: "date_expired", width: 30 },
      { key: "payment_id", width: 30 },
      { key: "name_supplier", width: 30 },
      { key: "type_product", width: 30 },
      { key: "description", width: 30 },
      { key: "price", width: 30 },
    ];

    worksheet.addRow(3).values = [
      "",
      "Hạn công nợ".toUpperCase(),
      "Mã thanh toán".toUpperCase(),
      "Tên nhà cung cấp".toUpperCase(),
      "Sản phẩm dịch vụ".toUpperCase(),
      "mô tả".toUpperCase(),
      "Công nợ".toUpperCase(),
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

    const vt = data.reduce((preValue: any, currValue: any, index: number) => {
      if (!preValue?.[currValue?.date_expired]) {
        preValue[currValue.date_expired] = {
          start: index + 4,
          end: index + 4,
        };
      } else {
        if (currValue?.date_expired !== data?.[index + 1]?.date_expired) {
          preValue[currValue.date]["end"] = index + 4;
        }
      }
      worksheet.addRow({
        empty1: "",
        empty2: "",
        ...currValue,
        date_expired:
          data?.[index - 1]?.date_expired !== currValue?.date_expired
            ? currValue?.date_expired
            : "",
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
    Object.keys(vt).forEach((dt) => {
      worksheet.mergeCells(`B${vt[dt].start}:B${vt[dt].end}`);
      worksheet.getCell(`B${vt[dt].start}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Báo cáo cần trả công nợ` + ".xlsx");
  } catch (err) {
    console.log(err);
  }
}
