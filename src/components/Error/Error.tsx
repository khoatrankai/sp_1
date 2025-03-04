/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Result } from "antd";
import React from "react";

type Props = {
  handleBtn?: any;
  value?: string;
};

export default function ErrorCustomer({ handleBtn, value }: Props) {
  return (
    <Result
      status={value === "500" ? "500" : value === "403" ? "403" : "404"}
      title={value === "500" ? "500" : value === "403" ? "403" : "404"}
      subTitle={
        value === "500"
          ? "Sorry, something went wrong."
          : value === "403"
          ? "Sorry, you are not authorized to access this page."
          : "Sorry, the page you visited does not exist."
      }
      extra={
        <Button
          type="primary"
          onClick={() => {
            handleBtn();
          }}
        >
          Quay lại
        </Button>
      }
    />
  );
}
