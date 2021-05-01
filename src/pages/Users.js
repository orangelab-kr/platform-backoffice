import { Button, Card, Col, Input, Row, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";

import { Client } from "../tools";
import { Link } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import { withRouter } from "react-router";

const { Title } = Typography;
const { Search } = Input;

export const Users = withRouter(({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: "UUID",
      dataIndex: "platformUserId",
      render: (value) => <Link to={`/dashboard/users/${value}`}>{value}</Link>,
    },
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "전화번호",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  const requestUsers = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get("/users", { params }).then((res) => {
      if (!res) return;
      const { platformUsers, total } = res.data;
      setDataSource(platformUsers);
      setTotal(total);
      setLoading(false);
    });
  };

  const onPagnationChange = (page, pageSize) => {
    console.log(page, pageSize);
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
                <Search
                  placeholder="검색"
                  onSearch={onSearch}
                  loading={isLoading}
                  enterButton
                />
              </Col>
              <Col>
                <Link to="/dashboard/users/add">
                  <Button icon={<UserAddOutlined />} type="primary">
                    사용자 추가
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="platformUserId"
          loading={isLoading}
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
