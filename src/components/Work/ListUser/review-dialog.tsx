"use client"

import { useEffect, useState } from "react"
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
import { Star } from "lucide-react"
import activityService from "@/services/activityService"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  list_id: string
  userId:string
  workId:string
  userName: string
}

export function  ReviewDialog({ open, onOpenChange, list_id,userId,workId, userName }: ReviewDialogProps) {
  const [progress, setProgress] = useState(0)
  const [description, setDescription] = useState("")
  const [reviewID, setReviewID] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const reviewData = {
        progress,
        description,
        user_work: list_id,
      }
      if(!reviewID || reviewID === ""){
      await activityService.createReviewUser(reviewData)
      }else{
      await activityService.updateReviewUser(reviewID,reviewData)

      }
      
      // console.log("Creating review:", reviewData)
      // await new Promise((resolve) => setTimeout(resolve, 1000))

      // toast({
      //   title: "Đánh giá thành công",
      //   description: `Đã gửi đánh giá cho ${userName}`,
      // })

      setProgress(0)
      setDescription("")
      onOpenChange(false)
    } catch {
      // toast({
      //   title: "Lỗi",
      //   description: "Không thể gửi đánh giá. Vui lòng thử lại.",
      //   variant: "destructive",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }
  const fetchData = async()=>{
    const res = await activityService.getReviewUserByWork(userId,workId)
    if(res.statusCode === 200){
      setProgress(res.data.progress)
      setDescription(res.data.description)
      setReviewID(res?.data?.review_id)
    }
  }
  useEffect(()=>{
    console.log("fetchData:",userId,workId)
    if(userId && workId){
      fetchData()
    }
  },[workId,userId])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Đánh giá công việc
          </DialogTitle>
          <DialogDescription>
            Đánh giá tiến độ và chất lượng công việc của <strong>{userName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="progress">Tiến độ hoàn thành: {progress}%</Label>
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Nhận xét</Label>
            <Textarea
              id="description"
              placeholder="Nhập nhận xét về công việc của nhân viên..."
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
                <Star className="w-4 h-4" />
                Gửi đánh giá
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
