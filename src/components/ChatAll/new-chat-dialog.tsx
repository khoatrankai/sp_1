"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MessageCircle } from "lucide-react"
import type { Chat, ChatItem } from "@/types/chat"
import { InfoUser } from "@/models/userInterface"
import projectService from "@/services/projectService"
import { useParams } from "next/navigation"

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: InfoUser[]
  chats: Chat[]
  currentUser: string
  onChatCreated: (chat: ChatItem) => void
}

export function NewChatDialog({ open, onOpenChange, users,chats, currentUser, onChatCreated }: NewChatDialogProps) {
  const {projectID} = useParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const userOver = chats.map(dt => dt.user_one).concat(chats.map(dt => dt.user_two)) ?? []
  const filteredUsers = users.filter(
    (user) => user.user_id !== currentUser && !userOver.includes(user.user_id) && (user.first_name+" "+user.last_name).toLowerCase().includes(searchQuery.toLowerCase()),
  )

 
  const createDirectChat = async (selectedUser: InfoUser) => {
    setIsCreating(true)
    try {
      const response = await projectService.createChat({user_two:selectedUser.user_id,project:(projectID as string??"")})

      // if (response.ok) {
      //   const newChat = await response.json()
      //   onChatCreated(newChat)
      //   onOpenChange(false)
      //   setSearchQuery("")
      // }
      if(response.statusCode === 201){
        const newChat = await response.data
        onChatCreated({...newChat,type:"direct"})
        onOpenChange(false)
        setSearchQuery("")
      }
    } catch (error) {
      console.error("Failed to create chat:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const getUserInitials = (user: InfoUser) => {
    return (user.first_name + " "+user.last_name)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Start New Conversation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => createDirectChat(user)}
              >
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarFallback className="bg-green-100 text-green-600">{getUserInitials(user)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{user.first_name + " "+user.last_name}</h3>
                  {user.email && <p className="text-xs text-gray-600">{user.email}</p>}
                </div>
                {isCreating && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && searchQuery && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No users found</p>
              </div>
            )}

            {filteredUsers.length === 0 && !searchQuery && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Start typing to search for users</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
