"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Bell } from "lucide-react"
import { ReviewDialog } from "./review-dialog"
import { RemindDialog } from "./remind-dialog"

interface UserActionsProps {
  workId: string
  userId: string
  userName: string
  listId:string
}

export function UserActions({ workId, userId, userName,listId }: UserActionsProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showRemindDialog, setShowRemindDialog] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowReviewDialog(true)}
        className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
      >
        <Star className="w-4 h-4" />
        Đánh giá
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowRemindDialog(true)}
        className="flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
      >
        <Bell className="w-4 h-4" />
        Nhắc nhở
      </Button>

      {
        showReviewDialog &&
        <ReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        workId={workId}
        userId={userId}
        list_id={listId}
        userName={userName}
      />
      }
      
      {
        showRemindDialog && 
        <RemindDialog
        open={showRemindDialog}
        onOpenChange={setShowRemindDialog}
        workId={workId}
        userId={userId}
        userName={userName}
      />
      }
      
    </div>
  )
}
