"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"
import activityService from "@/services/activityService"
// import { useToast } from "@/hooks/use-toast"

interface RemindDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workId: string
  userId: string
  userName: string
}

export function RemindDialog({ open, onOpenChange, workId, userId, userName }: RemindDialogProps) {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const { toast } = useToast()

  const handleSubmit = async () => {
    if (!description.trim()) {
      // toast({
      //   title: "Lỗi",
      //   description: "Vui lòng nhập nội dung nhắc nhở",
      //   variant: "destructive",
      // })
      return
    }

    setIsSubmitting(true)

    try {
      // Tại đây bạn sẽ gọi API để tạo Reminds
      const remindData = {
        description,
        work: workId,
        user_remind: userId,
        seen: false,
      }

      await activityService.createRemind(remindData)
     

      // toast({
      //   title: "Nhắc nhở thành công",
      //   description: `Đã gửi nhắc nhở đến ${userName}`,
      // })

      // Reset form
      setDescription("")
      onOpenChange(false)
    } catch {
      // toast({
      //   title: "Lỗi",
      //   description: "Không thể gửi nhắc nhở. Vui lòng thử lại.",
      //   variant: "destructive",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            Nhắc nhở công việc
          </DialogTitle>
          <DialogDescription>
            Gửi nhắc nhở về công việc đến <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="remind-description">Nội dung nhắc nhở</Label>
            <Textarea
              id="remind-description"
              placeholder="Nhập nội dung nhắc nhở cho nhân viên..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Gửi nhắc nhở
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
