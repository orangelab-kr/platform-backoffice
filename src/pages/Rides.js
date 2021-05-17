import { ApiOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Table, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";

import { Client } from "../tools";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { withRouter } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

export const Rides = withRouter(({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);

  const columns = [
    {
      title: "UUID",
      dataIndex: "rideId",
      render: (value) => <Link to={`/dashboard/rides/${value}`}>{value}</Link>,
    },
    {
      title: "이름",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "설명",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "권한",
      dataIndex: "permissions",
      render: (permissions) => (
        <>
          {permissions.map((permission, i) => {
            if (i > 3) return <></>;
            if (i === 3) {
              return <Tag color="red">이외 {permissions.length - i}개</Tag>;
            }

            return <Tag>{permission.name}</Tag>;
          })}
        </>
      ),
    },
    {
      title: "커스텀",
      dataIndex: "platformId",
      render: (platformId) =>
        platformId && <CheckCircleOutlined style={{ color: "green" }} />,
    },
    {
      title: "생성 일자",
      dataIndex: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("YYYY년 MM월 DD일"),
    },
  ];

  const requestRides = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get("/ride/rides", { params }).then((res) => {
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
                    권한 그룹 추가
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
          scroll={{ x: "100%" }}
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
