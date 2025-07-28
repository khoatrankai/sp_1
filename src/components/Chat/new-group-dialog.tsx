"use client"

import {  useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Users, X } from "lucide-react"
import type {  ChatItem } from "@/types/chat"
import { InfoUser } from "@/models/userInterface"
import projectService from "@/services/projectService"
import { useParams } from "next/navigation"

interface NewGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: InfoUser[]
  currentUser: string
  onGroupCreated: (group: ChatItem) => void
}

export function NewGroupDialog({ open, onOpenChange, users, currentUser, onGroupCreated }: NewGroupDialogProps) {
  const {projectID} = useParams()
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<InfoUser[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.user_id !== currentUser &&
      (user.first_name+" "+user.last_name).toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedUsers.find((selected) => selected.user_id === user.user_id),
  )

  const addUser = (user: InfoUser) => {
    setSelectedUsers((prev) => [...prev, user])
    setSearchQuery("")
  }

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.user_id !== userId))
  }

  const createGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return

    setIsCreating(true)
    try {
      // const response = await fetch("/api/chat-groups", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: groupName,
      //     description: groupDescription,
      //     members: selectedUsers.map((user) => user.user_id),
      //     currentUserId: currentUser,
      //   }),
      // })
      const response = await projectService.createChatGroup({name:groupName,description:groupDescription,members: selectedUsers.map((user) => user.user_id),project:projectID as string})

      if (response.statusCode === 201) {
        const newGroup = response?.data
        onGroupCreated({...newGroup,type:"group"})
        onOpenChange(false)
        // Reset form
        setGroupName("")
        setGroupDescription("")
        setSelectedUsers([])
        setSearchQuery("")
      }
    } catch (error) {
      console.error("Failed to create group:", error)
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Create New Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Group Name</label>
            <Input placeholder="Enter group name..." value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              placeholder="Enter group description..."
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Add Members</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Members ({selectedUsers.length})</label>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge key={user.user_id} variant="secondary" className="flex items-center gap-1">
                    {user.first_name+" "+user.last_name}
                    <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeUser(user.user_id)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-40 overflow-y-auto space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => addUser(user)}
              >
                <Avatar className="w-8 h-8 mr-3">
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{user.first_name+" "+user.last_name}</h3>
                  {user.email && <p className="text-xs text-gray-600">{user.email}</p>}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && searchQuery && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={createGroup} disabled={!groupName.trim() || selectedUsers.length === 0 || isCreating}>
              {isCreating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
