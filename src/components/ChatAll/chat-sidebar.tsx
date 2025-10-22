"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search,  MessageCircle, Users } from "lucide-react"
import { NewChatDialog } from "@/components/Chat/new-chat-dialog"
import { NewGroupDialog } from "@/components/Chat/new-group-dialog"
import { ChatItem } from "@/types/chat"
import { InfoUser } from "@/models/userInterface"

interface ChatSidebarProps {
  chats: ChatItem[]
  users: InfoUser[]
  selectedChat: ChatItem | null
  onSelectChat: (chat: ChatItem) => void
  onNewChat: (chat: ChatItem) => void
  onChatUpdate: (chat: ChatItem) => void
  onChatDelete: (chatId: string) => void
  currentUser: string
}

export function ChatSidebar({
  chats,
  users,
  selectedChat,
  onSelectChat,
  onNewChat,
  currentUser,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false)

  const directChats = chats.filter((chat) => chat.type === "direct")
  const groupChats = chats.filter((chat) => chat.type === "group")

  const filteredDirectChats = directChats.filter(
    (chat) =>
      chat.name_one.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.name_two.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredGroupChats = groupChats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getChatDisplayName = (chat: ChatItem) => {
    if (chat.type === "direct") {
      console.log(currentUser)
      return  chat.user_one === currentUser ? chat.name_two :chat.name_one
    }
    return chat.name
  }

  const getChatInitials = (chat: ChatItem) => {
    const name = getChatDisplayName(chat)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();

  // Lấy giờ phút UTC
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");

  // Kiểm tra khác ngày
  const isDifferentDay =
    d.getUTCDate() !== now.getUTCDate() ||
    d.getUTCMonth() !== now.getUTCMonth() ||
    d.getUTCFullYear() !== now.getUTCFullYear();

  if (isDifferentDay) {
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return `${hours}:${minutes}`;
};

  const ChatItem = ({ chat }: { chat: ChatItem }) => (
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
        selectedChat?.id === chat.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
      }`}
      onClick={() => onSelectChat(chat)}
    >
      <Avatar className="w-10 h-10 mr-3 flex-shrink-0">
        <AvatarFallback className="bg-blue-100 text-blue-600">{getChatInitials(chat)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium truncate text-sm pr-2">{getChatDisplayName(chat)}</h3>
          {chat.contents?.[0]?.content && (
            <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(chat?.contents?.[0]?.created_at)}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          {chat.contents?.[0]?.content && <p className="text-xs text-gray-600 truncate flex-1 pr-2">{chat.contents?.[0]?.content}</p>}
          {chat.type === "group" && (
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              <Users className="w-3 h-3 mr-1" />
              {chat.members?.length || 0}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-blue-500" onClick={() => setShowNewChatDialog(true)}>
            <MessageCircle className="w-4 h-4 mr-1 text-white" />
            New Chat
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => setShowNewGroupDialog(true)}
          >
            <Users className="w-4 h-4 mr-1" />
            New Group
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid w-auto grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="all" className="text-xs">
            All
          </TabsTrigger>
          <TabsTrigger value="direct" className="text-xs">
            <MessageCircle className="w-3 h-3 mr-1" />
            Direct
          </TabsTrigger>
          <TabsTrigger value="groups" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Groups
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="all" className="mt-0">
            <div className="space-y-1 p-2">
              {[...filteredDirectChats, ...filteredGroupChats]
                .sort((a, b) => {
                  const aTime = a?.contents?.[0]?.created_at ? new Date(a?.contents?.[0]?.created_at).getTime() :  a.created_at ? new Date(a.created_at).getTime() : 0
                  const bTime = b?.contents?.[0]?.created_at ? new Date(b?.contents?.[0]?.created_at).getTime() :  b.created_at ? new Date(b.created_at).getTime() : 0
                  return bTime - aTime
                })
                .map((chat) => (
                  <ChatItem key={chat.id} chat={chat} />
                ))}
              {[...filteredDirectChats, ...filteredGroupChats].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No conversations found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="direct" className="mt-0">
            <div className="space-y-1 p-2">
              {filteredDirectChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
              {filteredDirectChats.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No direct messages</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => setShowNewChatDialog(true)}
                  >
                    Start a conversation
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <div className="space-y-1 p-2">
              {filteredGroupChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
              {filteredGroupChats.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No group chats</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => setShowNewGroupDialog(true)}
                  >
                    Create a group
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        users={users}
        chats={chats.filter((chat) => chat.type === "direct")}
        currentUser={currentUser}
        onChatCreated={onNewChat}
      />

      <NewGroupDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        users={users}
        currentUser={currentUser}
        onGroupCreated={onNewChat}
      />
    </div>
  )
}
