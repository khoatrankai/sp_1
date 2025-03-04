/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Result } from "antd";
import React from "react";

export default function Forbiden() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary">Quay lại</Button>}
    />
  );
}
