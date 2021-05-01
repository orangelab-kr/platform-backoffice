import { Button, Col, Form, Input, Row } from "antd";
import { Client, getAccessKey } from "../tools";

import React from "react";
import { withRouter } from "react-router";

export const Login = withRouter(({ history }) => {
  if (getAccessKey()) history.push("/dashboard");
  const onFinish = async (body) => {
    const { data } = await Client.post("/auth/email", body);
    localStorage.setItem("sessionId", data.sessionId);
    history.push("/");
  };

  return (
    <Row style={{ height: "100vh" }} justify="center" align="middle">
      <Col lg={8} sm={12} align="center">
        <Form name="basic" layout="vertical" size="large" onFinish={onFinish}>
          <Form.Item label="이메일" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="비밀번호" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" htmlType="submit">
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
});
