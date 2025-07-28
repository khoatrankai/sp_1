/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
}

export interface Chat {
  id: string
  name_one: string
  name_two: string
  user_one: string
  user_two: string
  type: "direct"
  contents?:Message[]
  created_at?:string
}

export interface ChatGroup {
  id: string
  name: string
  description: string
  head: string
  type: "group"
  contents?:Message[]
  members?: any[]
  created_at?:string
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