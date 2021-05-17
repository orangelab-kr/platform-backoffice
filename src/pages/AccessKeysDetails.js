import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";

import { Client } from "../tools";
import { PermissionGroupsSelect } from "../components";
import clipboard from "copy-to-clipboard";

const { Title } = Typography;

export const AccessKeysDetails = withRouter(({ history }) => {
  const [accessKey, setAccessKey] = useState({ name: "로딩 중..." });
  const [enabled, setEnabled] = useState(true);
  const params = useParams();
  const accessKeyId =
    params.platformAccessKeyId !== "add" ? params.platformAccessKeyId : "";
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const copyKey = (value) => {
    return () => {
      clipboard(value);
      message.success("복사되었습니다.");
    };
  };

  const loadAccessKey = () => {
    if (!accessKeyId) return;
    setLoading(true);

    Client.get(`/platform/accessKeys/${accessKeyId}`).then(({ data }) => {
      setAccessKey(data.platformAccessKey);
      form.setFieldsValue(data.platformAccessKey);
      setEnabled(data.platformAccessKey.isEnabled);
      setLoading(false);
    });
  };

  const deleteAccessKey = () => {
    setLoading(true);
    Client.delete(`/platform/accessKeys/${accessKeyId}`).then(() => {
      message.success(`삭제되었습니다.`);
      setLoading(false);
      history.push(`/dashboard/accessKeys`);
    });
  };

  const onSave = (body) => {
    setLoading(true);
    Client.post(`/platform/accessKeys/${accessKeyId}`, body).then(
      ({ data }) => {
        message.success(`${accessKeyId ? "수정" : "생성"}되었습니다.`);
        setLoading(false);

        if (data.platformAccessKeyId) {
          history.push(`/dashboard/accessKeys/${data.platformAccessKeyId}`);
        }
      }
    );
  };

  useEffect(loadAccessKey, [form, accessKeyId]);
  return (
    <>
      <Card>
        <Form
          layout="vertical"
          onFinish={onSave}
          form={form}
          initialValues={{ isEnabled: true }}
        >
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>
                {accessKeyId ? accessKey.name : "새로운 액세스 키"}
              </Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {accessKeyId && (
                  <Col>
                    <Popconfirm
                      title="정말로 삭제하시겠습니까?"
                      okText="네"
                      cancelText="아니요"
                      onConfirm={deleteAccessKey}
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        loading={isLoading}
                        type="primary"
                        danger
                      />
                    </Popconfirm>
                  </Col>
                )}
                <Col>
                  <Button
                    icon={accessKeyId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    {accessKeyId ? "저장하기" : "생성하기"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name="isEnabled" valuePropName="checked">
            <Checkbox
              disabled={isLoading}
              onChange={({ target }) => setEnabled(target.checked)}
            >
              {enabled ? "활성화됨" : "비활성화됨"}
            </Checkbox>
          </Form.Item>
          <Form.Item name="name" label="이름">
            <Input disabled={isLoading} />
          </Form.Item>
          {accessKeyId && (
            <>
              <Form.Item name="platformAccessKeyId" label="액세스 키">
                <Input
                  disabled={isLoading}
                  onClick={copyKey(accessKey.platformAccessKeyId)}
                  readOnly
                />
              </Form.Item>
              <Form.Item name="platformSecretAccessKey" label="시크릿 키">
                <Input
                  disabled={isLoading}
                  onClick={copyKey(accessKey.platformSecretAccessKey)}
                  readOnly
                />
              </Form.Item>
            </>
          )}
          <Form.Item name="permissionGroupId" label="권한 그룹">
            <PermissionGroupsSelect isLoading={isLoading} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});
