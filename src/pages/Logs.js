import { Card, Result, Typography } from "antd";

import React from "react";
import { SmileOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Logs = () => {
  return (
    <>
      <Card>
        <Title level={3}>로그</Title>
        <Result icon={<SmileOutlined />} title="아직 준비중이에요." />
      </Card>
    </>
  );
};
