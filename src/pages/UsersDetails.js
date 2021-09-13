import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import { Client } from '../tools';
import { PermissionGroupsSelect } from '../components';

const { Title } = Typography;

export const UsersDetails = withRouter(({ history }) => {
  const [user, setUser] = useState({ name: '로딩 중...' });
  const params = useParams();
  const userId = params.userId !== 'add' ? params.userId : '';
  const form = Form.useForm()[0];
  const [isLoading, setLoading] = useState(false);

  const loadUser = () => {
    if (!userId) return;
    setLoading(true);

    Client.get(`/platform/users/${userId}`)
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setUser(data.platformUser);
        form.setFieldsValue(data.platformUser);
      });
  };

  const deleteUser = () => {
    setLoading(true);
    Client.delete(`/platform/users/${userId}`)
      .finally(() => setLoading(false))
      .then(() => {
        message.success(`삭제되었습니다.`);
        history.push(`/dashboard/users`);
      });
  };

  const onSave = (body) => {
    setLoading(true);
    Client.post(`/platform/users/${userId}`, body)
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(`${userId ? '수정' : '생성'}되었습니다.`);
        if (data.platformUserId) {
          history.push(`/dashboard/users/${data.platformUserId}`);
        }
      });
  };

  useEffect(loadUser, [form, userId]);
  return (
    <>
      <Card>
        <Form layout="vertical" onFinish={onSave} form={form}>
          <Row justify="space-between" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={3}>{userId ? user.name : '새로운 사용자'}</Title>
            </Col>
            <Col>
              <Row gutter={[4, 0]}>
                {userId && (
                  <Col>
                    <Popconfirm
                      title="정말로 삭제하시겠습니까?"
                      okText="네"
                      cancelText="아니요"
                      onConfirm={deleteUser}
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
                    icon={userId ? <SaveOutlined /> : <PlusOutlined />}
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                  >
                    {userId ? '저장하기' : '생성하기'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form.Item name="name" label="사용자 이름">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="email" label="이메일">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="phone" label="전화번호">
            <Input disabled={isLoading} />
          </Form.Item>
          <Form.Item name="password" label="비밀번호">
            <Input.Password disabled={isLoading} />
          </Form.Item>
          <Form.Item name="permissionGroupId" label="권한 그룹">
            <PermissionGroupsSelect
              isLoading={isLoading}
              defaultPermissionGroup={user.permissionGroup}
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
});
