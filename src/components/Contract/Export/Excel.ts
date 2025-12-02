/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default async function exportToExcelContracts(
  contracts:any,name_export?:string
) {
  try {
    if (!contracts || contracts.length === 0) {
      alert("Không có dữ liệu để xuất!")
      return
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("DanhSachHopDong")

    // ===========================
    // TITLE
    // ===========================
    worksheet.addRow([])
    worksheet.mergeCells("B2:J2")
    worksheet.getCell("B2").value = "DANH SÁCH HỢP ĐỒNG"
    worksheet.getCell("B2").font = { size: 22, bold: true }
    worksheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" }

    worksheet.addRow([])
    worksheet.mergeCells("B3:J3")
    worksheet.getCell("B3").value =
      "(*Lưu ý: thêm đúng giá trị theo cột đã được quy định sẵn trước khi dùng import)"
    worksheet.getCell("B3").font = { size: 14 }
    worksheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" }

    // ===========================
    // TABLE HEADER
    // ===========================
    worksheet.columns = [
      { key: "empty", width: 5 },
      { key: "name_contract", width: 30 },
      { key: "code_contract", width: 20 },
      { key: "project", width: 20 },
      { key: "customer", width: 25 },
      { key: "price", width: 15 },
      { key: "type_contract", width: 20 },
      { key: "date_start", width: 18 },
      { key: "date_expired", width: 18 },
      { key: "description", width: 35 },
    ]

    // worksheet.addRow([])
    worksheet.addRow([
      "",
      "TÊN HỢP ĐỒNG",
      "MÃ HỢP ĐỒNG",
      "DỰ ÁN",
      "KHÁCH HÀNG",
      "GIÁ TRỊ",
      "LOẠI HỢP ĐỒNG",
      "NGÀY BẮT ĐẦU",
      "NGÀY KẾT THÚC",
      "MÔ TẢ",
    ])

    const headerRow = worksheet.getRow(4)
    headerRow.font = { bold: true, color: { argb: "FFFFFF" }, size: 12 }
    headerRow.alignment = { horizontal: "center", vertical: "middle" }

    for (let col = 2; col <= 10; col++) {
      const cell = headerRow.getCell(col)
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1BA49D" },
      }
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      }
    }

    // ===========================
    // BODY ROWS
    // ===========================
    let rowIndex = 5
    contracts.forEach((contract:any) => {
      worksheet.addRow({
        empty: "",
        name_contract: contract.name_contract,
        code_contract: contract.code_contract,
        project: contract.project || "",
        customer: contract.customer,
        price: contract.price || 0,
        type_contract: contract.type_contract || "",
        date_start: contract.date_start || "",
        date_expired: contract.date_expired || "",
        description: contract.description || "",
      })

      const row = worksheet.getRow(rowIndex)
      row.font = { size: 12 }

      for (let col = 2; col <= 10; col++) {
        row.getCell(col).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        }
      }

      rowIndex++
    })

    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${name_export? name_export:`Danh_Sach_Hop_Dong_${new Date().toISOString().slice(0, 10)}.xlsx`}`
    )
  } catch (err) {
    console.error(err)
  }
}
