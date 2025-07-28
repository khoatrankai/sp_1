/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/Chat/chat-sidebar"
import { ChatWindow } from "@/components/Chat/chat-window"
import { Card } from "@/components/ui/card"
import projectService from "@/services/projectService"
import { useParams } from "next/navigation"
import { RootState } from "@/redux/store/store"
import { useSelector } from "react-redux"
import { InfoUser } from "@/models/userInterface"
import { getSocket, initSocket } from "@/utils/socket"

// export interface User {
//   id: string
//   name: string
//   email?: string
//   avatar?: string
// }

export interface Chat {
  id: string
  name_one: string
  name_two: string
  user_one: string
  user_two: string
  type: "direct"
  lastMessage?: string
  lastMessageTime?: Date
}

export interface ChatGroup {
  id: string
  name: string
  description: string
  head: string
  type: "group"
  members?:any[]
  memberCount?: number
  lastMessage?: string
  lastMessageTime?: Date
}

export interface Message {
  id: string
  content: string
  user: string
  user_seen: string[]
  created_at: Date
  link?: string
}

export type ChatItem = Chat | ChatGroup

export default function ChatApp() {
  const { projectID } = useParams();
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null)
  const [chats, setChats] = useState<ChatItem[]>([])
  const [users, setUsers] = useState<InfoUser[]>([])
  const { datas: dataProfile } = useSelector(
      (state: RootState) => state.get_profile
    );

  useEffect(() => {
    fetchChats()
    fetchUsers()
     const socket = initSocket();
     socket.emit("join_me");
     socket.on('load_list_chat', () => {
        fetchChats()
        });
         socket.on('load_delete_chat_group', (msg) => {
        handleChatDelete(msg?.data)
        });
        return () => {
          socket.disconnect();
        };
      
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await projectService.getUsersByProject(projectID as string)
      if(response.statusCode === 200)
        setUsers(response.data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const fetchChats = async () => {
    try {
      const response = await projectService.getChats(projectID as string)
      const response2 = await projectService.getChatGroups(projectID as string)
      setChats(response?.data?.map((dt:any) => {
        return {...dt,type:'direct'}
      }).concat(response2?.data?.map((dt:any) => {
        return {...dt,type:'group'}
      })))
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    }
  }

  const handleNewChat = (newChat: ChatItem) => {
    const socket = getSocket()
    if(newChat.type === "direct"){
    socket.emit('notify_new_chat',{user:newChat.user_two})
    }
    if(newChat.type === "group"){
    socket.emit('notify_new_chat_group',{user:newChat.members?.map(dt => dt.user)})
    }
    setChats((prev) => [newChat, ...prev])
    setSelectedChat(newChat)
  }

  const handleChatUpdate = (updatedChat: ChatItem) => {
    setChats((prev) => prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)))
    if (selectedChat?.id === updatedChat.id) {
      setSelectedChat(updatedChat)
    }
  }

  const handleChatDelete = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (selectedChat?.id === chatId) {
      setSelectedChat(null)
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      <div className="w-96 border-r bg-white">
        <ChatSidebar
          chats={chats}
          users={users}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          onNewChat={handleNewChat}
          onChatUpdate={handleChatUpdate}
          onChatDelete={handleChatDelete}
          currentUser={dataProfile?.user_id as string}
        />
      </div>
      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            currentUser={dataProfile?.user_id as string}
            users={users}
            onChatUpdate={handleChatUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
              <p className="text-gray-600">Select a conversation to start chatting</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
