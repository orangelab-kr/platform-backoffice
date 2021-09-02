import { ApiOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Row,
  Table, Typography
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Client } from '../tools';


const { Title } = Typography;
const { Search } = Input;

export const Rides = withRouter(({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);

  const columns = [
    {
      title: 'UUID',
      dataIndex: 'rideId',
      render: (value) => <Link to={`/dashboard/rides/${value}`}>{value}</Link>,
    },
    {
      title: '현재 상태',
      dataIndex: 'terminatedAt',
      render: (terminatedAt) =>
        !terminatedAt ? (
          <Badge status="processing" text="탑승 중..." />
        ) : (
          <Badge status="success" text="탑승 종료됨" />
        ),
    },
    {
      title: '시작 일자',
      dataIndex: 'startedAt',
      render: (startedAt) => dayjs(startedAt).format('YYYY년 M월 D일 H시 m분'),
    },
    {
      title: '킥보드 코드',
      dataIndex: 'kickboardCode',
      key: 'kickboardCode',
    },
    {
      title: '이름',
      dataIndex: 'realname',
      key: 'realname',
    },
    {
      title: '전화번호',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '가격',
      dataIndex: 'price',
      render: (price) => `${price.toLocaleString()}원`,
    },
    {
      title: '쿠폰',
      dataIndex: 'discountId',
      render: (discountId) => (discountId ? '쿠폰 사용됨' : '사용하지 않음'),
    },
    {
      title: '종료 방식',
      dataIndex: 'terminatedType',
      render: (terminatedType) =>
        terminatedType === 'USER_REQUESTED'
          ? '사용자 요청'
          : terminatedType === 'ADMIN_REQUESTED'
          ? '관리자 요청'
          : terminatedType === 'UNUSED'
          ? '자동 종료'
          : '',
    },
    {
      title: '종료 일자',
      dataIndex: 'terminatedAt',
      render: (terminatedAt) =>
        terminatedAt ? dayjs(terminatedAt).format('HH시 mm분') : '',
    },
  ];

  const requestRides = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get('/ride/rides', { params }).then((res) => {
      const { rides, total } = res.data;
      setDataSource(rides);
      setTotal(total);
      setLoading(false);
    });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestRides();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestRides();
  };

  useEffect(requestRides, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>권한 그룹 목록</Title>
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
                <Link to="/dashboard/rides/add">
                  <Button
                    icon={<ApiOutlined />}
                    type="primary"
                    disabled={isLoading}
                  >
                    라이드 시작
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="rideId"
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
});
