import {
  Alert,
  Button,
  Card,
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
import { PermissionsSelect } from "../components";
import clipboard from "copy-to-clipboard";

const { Title } = Typography;

export const PermissionGroupsDetails = withRouter(({ history }) => {
  const [permissionGroup, setPermissionGroup] = useState({
    name: "로딩 중...",
  });
  const params = useParams();
  const permissionGroupId =
    params.permissionGroupId !== "add" ? params.permissionGroupId : "";
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const copyKey = (value) => {
    return () => {
      clipboard(value);
      message.success("복사되었습니다.");
    };
  };

  const loadPermissionGroup = () => {
    if (!permissionGroupId) return;
    setLoading(true);

    Client.get(`/platform/permissionGroups/${permissionGroupId}`).then(
      ({ data }) => {
        const { permissionGroup } = data;

        permissionGroup.permissions = permissionGroup.permissions.map(
          ({ permissionId, name }) => ({
            key: permissionId,
            label: name,
            value: permissionId,
          })
        );

        setPermissionGroup(permissionGroup);
        form.setFieldsValue(permissionGroup);
        setLoading(false);
      }
    );
  };

  const deletePermissionGroup = () => {
    setLoading(true);
    Client.delete(`/permissionGroups/${permissionGroupId}`).then(() => {
      message.success(`삭제되었습니다.`);
      setLoading(false);
      history.push(`/dashboard/permissionGroups`);
    });
  };

  const onSave = (body) => {
    setLoading(true);
    body.permissionIds = body.permissions.map(({ value }) => value);
    delete body.permissions;
    Client.post(`/platform/permissionGroups/${permissionGroupId}`, body).then(
      ({ data }) => {
        message.success(`${permissionGroupId ? "수정" : "생성"}되었습니다.`);
        setLoading(false);

        if (data.permissionGroupId) {
          history.push(`/dashboard/permissionGroups/${data.permissionGroupId}`);
        }
      }
    );
  };

  useEffect(loadPermissionGroup, [form, permissionGroupId]);
  return (
    <>
      <Card>
        <Form layout="vertical" onFinish={onSave} form={form}>
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>
                {permissionGroupId ? permissionGroup.name : "새로운 권한 그룹"}
              </Title>
            </Col>
            {permissionGroup.platformId && (
              <>
                <Col>
                  <Row gutter={[4, 0]}>
                    {permissionGroupId && (
                      <Col>
                        <Popconfirm
                          title="정말로 삭제하시겠습니까?"
                          okText="네"
                          cancelText="아니요"
                          onConfirm={deletePermissionGroup}
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
                        icon={
                          permissionGroupId ? (
                            <SaveOutlined />
                          ) : (
                            <PlusOutlined />
                          )
                        }
                        loading={isLoading}
                        type="primary"
                        htmlType="submit"
                      >
                        {permissionGroupId ? "저장하기" : "생성하기"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </>
            )}
          </Row>
          {!isLoading && !permissionGroup.platformId && (
            <Alert
              showIcon
              style={{ marginBottom: 10 }}
              message="커스텀 그룹 권한이 아니기 때문에 수정이 불가능합니다."
              type="warning"
            />
          )}
          {permissionGroupId && (
            <Form.Item name="permissionGroupId" label="권한 그룹 ID">
              <Input
                disabled={isLoading}
                onClick={copyKey(permissionGroupId)}
                readOnly
              />
            </Form.Item>
          )}
          <Form.Item name="name" label="이름">
            <Input disabled={isLoading || !permissionGroup.platformId} />
          </Form.Item>
          <Form.Item name="description" label="설명">
            <Input disabled={isLoading || !permissionGroup.platformId} />
          </Form.Item>
          <Form.Item name="permissions" label="권한 목록">
            <PermissionsSelect
              isLoading={isLoading || !permissionGroup.platformId}
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});
