/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default async function exportToExcel(
  typeTime: "quarter" | "month" | "year",
  data: any,
  time_start: string,
  time_end: string
) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BaoCaoDoanhThu");

    worksheet.addRow([]);
    worksheet.mergeCells("B2:H2");
    worksheet.getCell("B2").value = `BÁO CÁO DOANH THU THEO ${
      typeTime === "month" ? "THÁNG" : typeTime === "quarter" ? "QUÝ" : "NĂM"
    }`;
    worksheet.getCell("B2").font = { size: 24, bold: true };
    worksheet.getCell("B2").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.addRow([]);
    worksheet.mergeCells("B3:H3");
    worksheet.getCell("B3").value = `TỪ ${time_start} - ${time_end}`;
    worksheet.getCell("B3").font = { size: 18, bold: true };
    worksheet.getCell("B3").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.columns = [
      { key: "empty1", width: 5 },
      {
        key: "date",
        width: (20 * 100) / 90,
      },
      { key: "created_at", width: 30 },
      { key: "contract", width: 30 },
      { key: "type", width: 30 },
      { key: "name_contract", width: 30 },
      { key: "code_contract", width: 40 },
      { key: "type_product", width: 30 },
      { key: "revenue", width: 30 },
      { key: "description", width: 30 },
      { key: "revenue_vat", width: 30 },
    ];

    worksheet.addRow(4).values = [
      "",

      (typeTime === "quarter"
        ? "Quý/Năm"
        : typeTime === "month"
        ? "Tháng/Năm"
        : "Năm"
      ).toUpperCase(),
      "Thời gian".toUpperCase(),
      "Mã hợp đồng".toUpperCase(),
      "Loại công trình".toUpperCase(),
      "Tên công trình".toUpperCase(),
      "Số chứng từ".toUpperCase(),
      "Sản phẩm dịch vụ".toUpperCase(),
      "Doanh thu".toUpperCase() + "(trước thuế)",
      "mô tả".toUpperCase(),
      "Doanh thu".toUpperCase() + "(sau thuế)",
    ];

    worksheet.getRow(4).font = {
      bold: true,
      size: 12,
      color: { argb: "ffffff" },
    };
    worksheet.getRow(4).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    const row = worksheet.getRow(4);
    for (let col = 2; col <= 11; col++) {
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
      if (!preValue?.[currValue?.date]) {
        preValue[currValue.date] = {
          start: index + 5,
          end: index + 5,
        };
      } else {
        if (currValue?.date !== data?.[index + 1]?.date) {
          preValue[currValue.date]["end"] = index + 5;
        }
      }
      worksheet.addRow({
        empty1: "",
        empty2: "",
        ...currValue,
        date:
          data?.[index - 1]?.date !== currValue?.date
            ? typeTime === "year"
              ? Number(currValue?.date)
              : currValue?.date
            : "",
      });
      const rowCurrent = worksheet.getRow(index + 5);
      for (let col = 2; col <= 11; col++) {
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
    saveAs(blob, `Báo cáo doanh thu` + ".xlsx");
  } catch (err) {
    console.log(err);
  }
}
