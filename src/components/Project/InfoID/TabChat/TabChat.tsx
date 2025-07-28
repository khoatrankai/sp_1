
import React from "react";
import ChatProject from '@/components/Chat'
// type Props = {};

export default function TabChat() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Nhắn tin dự án</p>
      <ChatProject />
    </div>
  );
}
