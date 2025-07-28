"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit } from "lucide-react"
import { ChatItem } from "@/types/chat"

interface EditNameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chat: ChatItem
  currentUser: string
  onChatUpdate: (chat: ChatItem) => void
}

export function EditNameDialog({ open, onOpenChange, chat, currentUser, onChatUpdate }: EditNameDialogProps) {
  const [myName, setMyName] = useState(
    chat.type === "direct" ? (chat.user_one === currentUser ? chat.name_one : chat.name_two) : "",
  )
  const [friendName, setFriendName] = useState(
    chat.type === "direct" ? (chat.user_one === currentUser ? chat.name_two : chat.name_one) : "",
  )
  const [isUpdating, setIsUpdating] = useState(false)

  const updateNames = async () => {
    if (!myName.trim() || !friendName.trim() || chat.type !== "direct") return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/chats/${chat.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name_one: chat.user_one === currentUser ? myName : friendName,
          name_two: chat.user_one === currentUser ? friendName : myName,
        }),
      })

      if (response.ok) {
        const updatedChat = await response.json()
        onChatUpdate(updatedChat)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Failed to update names:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (chat.type !== "direct") return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Edit Contact Names
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input
              placeholder="Enter your display name..."
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Enter friend's display name..."
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
            These names are only visible to you and help you identify your contacts.
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={updateNames} disabled={!myName.trim() || !friendName.trim() || isUpdating}>
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              Update Names
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
