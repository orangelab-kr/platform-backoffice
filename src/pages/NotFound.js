import React from "react";
import { Result } from "antd";

export const NotFound = () => {
  return (
    <Result
      status="404"
      title="죄송합니다."
      subTitle="페이지를 찾을 수 없습니다."
    />
  );
};
