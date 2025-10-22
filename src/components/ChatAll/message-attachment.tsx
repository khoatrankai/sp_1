"use client"

import { Image } from "antd"
import {
  FileText,
  Download,
//   Play,
//   ImageIcon,
  Archive,
  FileCode,
  FileSpreadsheet,
  Music,
  Smartphone,
  HardDrive,
} from "lucide-react"

interface MessageAttachmentProps {
  link: string
  content: string
  className?: string
}

export function MessageAttachment({ link,content, className = "" }: MessageAttachmentProps) {
  // Function to determine file type from URL
  const getFileType = (
    url: string,
  ): "image" | "video" | "archive" | "executable" | "document" | "audio" | "code" | "file" => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".tiff"]
    const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".m4v", ".3gp"]
    const archiveExtensions = [".rar", ".zip", ".7z", ".tar", ".gz", ".bz2", ".xz", ".tar.gz", ".tar.bz2"]
    const executableExtensions = [".exe", ".msi", ".dmg", ".pkg", ".deb", ".rpm", ".appimage", ".apk"]
    const documentExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".rtf"]
    const audioExtensions = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".wma", ".m4a"]
    const codeExtensions = [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".html",
      ".css",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".php",
      ".rb",
      ".go",
      ".rs",
    ]

    const lowerUrl = url.toLowerCase()

    // Check for Cloudinary patterns first
    if (url.includes("cloudinary.com")) {
      if (url.includes("/image/") || imageExtensions.some((ext) => lowerUrl.includes(ext))) {
        return "image"
      }
      if (url.includes("/video/") || videoExtensions.some((ext) => lowerUrl.includes(ext))) {
        return "video"
      }
    }

    // Check file extensions
    if (imageExtensions.some((ext) => lowerUrl.endsWith(ext))) return "image"
    if (videoExtensions.some((ext) => lowerUrl.endsWith(ext))) return "video"
    if (archiveExtensions.some((ext) => lowerUrl.endsWith(ext))) return "archive"
    if (executableExtensions.some((ext) => lowerUrl.endsWith(ext))) return "executable"
    if (documentExtensions.some((ext) => lowerUrl.endsWith(ext))) return "document"
    if (audioExtensions.some((ext) => lowerUrl.endsWith(ext))) return "audio"
    if (codeExtensions.some((ext) => lowerUrl.endsWith(ext))) return "code"

    return "file"
  }

  // Function to get file name from URL
  const getFileName = (url: string): string => {
    try {
      const urlParts = url.split("/")
      const fileName =  content ?? urlParts[urlParts.length - 1]
      return fileName.split("?")[0] || "attachment"
    } catch {
      return "attachment"
    }
  }

  // Function to get file extension
  const getFileExtension = (url: string): string => {
    const fileName = content ?? getFileName(url)
    const parts = fileName.split(".")
    return parts.length > 1 ? `.${parts[parts.length - 1].toUpperCase()}` : ""
  }

  // Function to get appropriate icon and color for file type
  const getFileTypeInfo = (fileType: string, extension: string) => {
    switch (fileType) {
      case "archive":
        return {
          icon: Archive,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          label: "Archive File",
          description: extension === ".RAR" ? "WinRAR Archive" : "Compressed Archive",
        }
      case "executable":
        return {
          icon: extension === ".APK" ? Smartphone : HardDrive,
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Executable File",
          description: extension === ".APK" ? "Android App" : "Software Package",
        }
      case "document":
        return {
          icon: FileSpreadsheet,
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Document",
          description: "Document File",
        }
      case "audio":
        return {
          icon: Music,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          label: "Audio File",
          description: "Music/Audio",
        }
      case "code":
        return {
          icon: FileCode,
          color: "text-indigo-600",
          bgColor: "bg-indigo-100",
          label: "Code File",
          description: "Source Code",
        }
      default:
        return {
          icon: FileText,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          label: "File",
          description: "Unknown File Type",
        }
    }
  }

  const fileType = getFileType(link)
  const fileName =  content ?? getFileName(link)
  const extension = getFileExtension(link)

  const renderAttachment = () => {
    switch (fileType) {
      case "image":
        return (
          <div className="mt-2 max-w-xs">
            <Image
              src={link || "/placeholder.svg"}
              alt="Attachment"
              className="max-w-full h-auto max-h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden border border-gray-200"
            //   onClick={() => window.open(link, "_blank")}
            />
            {/* <div className="p-2 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <ImageIcon size={12} />
                <span className="truncate">{fileName}</span>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                View
              </a>
            </div> */}
          </div>
        )

      case "video":
        return (
          <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-w-xs">
            <div className="relative bg-black">
              <video controls className="w-full max-h-48 object-contain" preload="metadata">
                <source src={link} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            {/* <div className="p-2 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Play size={12} />
                <span className="truncate">{fileName}</span>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Mở
              </a>
            </div> */}
          </div>
        )

      case "audio":
        return (
          <div className="mt-2 rounded-lg border border-gray-200 max-w-xs bg-white">
            <audio controls className="w-full">
              <source src={link} />
              Your browser does not support the audio tag.
            </audio>
            {/* <div className="p-2 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Music size={12} />
                <span className="truncate">{fileName}</span>
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Download
              </a>
            </div> */}
          </div>
        )

      // Xử lý đặc biệt cho các file type khác
      case "archive":
      case "executable":
      case "document":
      case "code":
      case "file":
      default:
        const fileInfo = getFileTypeInfo(fileType, extension)
        const IconComponent = fileInfo.icon

        return (
          <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 max-w-xs">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${fileInfo.bgColor} rounded-lg flex-shrink-0`}>
                <IconComponent size={20} className={fileInfo.color} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-medium text-gray-900 text-sm truncate">{fileName}</div>
                  {extension && (
                    <span className={`px-1.5 py-0.5 ${fileInfo.bgColor} ${fileInfo.color} text-xs font-medium rounded`}>
                      {extension}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-2">{fileInfo.description}</div>
                <a
                  href={link}
                  download={fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  <Download size={12} />
                  {/* Download {fileInfo.label} */}
                  Tải về
                </a>
              </div>
            </div>

            {/* Cảnh báo đặc biệt cho file executable */}
            {fileType === "executable" && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <div className="flex items-center gap-1 text-yellow-800">
                  <span className="font-medium">⚠️ Cảnh báo:</span>
                  <span>Hãy cẩn thận khi chạy file thực thi từ nguồn không rõ</span>
                </div>
              </div>
            )}

            {/* Thông tin thêm cho file RAR */}
            {extension === ".RAR" && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <div className="text-blue-800">
                  <span className="font-medium">💡 Gợi ý:</span>
                  <span className="ml-1">Cần WinRAR hoặc 7-Zip để giải nén</span>
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  if (!link) return null

  return <div className={className}>{renderAttachment()}</div>
}
