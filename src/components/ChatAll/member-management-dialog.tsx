"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserPlus, UserMinus, Crown } from "lucide-react"
import { ChatItem } from "@/types/chat"
import { InfoUser } from "@/models/userInterface"

interface Member {
  id: string
  name: string
  role: "admin" | "user"
  user: string
}

interface MemberManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chat: ChatItem
  users: InfoUser[]
  currentUser: string
  onChatUpdate: (chat: ChatItem) => void
  isHead: boolean
}

export function MemberManagementDialog({
  open,
  onOpenChange,
  chat,
  users,
  currentUser,
  onChatUpdate,
  isHead,
}: MemberManagementDialogProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddMembers, setShowAddMembers] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && chat.type === "group") {
      fetchMembers()
    }
  }, [open, chat.id])

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/chat-groups/${chat.id}/members`)
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error("Failed to fetch members:", error)
    }
  }

  const addMember = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/chat-groups/${chat.id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        fetchMembers()
        // Update chat member count
        if (chat.type === "group") {
          onChatUpdate({
            ...chat
          })
        }
      }
    } catch (error) {
      console.error("Failed to add member:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeMember = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/chat-groups/${chat.id}/members/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchMembers()
        // Update chat member count
        if (chat.type === "group") {
          onChatUpdate({
            ...chat
          })
        }
      }
    } catch (error) {
      console.error("Failed to remove member:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const availableUsers = users.filter(
    (user) =>
      user.user_id !== currentUser &&
      !members.find((member) => member.user === user.user_id) &&
      (user.first_name+" "+user.last_name).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredMembers = members.filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (chat.type !== "group") return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            {isHead ? "Manage Members" : "Group Members"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isHead && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Members ({members.length})</span>
              <Button size="sm" variant="outline" onClick={() => setShowAddMembers(!showAddMembers)}>
                <UserPlus className="w-4 h-4 mr-1" />
                Add Members
              </Button>
            </div>
          )}

          {showAddMembers && isHead && (
            <div className="border rounded-lg p-3 space-y-2">
              <h4 className="text-sm font-medium">Add New Members</h4>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {availableUsers.map((user) => (
                  <div key={user.user_id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Avatar className="w-8 h-8 mr-2">
                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                          {getUserInitials(user.first_name+" "+user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.first_name+" "+user.last_name}</p>
                        {user.email && <p className="text-xs text-gray-600">{user.email}</p>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => addMember(user.user_id)} disabled={isLoading}>
                      Add
                    </Button>
                  </div>
                ))}
                {availableUsers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No users available to add</p>
                )}
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-3">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getUserInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{member.name}</p>
                      {member.role === "admin" && <Crown className="w-4 h-4 ml-2 text-yellow-500" />}
                      {member.user === currentUser && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 capitalize">{member.role}</p>
                  </div>
                </div>
                {isHead && member.user !== currentUser && member.user !== chat.head && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeMember(member.user)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
