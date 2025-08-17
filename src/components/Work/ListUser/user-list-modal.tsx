/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { X, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserActions } from "@/components/Work/ListUser/user-actions"
import { useEffect, useState } from "react"
import activityService from "@/services/activityService"

interface UserListModalProps {
  isOpen: boolean
  onClose: () => void
  work: string
}

export function UserListModal({ isOpen, onClose, work }: UserListModalProps) {
  const [dataWork,setDataWork] = useState<any>()
  const fetchData = async()=>{
    const res = await activityService.getWorkById(work)
    if(res.statusCode === 200){
      setDataWork(res.data)
    }
  }
  useEffect(()=>{
    if(work)
    fetchData()
  },[work])
  if (!isOpen) return null
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={onClose} />

      {/* Slide Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Danh sách nhân viên</h2>
              <p className="text-sm text-muted-foreground">{dataWork?.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{dataWork?.list_user?.length} nhân viên được phân công</span>
            </div>
          </div>

          <div className="space-y-4">
            {dataWork?.list_user?.map((userWork:any) => (
              <div
                key={userWork?.user_id}
                className="p-4 bg-card border rounded-xl hover:shadow-md transition-all duration-200 hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 ring-2 ring-primary/10">
                    <AvatarImage src={userWork?.picture_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {userWork?.first_name.charAt(0)}
                      {userWork?.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-base">
                          {userWork?.first_name} {userWork?.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{userWork?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {userWork?.user_id}</p>
                      </div>

                      <UserActions
                        workId={dataWork?.work_id}
                        userId={userWork?.user_id}
                        userName={`${userWork?.first_name} ${userWork?.last_name}`}
                        listId={userWork?.list_id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {dataWork?.list_user?.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Chưa có nhân viên</h3>
                <p className="text-muted-foreground">Chưa có nhân viên nào được phân công cho công việc này</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
