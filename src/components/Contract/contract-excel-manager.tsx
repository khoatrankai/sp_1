/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Upload,
  FileSpreadsheet,
  Check,
  AlertCircle,
  Trash2,
  Calendar,
  Filter,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import * as XLSX from "xlsx"
import exportToExcelContracts from "./Export/Excel"
import contractService from "@/services/contractService."
import { Modal } from "antd"
import { TbFilterDown } from "react-icons/tb"
import { AppDispatch, RootState } from "@/redux/store/store"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { fetchContracts } from "@/redux/store/slices/contractSlices/contract.slide"

interface Contract {
  name_contract: string
  code_contract: string
  project: string
  customer: string
  price: number | string
  type_contract: string
  date_start: string
  date_expired: string
  description: string
  selected?: boolean
  applied?: boolean
}



export function ContractExcelManager() {
  const dispatch = useDispatch<AppDispatch>()
  const [contracts, setContracts] = useState<Contract[]>([])
  const { datas: dataCustomers } = useSelector(
      (state: RootState) => state.infos_customer
    );
    const { datas: dataProjects } = useSelector(
      (state: RootState) => state.get_projects
    );
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [modalFilter,setModalFilter] = useState<boolean>(false)
  const [modalApply,setModalApply] = useState<boolean>(false)
  const [filterType, setFilterType] = useState<"date_start" | "date_expired">("date_expired")
  const [isApplying, setIsApplying] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [showApplyDialog, setShowApplyDialog] = useState(false)

  const downloadTemplate = async() => {
    const dataTemplate = [{
        name_contract: "Công ty ABC",
        code_contract: "HĐ-01",
        project: "Dự án ABC",
        customer: "Khách hàng ABC",
        price: 0,
        type_contract: "Hợp đồng thương mại",
        date_start: "8/2/2025",
        date_expired: "9/2/2025",
        description: "Mô tả ABC",
    }]
    await exportToExcelContracts(dataTemplate,'Template mẫu hợp đồng.xlsx')
  }

  

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = event.target?.result as ArrayBuffer;

      // Đọc Excel giống backend
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "");
      const importedContracts: Contract[] = [];

      for (let row = 4; row <= range.e.r; row++) {
        const cell = (c: number) => worksheet[XLSX.utils.encode_cell({ r: row, c })];

        // Nếu dòng trống → bỏ qua
        if (!cell(1) && !cell(2) && !cell(3) && !cell(4)) continue;

        const name_contract = cell(1)?.v
          ? String(cell(1).v).trim().toLowerCase().replace(/\s+/g, " ")
          : "";

        const code_contract = cell(2)?.v
          ? String(cell(2).v).trim()
          : "";

        const project = cell(3)?.v
          ? String(cell(3).v).trim()
          : "";

        const customer = cell(4)?.v
          ? String(cell(4).v).trim()
          : "";

        const price = cell(5)?.v ? Number(cell(5).v) : 0;

        const type_contract = cell(6)?.v
          ? String(cell(6).v).trim()
          : "";

        const date_start = cell(7)?.w ? cell(7).w : "";
        const date_expired = cell(8)?.w ? cell(8).w : "";

        const description = cell(9)?.v ?? "";

        importedContracts.push({
          name_contract,
          code_contract,
          project,
          customer,
          price,
          type_contract,
          date_start,
          date_expired,
          description,
          selected: true,
          applied: false,
        });
      }

      // Filter row thiếu dữ liệu
      const valid = importedContracts.filter(
        (c) =>
          c.name_contract && c.code_contract && c.customer && c.date_expired
      );

      if (valid.length === 0) {
        setImportStatus({
          type: "error",
          message: "Không tìm thấy dữ liệu hợp lệ trong file!",
        });
        return;
      }

      setContracts((prev) => [...prev, ...valid]);

      setImportStatus({
        type: "success",
        message: `Import thành công ${valid.length} hợp đồng!`,
      });
      setSelectAll(true);
    } catch (error) {
      console.error(error);
      setImportStatus({
        type: "error",
        message: "Lỗi đọc file Excel — vui lòng kiểm tra lại!",
      });
    }
  };

  reader.readAsArrayBuffer(file); // IMPORTANT: đọc dạng buffer
  e.target.value = "";
  }

  const clearContracts = () => {
    setContracts([])
    setImportStatus(null)
  }

  const formatCurrency = (value: number | string) => {
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num || 0)
  }

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null

    const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (ddmmyyyy) {
      return new Date(Number.parseInt(ddmmyyyy[3]), Number.parseInt(ddmmyyyy[2]) - 1, Number.parseInt(ddmmyyyy[1]))
    }

    const yyyymmdd = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (yyyymmdd) {
      return new Date(Number.parseInt(yyyymmdd[1]), Number.parseInt(yyyymmdd[2]) - 1, Number.parseInt(yyyymmdd[3]))
    }

    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
  }

  const exportByDateRange = async() => {
    // if (contracts.length === 0) {
    //   setImportStatus({ type: "error", message: "Khong co du lieu de xuat!" })
    //   return
    // }

    const fromDate = dateFrom ? new Date(dateFrom).getTime().toString() : undefined
    const toDate = dateTo ? new Date(dateTo).getTime().toString() : undefined

    const res = await contractService.getContractsFilterFull({time_start:fromDate,time_end:toDate})
    if(res?.statusCode ===200){
      const filteredContracts= res?.data
      if (filteredContracts.length === 0) {
      setImportStatus({
        type: "error",
        message: "Khong co hop dong nao trong khoang thoi gian da chon!",
      })
      return
      }

    
      setImportStatus({
        type: "success",
        message: `Xuat thanh cong ${filteredContracts.length} hop dong theo bo loc thoi gian!`,
      })
      exportToExcelContracts(filteredContracts.map((dt:any)=> {
        return {...dt,project:dataProjects.find(dtt=> dtt.project_id === dt.project)?.name,customer:dataCustomers.find(dtt=> dtt.info_id === dt.customer)?.name_company,type_contract:dt?.type_contract?.name_type}
      }),`Danh sách ${filteredContracts.length} hợp đồng`)
    }
    
  }

  const toggleContractSelection = (index: number) => {
    setContracts((prev) => prev.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c)))
  }

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setContracts((prev) => prev.map((c) => (c.applied ? c : { ...c, selected: newSelectAll })))
  }

  const applyContracts = async () => {
    const selectedContracts = contracts.filter((c) => c.selected && !c.applied)

    if (selectedContracts.length === 0) {
      setImportStatus({
        type: "error",
        message: "Vui long chon it nhat mot hop dong de apply!",
      })
      return
    }
    const res = await contractService.importContracts(contracts)
    if(res?.statusCode === 200){
          setModalApply(false)
          setIsApplying(true)
          setShowApplyDialog(false)
          setContracts([])
          dispatch(fetchContracts(null))
    }



   
  }

  const selectedCount = contracts.filter((c) => c.selected && !c.applied).length
  const pendingCount = contracts.filter((c) => !c.applied).length
  const appliedCount = contracts.filter((c) => c.applied).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            Import / Export Excel
          </CardTitle>
          <CardDescription>Tải template mẫu, import danh sách hợp đồng hoặc xuất dữ liệu ra file Excel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadTemplate} variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Tải template mẫu
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="excel-import"
              />
              <Button variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Upload className="h-4 w-4" />
                Import từ Excel
              </Button>
            </div>

            <Button
              onClick={()=>{exportToExcelContracts(contracts)}}
              variant="outline"
              className="gap-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Xuất Excel
            </Button>

            
                <Button
                  variant="outline"
                  onClick={()=>{setModalFilter(true)}}
                  className="gap-2 border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Calendar className="h-4 w-4" />
                  Xuất theo thời gian
                </Button>
            

            {contracts.length > 0 && (
              <Button onClick={clearContracts} variant="destructive" className="gap-2 bg-red-500">
                <Trash2 className="h-4 w-4" />
                Xoá tất cả
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {importStatus && (
        <Alert variant={importStatus.type === "success" ? "default" : "destructive"}>
          {importStatus.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{importStatus.type === "success" ? "Thành công" : "Lỗi"}</AlertTitle>
          <AlertDescription>{importStatus.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Danh sách hợp đồng
                {contracts.length > 0 && (
                  <>
                    <Badge variant="secondary">{contracts.length} hợp đồng</Badge>
                    {appliedCount > 0 && (
                      <Badge variant="default" className="bg-emerald-600">
                        {appliedCount} đã apply
                      </Badge>
                    )}
                    {pendingCount > 0 && (
                      <Badge variant="outline" className="border-amber-500 text-amber-600">
                        {pendingCount} chờ duyệt
                      </Badge>
                    )}
                  </>
                )}
              </CardTitle>
              <CardDescription>
                Xem trước dữ liệu đã import. Chọn các hợp đồng cần phê duyệt và bấm Apply để lưu vào hệ thống.
              </CardDescription>
            </div>

            {pendingCount > 0 && (
            
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={()=>{
                    setModalApply(true)
                  }} disabled={selectedCount === 0 || isApplying}>
                    {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Apply ({selectedCount})
                  </Button>
               
            )}
          </div>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có dữ liệu. Hãy tải template mẫu và import file Excel.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} disabled={pendingCount === 0} />
                    </TableHead>
                    <TableHead className="font-semibold">STT</TableHead>
                    <TableHead className="font-semibold">Tên hợp đồng</TableHead>
                    <TableHead className="font-semibold">Mã HD</TableHead>
                    <TableHead className="font-semibold">Dự án</TableHead>
                    <TableHead className="font-semibold">Khách hàng</TableHead>
                    <TableHead className="font-semibold text-right">Giá trị</TableHead>
                    <TableHead className="font-semibold">Loại HD</TableHead>
                    <TableHead className="font-semibold">Ngày bắt đầu</TableHead>
                    <TableHead className="font-semibold">Ngày kết thúc</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract, index) => (
                    <TableRow
                      key={index}
                      className={contract.applied ? "bg-emerald-50" : contract.selected ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={contract.selected || false}
                          onCheckedChange={() => toggleContractSelection(index)}
                          disabled={contract.applied}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{contract.name_contract}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{contract.code_contract}</Badge>
                      </TableCell>
                      <TableCell>{contract.project || "-"}</TableCell>
                      <TableCell>{contract.customer}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">
                        {formatCurrency(contract.price)}
                      </TableCell>
                      <TableCell>{contract.type_contract || "-"}</TableCell>
                      <TableCell>{contract.date_start || "-"}</TableCell>
                      <TableCell>{contract.date_expired}</TableCell>
                      <TableCell>
                        {contract.applied ? (
                          <Badge className="bg-emerald-600">
                            <Check className="h-3 w-3 mr-1" />
                            Đã apply
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500 text-amber-600">
                            Chờ duyệt
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
       <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TbFilterDown />
          Xuất hợp đồng theo thời gian
        </div>
      }
      open={modalFilter}
      onCancel={()=>{
        setModalFilter(false)
      }}
      footer={[ 
        <Button key="cancel" onClick={()=>{
        setModalFilter(false)
      }}>
          Hủy
        </Button>,
        <Button
          key="export"
          onClick={() => {
            exportByDateRange()
            setModalFilter(false)
          }}
          style={{ backgroundColor: "#ea580c", borderColor: "#ea580c" }}
        >
          Xuất Excel
        </Button>,
      ]}
    >
      <p style={{ marginTop: 8, color: "#666" }}>
        Chọn khoảng thời gian để lọc và xuất các hợp đồng.
      </p>

      <div className="space-y-4 py-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date-from">Từ ngày</Label>
                      <Input
                        id="date-from"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-to">Đến ngày</Label>
                      <Input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Để trống nếu không muốn giới hạn ngày bắt đầu hoặc kết thúc
                  </p>
                </div>
    </Modal>
    <Modal
      open={modalApply}
      onCancel={()=>{setModalApply(false)}}
      footer={[
        <Button key="cancel" onClick={()=>{setModalApply(false)}}>
          Hủy
        </Button>,
        <Button
          key="apply"
          onClick={applyContracts}
          style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }} // blue-600
        >
          {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} 
          Xác nhận Apply({selectedCount})
        </Button>,
      ]}
      title="Xác nhận Apply hợp đồng"
    >
      <p>Bạn có chắc chắn muốn apply {selectedCount} hợp đồng đã chọn vào hệ thống database?</p>

      <div
        style={{
          background: "#f5f5f5",
          padding: 16,
          marginTop: 16,
          borderRadius: 8,
        }}
      >
        <p style={{ fontWeight: 500 }}>Thông tin apply:</p>
        <ul style={{ marginTop: 8, paddingLeft: 16, color: "#555" }}>
          <li>
            • Số hợp đồng sẽ apply:{" "}
            <span style={{ fontWeight: 600, color: "#000" }}>{selectedCount}</span>
          </li>
          <li>• Các hợp đồng đã apply trước đó sẽ không bị ảnh hưởng</li>
          <li>• Dữ liệu sẽ được lưu vào hệ thống database</li>
        </ul>
      </div>
    </Modal>
    </div>
  )
}
