"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Settings } from "lucide-react"
import { ChatItem } from "@/types/chat"

interface ChatSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chat: ChatItem
  onChatUpdate: (chat: ChatItem) => void
  isHead: boolean
}

export function ChatSettingsDialog({ open, onOpenChange, chat, onChatUpdate, isHead }: ChatSettingsDialogProps) {
  const [groupName, setGroupName] = useState(chat.type === "group" ? chat.name : "")
  const [groupDescription, setGroupDescription] = useState(chat.type === "group" ? chat.description : "")
  const [isUpdating, setIsUpdating] = useState(false)

  const updateGroupSettings = async () => {
    if (!groupName.trim() || chat.type !== "group") return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/chat-groups/${chat.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          description: groupDescription,
        }),
      })

      if (response.ok) {
        const updatedChat = await response.json()
        onChatUpdate(updatedChat)
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Failed to update group settings:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (chat.type !== "group") return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Group Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Group Name</label>
            <Input
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={!isHead}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter group description..."
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={3}
              disabled={!isHead}
            />
          </div>

          {!isHead && (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
              Only group administrators can edit these settings.
            </div>
          )}

          {isHead && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={updateGroupSettings} disabled={!groupName.trim() || isUpdating}>
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                Update
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
