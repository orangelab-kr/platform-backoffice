import { Card, Col, Input, Row, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Client } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const DiscountGroups = withRouter(({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: 'UUID',
      dataIndex: 'discountGroupId',
      render: (value) => (
        <Link to={`/dashboard/discountGroups/${value}`}>{value}</Link>
      ),
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '남은 갯수',
      dataIndex: 'remainingCount',
      render: (remainingCount) => `${remainingCount.toLocaleString()}개`,
    },
    {
      title: '생성 일자',
      dataIndex: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const requestDiscountGroups = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get('/discount/discountGroups', { params })
      .finally(() => setLoading(false))
      .then((res) => {
        const { discountGroups, total } = res.data;
        setDataSource(discountGroups);
        setTotal(total);
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestDiscountGroups();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestDiscountGroups();
  };

  useEffect(requestDiscountGroups, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>할인 그룹 목록</Title>
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
});
