import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Modal,
  Row,
  Table,
  Typography,
  message,
} from 'antd';
import {
  CopyOutlined,
  UserAddOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import { Client } from '../tools';
import { Link } from 'react-router-dom';
import clipboard from 'copy-to-clipboard';
import dayjs from 'dayjs';
import { withRouter } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;
const { Paragraph } = Typography;

export const AccessKeys = withRouter(({ history }) => {
  const [accessKeys, setAccessKeys] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);

  const copyKey = (value) => {
    return () => {
      clipboard(value);
      message.success('복사되었습니다.');
    };
  };

  const openKey = (value) => {
    return () => {
      Modal.info({
        title: '시크릿 키',
        okText: '확인',
        content: (
          <Paragraph onClick={copyKey(value)} style={{ margin: 0 }}>
            <Row gutter={[0, 8]}>
              <Col span={24}>
                <Alert
                  showIcon
                  message="절대로 해당 키를 유출하지 마세요."
                  type="warning"
                />
              </Col>
              <Col>
                <pre style={{ margin: 0 }}>{value}</pre>
              </Col>
            </Row>
          </Paragraph>
        ),
      });
    };
  };

  const setEnabled = async (accessKey, isEnabled) => {
    try {
      setLoading(true);
      const { platformAccessKeyId } = accessKey;
      await Client.post(`/platform/accessKeys/${platformAccessKeyId}`, {
        isEnabled,
      });

      accessKey.isEnabled = isEnabled;
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '활성화',
      dataIndex: 'isEnabled',
      render: (isEnabled, accessKey) => (
        <Checkbox
          checked={isEnabled}
          onChange={() => setEnabled(accessKey, !isEnabled)}
          style={{ marginLeft: 8 }}
        />
      ),
    },
    {
      title: '이름',
      dataIndex: 'name',
      render: (value, row) => (
        <Link to={`/accessKeys/${row.platformAccessKeyId}`}>{value}</Link>
      ),
    },
    {
      title: '액세스 키',
      dataIndex: 'platformAccessKeyId',
      render: (value) => (
        <Paragraph onClick={copyKey(value)} style={{ margin: 0 }}>
          <Row gutter={[8, 8]} align="middle">
            <Col>
              <pre style={{ margin: 0 }}>{value}</pre>
            </Col>
          </Row>
        </Paragraph>
      ),
    },
    {
      title: '시크릿 키',
      dataIndex: 'platformSecretAccessKey',
      render: (value) => (
        <Row gutter={[8, 8]}>
          <Col>
            <Button
              disabled={isLoading}
              type="primary"
              icon={<ZoomInOutlined />}
              onClick={openKey(value)}
            />
          </Col>
          <Col>
            <Button
              disabled={isLoading}
              icon={<CopyOutlined />}
              onClick={copyKey(value)}
            />
          </Col>
        </Row>
      ),
    },
    {
      title: '권한 그룹',
      dataIndex: 'permissionGroup',
      render: (permissionGroup) => (
        <Link to={`/permissionGroups/${permissionGroup.permissionGroupId}`}>
          {permissionGroup.name}
        </Link>
      ),
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const requestAccessKeys = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get('/platform/accessKeys', { params })
      .finally(() => setLoading(false))
      .then((res) => {
        const { platformAccessKeys, total } = res.data;
        setAccessKeys(platformAccessKeys);
        setTotal(total);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestAccessKeys();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestAccessKeys();
  };

  useEffect(requestAccessKeys, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>액세스 키 목록</Title>
          </Col>
          <Col>
            <Row>
              <Col>
                <Search
                  placeholder="검색"
                  onSearch={onSearch}
                  loading={isLoading}
                  enterButton
                />
              </Col>
              <Col>
                <Link to="/accessKeys/add">
                  <Button
                    icon={<UserAddOutlined />}
                    type="primary"
                    disabled={isLoading}
                  >
                    액세스 키 추가
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={accessKeys}
          rowKey="platformAccessKeyId"
          loading={isLoading}
          scroll={{ x: '100%' }}
          pagination={{
            onChange: onPagnationChange,
            onShowSizeChange: setTake,
            total,
          }}
        />
      </Card>
    </>
  );
});
