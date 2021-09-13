import { ApiOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Marker, NaverMap } from 'react-naver-maps';
import { Link, withRouter } from 'react-router-dom';
import { Client } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const Rides = withRouter(({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showStartForm, setShowStartForm] = useState(false);
  const [useDiscount, setUseDiscount] = useState(false);
  const [startLocation, setStartLocation] = useState(
    new window.naver.maps.LatLng(37.505293790833925, 127.05486238002776)
  );

  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const startForm = useForm()[0];

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
          <Badge status="success" text="종료됨" />
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
      render: (price, { terminatedAt }) =>
        terminatedAt ? `${price.toLocaleString()}원` : '',
    },
    {
      title: '할인',
      dataIndex: 'discountId',
      render: (discountId) => (discountId ? '사용됨' : '사용하지 않음'),
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

    Client.get('/ride/rides', { params })
      .finally(() => setLoading(false))
      .then((res) => {
        const { rides, total } = res.data;
        setDataSource(rides);
        setTotal(total);
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

  const onStartRide = ({
    kickboardCode,
    discountGroupId,
    discountId,
    userId,
    realname,
    phone,
    birthday,
  }) => {
    setLoading(true);
    if (!discountGroupId || !discountId) {
      discountGroupId = undefined;
      discountId = undefined;
    }

    const body = {
      kickboardCode,
      discountGroupId,
      discountId,
      userId,
      realname,
      phone,
      latitude: startLocation._lat,
      longitude: startLocation._lng,
      birthday: birthday.format('YYYY-MM-DD'),
    };

    Client.post(`/ride/rides`, body)
      .finally(() => setLoading(false))
      .then(() => {
        setShowStartForm(false);
        requestRides();
      });
  };

  useEffect(requestRides, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>라이드 목록</Title>
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
                <Button
                  icon={<ApiOutlined />}
                  onClick={() => setShowStartForm(true)}
                  type="primary"
                  disabled={isLoading}
                >
                  라이드 시작
                </Button>
                {showStartForm && (
                  <Modal
                    title="라이드 시작"
                    visible={showStartForm}
                    okType="primary"
                    okText="라이드 시작"
                    cancelText="취소"
                    onOk={startForm.submit}
                    onCancel={() => setShowStartForm(false)}
                  >
                    <Form
                      layout="vertical"
                      form={startForm}
                      onFinish={onStartRide}
                    >
                      <Row gutter={[4, 4]}>
                        <Col span={24}>
                          <NaverMap
                            id="terminate-location"
                            style={{
                              width: '100%',
                              height: '300px',
                            }}
                            defaultZoom={13}
                            center={startLocation}
                            onCenterChanged={setStartLocation}
                          >
                            <Marker position={startLocation} />
                          </NaverMap>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            label="킥보드 코드:"
                            name="kickboardCode"
                            required
                            rules={[
                              {
                                required: true,
                                message: '킥보드 코드를 반드시 입력해주세요.',
                              },
                              {
                                len: 6,
                                message: '올바른 킥보드 코드를 입력해주세요.',
                              },
                            ]}
                          >
                            <Input
                              disabled={isLoading}
                              placeholder="ex. DE20KP"
                            />
                          </Form.Item>
                        </Col>

                        <Col span={16}>
                          <Form.Item
                            label="사용자 ID:"
                            name="userId"
                            required
                            rules={[
                              {
                                required: true,
                                message: '사용자 ID를 반드시 입력해주세요.',
                              },
                            ]}
                          >
                            <Input
                              disabled={isLoading}
                              placeholder="플랫폼 사에서 사용하는 사용자 ID를 입력해주세요."
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item
                            label="할인 그룹 ID:"
                            name="discountGroupId"
                            onChange={({ target }) =>
                              setUseDiscount(!!target.value)
                            }
                            rules={[
                              {
                                pattern:
                                  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
                                message: '올바른 할인 그룹 ID를 입력해주세요.',
                              },
                            ]}
                          >
                            <Input
                              disabled={isLoading}
                              placeholder="할인 그룹 ID를 입력해주세요."
                            />
                          </Form.Item>
                        </Col>

                        {useDiscount && (
                          <Col span={24}>
                            <Form.Item
                              label="할인 ID:"
                              name="discountId"
                              rules={[
                                {
                                  required: true,
                                  message: '할인 ID는 필수입니다.',
                                },
                                {
                                  pattern:
                                    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
                                  message: '올바른 할인 ID를 입력해주세요.',
                                },
                              ]}
                            >
                              <Input
                                disabled={isLoading}
                                placeholder="할인 ID를 입력해주세요."
                              />
                            </Form.Item>
                          </Col>
                        )}

                        <Col span={24}>
                          <Form.Item
                            label="이름:"
                            name="realname"
                            required
                            rules={[
                              {
                                min: 2,
                                message:
                                  '이름은 반드시 2자리 이상이여야 합니다.',
                              },
                            ]}
                          >
                            <Input
                              disabled={isLoading}
                              placeholder="보험 처리를 위한 이름을 입력해주세요."
                            />
                          </Form.Item>
                        </Col>

                        <Col span={16}>
                          <Form.Item
                            label="전화번호:"
                            name="phone"
                            required
                            rules={[
                              {
                                required: true,
                                message: '전화번호를 반드시 입력해주세요.',
                              },
                              {
                                pattern: /^\+(\d*)$/,
                                message:
                                  '+로 시작하는 전화번호를 입력해주세요.',
                              },
                            ]}
                          >
                            <Input
                              disabled={isLoading}
                              placeholder="보험 처리를 위한 전화번호를 입력해주세요."
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <Form.Item
                            name="birthday"
                            label="생년월일:"
                            placeholder="보험 처리를 위한 생년월일을 입력해주세요."
                            required
                            rules={[
                              {
                                required: true,
                                message: '생년월일을 반드시 입력해주세요.',
                              },
                            ]}
                          >
                            <DatePicker
                              format="YYYY/MM/DD"
                              placeholder="생년월일"
                              defaultPickerValue={moment('2000-01-01')}
                              disabled={isLoading}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Modal>
                )}
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
