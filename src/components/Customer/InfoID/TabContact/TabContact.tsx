import React from "react";
import Contact from "../../Contact/Contact";

// type Props = {};

export default function TabContact() {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <p className="text-xl">Người liên hệ</p>
      <Contact />
    </div>
  );
}
