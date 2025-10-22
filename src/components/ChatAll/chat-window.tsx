/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Send,
  Users,
  MoreVertical,
  Paperclip,
  Settings,
  UserPlus,
  Edit,
  Trash2,
  LogOut,
} from "lucide-react"
import { ChatItem, Message } from "@/types/chat"
import { MemberManagementDialog } from "./member-management-dialog"
import { ChatSettingsDialog } from "./chat-settings-dialog"
import { EditNameDialog } from "./edit-name-dialog"
import projectService from "@/services/projectService"
import CustomFormData from "@/utils/CustomFormData"
import { getSocket, initSocket } from "@/utils/socket"
import { Socket } from "socket.io-client"
import { InfoUser } from "@/models/userInterface"
import { Modal } from "antd"
import { MessageAttachment } from "./message-attachment"

interface ChatWindowProps {
  chat: ChatItem
  currentUser: string
  users: InfoUser[]
  onChatUpdate: (chat: ChatItem) => void
}

export function ChatWindow({ chat, currentUser, users, onChatUpdate,  }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const socketRef = useRef<Socket | null>(null);
  const [newMessage, setNewMessage] = useState("")
  const [messageDelete, setMessageDelete] = useState("")
  const [chatGroupDelete, setChatGroupDelete] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMemberManagement, setShowMemberManagement] = useState(false)
  const [showEditName, setShowEditName] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initSocket();
    }
    const socket = socketRef.current;
    socket.emit("join_me");
    socket.on("load_delete_chat", (msg) => {
      setMessages((prev) => prev.filter(dt => dt.id !== msg.data));
    });
    socket.on("load_chat", (msg) => {
      setMessages((prev) => [...prev, msg.data]);
    });
    return () => {
      socket.off("load_chat");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    if (chat.id && socketRef.current) {
      console.log(chat.id)
      socketRef.current.emit("join_chat", { chat: chat.id });
    }
  }, [chat.id]);
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      
      const response =
        chat.type === "direct" ? await projectService.getContentChats(chat.id) : await projectService.getContentGroupChats(chat.id)
      if(response?.statusCode === 200)
        setMessages(response?.data)
        
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    try {
      const socket = getSocket();
      const data = {
        content: newMessage,
        user:currentUser,
        chat:chat.id,
      }
      const dataGroup = {
        content: newMessage,
        user:currentUser,
        chat_group:chat.id,
      }
      const response = chat.type === "direct" ? await projectService.createContentChats(CustomFormData(data)) : await projectService.createContentGroupChats(CustomFormData(dataGroup))
      if (response.statusCode === 201) {
        // const newMsg = response?.data
        // setMessages((prev) => [...prev, newMsg])
        if(chat.type === "direct"){
         socket.emit('notify_new_message',{chat:chat.id,user:chat.user_two,data:response.data})
        }
        if(chat.type === "group"){
         socket.emit('notify_new_message_group',{chat_group:chat.id,head:chat.head,members:chat.members?.map(dt => dt.user),data:response.data})
        }
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMessage = async () => {
    try {
      const socket = getSocket();
      const response = chat.type === "direct"
          ? await projectService.deleteContent([messageDelete])
          : await projectService.deleteContentGroup([messageDelete])

      if (response.statusCode === 200) {
        if(chat.type === "direct"){
         socket.emit('notify_delete_message',{chat:chat.id,user:chat.user_two,data:messageDelete})
        }
        if(chat.type === "group"){
         socket.emit('notify_delete_message_group',{chat_group:chat.id,head:chat.head,members:chat.members?.map(dt => dt.user),data:messageDelete})
        }
      }
      setMessageDelete("");
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  const handleLeaveOrDeleteGroup = async () => {
    const socket = getSocket();
    if (chat.type !== "group") return

    try {
      const isHead = chat.head === currentUser
      

      const response = isHead ? await projectService.deleteChatGroup([chatGroupDelete]) : await projectService.deleteMemberChatGroup(chatGroupDelete)

      if (response?.statusCode === 200) {
        isHead ? socket.emit('notify_delete_chat_group',{chat_group:chat.id,head:chat.head,members:chat.members?.map(dt => dt.user)}): socket.emit('notify_leave_chat_group',{chat_group:chat.id})
      }
      setChatGroupDelete("")
    } catch (error) {
      console.error("Failed to leave/delete group:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getChatTitle = () => {
    if (chat.type === "direct") {
      return chat.user_one === currentUser ? chat.name_two : chat.name_one
    }
    return chat.name
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

  const formatDate = (date: Date) => {
    const today = new Date()
    const messageDate = new Date(date)

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }

    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const isGroupHead = chat.type === "group" && chat.head === currentUser

   const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
      const socket = getSocket();
      const data = {
        link: file,
        content:file.name,
        user:currentUser,
        chat:chat.id,
      }
      const dataGroup = {
        link: file,
        user:currentUser,
        content:file.name,
        chat_group:chat.id,
      }
      const response = chat.type === "direct" ? await projectService.createContentChats(CustomFormData(data)) : await projectService.createContentGroupChats(CustomFormData(dataGroup))
      if (response.statusCode === 201) {
        // const newMsg = response?.data
        // setMessages((prev) => [...prev, newMsg])
        if(chat.type === "direct"){
         socket.emit('notify_new_message',{chat:chat.id,user:chat.user_two,data:response.data})
        }
        if(chat.type === "group"){
         socket.emit('notify_new_message_group',{chat_group:chat.id,head:chat.head,members:chat.members?.map(dt => dt.user),data:response.data})
        }
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
    }
  };


  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarFallback>
              {getChatTitle()
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{getChatTitle()}</h2>
            {chat.type === "group" && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {chat?.members?.length || 0} members
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {chat.type === "group" && <Badge variant="secondary">Group</Badge>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {chat.type === "direct" ? (
                <>
                  <DropdownMenuItem onClick={() => setShowEditName(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Names
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  {isGroupHead && (
                    <>
                      <DropdownMenuItem onClick={() => setShowSettings(true)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Group Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowMemberManagement(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={()=> setChatGroupDelete(chat.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Group
                      </DropdownMenuItem>
                    </>
                  )}
                  {!isGroupHead && (
                    <>
                      <DropdownMenuItem onClick={() => setShowMemberManagement(true)}>
                        <Users className="w-4 h-4 mr-2" />
                        View Members
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={()=> setChatGroupDelete(chat.id)} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Leave Group
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate =
              index === 0 || formatDate(message.created_at) !== formatDate(messages[index - 1].created_at)

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center mb-4">
                    <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                )}
                <div className={`flex ${message.user === currentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.user === currentUser
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                    }`}
                  >
                    {chat.type === "group" && message.user !== currentUser && (
                      <div className="flex justify-between">
                        <div className="text-xs font-medium mb-1 opacity-70 flex items-center">{chat.members?.find(dt => dt.user === message.user)?.name ?? users?.find(dt => dt.user_id === message.user)?.first_name + " " +users?.find(dt => dt.user_id === message.user)?.last_name ?? "ADMIN"}</div>
                      </div>
                    )}
                    {chat.type === "group" && message.user === currentUser && (
                      <div className="flex justify-between">
                        <div className="text-xs font-medium mb-1 opacity-70 flex items-center">{chat.members?.find(dt => dt.user === message.user)?.name  ?? users?.find(dt => dt.user_id === message.user)?.first_name + " " +users?.find(dt => dt.user_id === message.user)?.last_name ?? "ADMIN"}</div>
                         <Trash2  className="ml-2 cursor-pointer w-4 h-4"  onClick={() => setMessageDelete(message.id)}/>
                      </div>
                    )}
                    {chat.type !== "group" && message.user === currentUser && (
                      <div className="flex justify-between">
                        <div className="text-xs font-medium mb-1 opacity-70 flex items-center">{message.user === chat.user_one ? chat.name_one:chat.name_two}</div>
                        <Trash2  className="ml-2 cursor-pointer w-4 h-4"  onClick={() => setMessageDelete(message.id)}/>
                      </div>
                    )}
                    {chat.type !== "group" && message.user !== currentUser && (
                      <div className="text-xs font-medium mb-1 opacity-70">{message.user === chat.user_one ? chat.name_one:chat.name_two}</div>
                    )}
                    {!message.link && <div className="break-words">{message.content}</div>} 
                    {/* {message.link && (
                      <div className="mt-2 p-2 bg-black bg-opacity-10 rounded text-xs">
                        <a href={message.link} target="_blank" rel="noopener noreferrer" className="underline">
                          View attachment
                        </a>
                      </div>
                    )} */}
                     {message.link && <MessageAttachment content={message.content} link={message.link} />}
                    <div className={`text-xs mt-1 ${message.user === currentUser ? "text-blue-100" : "text-gray-500"}`}>
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleFileClick}>
            <Paperclip className="w-4 h-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Dialogs */}
      {chat.type === "group" && (
        <>
          <ChatSettingsDialog
            open={showSettings}
            onOpenChange={setShowSettings}
            chat={chat}
            onChatUpdate={onChatUpdate}
            isHead={isGroupHead}
          />
          <MemberManagementDialog
            open={showMemberManagement}
            onOpenChange={setShowMemberManagement}
            chat={chat}
            users={users}
            currentUser={currentUser}
            onChatUpdate={onChatUpdate}
            isHead={isGroupHead}
          />
        </>
      )}

      {chat.type === "direct" && (
        <EditNameDialog
          open={showEditName}
          onOpenChange={setShowEditName}
          chat={chat}
          currentUser={currentUser}
          onChatUpdate={onChatUpdate}
        />
      )}
      <Modal
                  open={!(messageDelete==="")}
                  title={"Xóa dữ liệu"}
                  onOk={deleteMessage}
                  onCancel={() => {
                    setMessageDelete("");
                  }}
                >
                  Bạn có chắc chắn muốn xóa không ?
      </Modal>
       <Modal
                  open={!(chatGroupDelete==="")}
                  title={chat.type === "group"? chat.head === currentUser ? 'Xóa nhóm chat':'Rời nhóm chat':'Rời nhóm chát'}
                  onOk={handleLeaveOrDeleteGroup}
                  onCancel={() => {
                    setChatGroupDelete("");
                  }}
                >
                  Bạn có chắc chắn muốn xóa không ?
      </Modal>
    </div>
  )
}
