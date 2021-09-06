import { Card, Col, Row, Typography, Table, Input, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../tools';

const { Title } = Typography;

export const Logs = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'platformLogId',
    },
    {
      title: '사용자/액세스키',
      dataIndex: 'platform',
      render: (platform, { platformUser, platformAccessKey }) => (
        <Link
          to={`/dashboard/${platformUser ? 'users' : 'accessKeys'}/${
            platformUser
              ? platformUser.platformUserId
              : platformAccessKey.platformAccessKey
          }`}
        >
          <Tag>{platformUser ? '사용자' : '액세스키'}</Tag>
          {platformUser ? platformUser.name : platformAccessKey.name}
        </Link>
      ),
    },
    {
      title: '타입',
      dataIndex: 'platformLogType',
      key: 'platformLogType',
    },
    {
      title: '메세지',
      dataIndex: 'message',
      key: 'message',
      render: (message) => (
        <Typography.Paragraph>
          <pre>{message}</pre>
        </Typography.Paragraph>
      ),
    },
    {
      title: '발생 일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 H시 M분 s초'),
    },
  ];

  const requestUsers = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get('/platform/logs', { params }).then((res) => {
      const { platformLogs, total } = res.data;
      setDataSource(platformLogs);
      setTotal(total);
      setLoading(false);
    });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestUsers();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestUsers();
  };

  useEffect(requestUsers, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>사용자 목록</Title>
          </Col>
          <Col>
            <Row>
              <Col>
                <Input.Search
                  placeholder="검색"
                  onSearch={onSearch}
                  loading={isLoading}
                  enterButton
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="platformUserId"
          loading={isLoading}
          scroll={{ x: '100%' }}
          pagination={{
            onChange: onPagnationChange,
            onShowSizeChange: true,
            total,
          }}
        />
      </Card>
    </>
  );
};
