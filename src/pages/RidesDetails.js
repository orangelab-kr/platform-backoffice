import { PlusOutlined, SmileOutlined, StopOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Radio,
  Result,
  Row,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  Marker,
  NaverMap,
  Polyline,
  RenderAfterNavermapsLoaded,
} from 'react-naver-maps';
import { useParams, withRouter } from 'react-router-dom';
import { Client, useInterval } from '../tools';

export const RidesDetails = withRouter(() => {
  const [ride, setRide] = useState(null);
  const [ridePayments, setRidePayments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const addPaymentForm = useForm()[0];
  const params = useParams();
  const rideId = params.rideId !== 'add' ? params.rideId : '';
  const [isLoading, setLoading] = useState(false);

  const loadRide = () => {
    if (!rideId) return;
    setLoading(true);

    Client.get(`/ride/rides/${rideId}`).then(({ data }) => {
      setRide(data.ride);
      setLoading(false);
    });
  };

  const loadRidePayments = () => {
    setLoading(true);

    Client.get(`/ride/rides/${rideId}/payments`).then(({ data }) => {
      setRidePayments(data.payments);
      setLoading(false);
    });
  };

  const onReceiptChange = (key) => {
    if (key !== 'histories') return;
    loadRidePayments();
  };

  const onInfoChange = (key) => {
    if (key !== 'timeline') return;
    getTimeline();
  };

  const refundRidePayment = (paymentId) => {
    setLoading(true);

    Client.delete(`/ride/rides/${rideId}/payments/${paymentId}`).then(() => {
      loadRidePayments();
      setLoading(false);
    });
  };

  const onAddPayment = (paymentInfo) => {
    setLoading(true);

    Client.post(`/ride/rides/${rideId}/payments`, paymentInfo).then(() => {
      loadRidePayments();
      setLoading(false);
      setShowAddPayment(false);
    });
  };

  const getTimeline = () => {
    setLoading(true);

    Client.get(`/ride/rides/${rideId}/timeline`).then(({ data }) => {
      setTimeline(data.timeline);
      setLoading(false);
    });
  };

  useEffect(loadRide, [rideId]);
  useInterval(loadRide, ride && !ride.terminatedAt ? 5000 : null);
  return (
    <>
      <RenderAfterNavermapsLoaded ncpClientId="nd1nqudj4x">
        <Card>
          <Row justify="start" style={{ marginBottom: 20 }} gutter={[4, 4]}>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <Typography.Title level={3} copyable={ride}>
                    {ride ? ride.rideId : '로딩 중...'}
                  </Typography.Title>
                </Col>
                <Col>
                  <Button>asdasd</Button>
                  <Button>asdasd</Button>
                  <Button>asdasd</Button>
                </Col>
              </Row>
            </Col>
            {ride && (
              <>
                <Col span={24}>
                  <Card>
                    <Typography.Title level={4}>라이드 정보</Typography.Title>
                    <Tabs defaultActiveKey="info" onChange={onInfoChange}>
                      <Tabs.TabPane tab="기본 정보" key="info">
                        <Descriptions bordered size="small">
                          <Descriptions.Item label="현재 상태" span={2}>
                            {!ride.terminatedAt ? (
                              <Badge status="processing" text="탑승 중..." />
                            ) : (
                              <Badge status="success" text="종료됨" />
                            )}
                          </Descriptions.Item>

                          <Descriptions.Item label="킥보드 코드" span={2}>
                            <Typography.Text copyable={true}>
                              {ride.kickboardCode}
                            </Typography.Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="시작 일자" span={2}>
                            {dayjs(ride.startedAt).format(
                              'YYYY년 M월 D일 H시 m분 s초'
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="종료 일자" span={2}>
                            {ride.terminatedAt
                              ? dayjs(ride.terminatedAt).format(
                                  'YYYY년 M월 D일 H시 m분 s초'
                                )
                              : '라이드 중...'}
                          </Descriptions.Item>
                          <Descriptions.Item label="시작 위치" span={2}>
                            {ride.startedKickboardLocation ? (
                              <NaverMap
                                id="started-location"
                                style={{
                                  width: '100%',
                                  height: '300px',
                                }}
                                defaultZoom={13}
                                center={
                                  new window.naver.maps.LatLng(
                                    ride.startedKickboardLocation.latitude,
                                    ride.startedKickboardLocation.longitude
                                  )
                                }
                              >
                                <Marker
                                  position={
                                    new window.naver.maps.LatLng(
                                      ride.startedKickboardLocation.latitude,
                                      ride.startedKickboardLocation.longitude
                                    )
                                  }
                                />
                              </NaverMap>
                            ) : (
                              '위치 정보 없음'
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="반납 위치" span={2}>
                            {!ride.terminatedAt ? (
                              '라이드 중...'
                            ) : ride.terminatedKickboardLocation ? (
                              <NaverMap
                                id="terminated-location"
                                style={{
                                  width: '100%',
                                  height: '300px',
                                }}
                                defaultZoom={13}
                                center={
                                  new window.naver.maps.LatLng(
                                    ride.terminatedKickboardLocation.latitude,
                                    ride.terminatedKickboardLocation.longitude
                                  )
                                }
                              >
                                <Marker
                                  position={
                                    new window.naver.maps.LatLng(
                                      ride.terminatedKickboardLocation.latitude,
                                      ride.terminatedKickboardLocation.longitude
                                    )
                                  }
                                />
                              </NaverMap>
                            ) : (
                              '위치 정보 없음'
                            )}
                          </Descriptions.Item>
                          <Descriptions.Item label="반납 사진" span={3}>
                            {!ride.terminatedAt ? (
                              '라이드 중...'
                            ) : ride.photo ? (
                              <Image
                                src={ride.photo}
                                width={100}
                                alt="이미지를 로드할 수 없음"
                              />
                            ) : (
                              '업로드 하지 않음'
                            )}
                          </Descriptions.Item>
                        </Descriptions>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="이동 기록" key="timeline">
                        {timeline && (
                          <NaverMap
                            id="timeline"
                            style={{
                              width: '100%',
                              height: '400px',
                            }}
                            defaultZoom={10}
                          >
                            <Polyline
                              path={[
                                ...timeline.map(
                                  ({ latitude, longitude }) =>
                                    new window.naver.maps.LatLng(
                                      latitude,
                                      longitude
                                    )
                                ),
                              ]}
                              strokeColor={'#5347AA'}
                              strokeStyle={'solid'}
                              strokeOpacity={0.5}
                              strokeWeight={5}
                            />
                          </NaverMap>
                        )}
                      </Tabs.TabPane>
                    </Tabs>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Typography.Title level={4}>탑승자 정보</Typography.Title>
                    <Descriptions bordered size="small">
                      <Descriptions.Item label="이름">
                        {ride.realname}
                      </Descriptions.Item>
                      <Descriptions.Item label="전화번호">
                        {ride.phone}
                      </Descriptions.Item>
                      <Descriptions.Item label="생년월일">
                        {dayjs(ride.birthday).format('YYYY년 MM월 DD일')}
                      </Descriptions.Item>
                      <Descriptions.Item label="사용자 ID" span={2}>
                        <Typography.Text copyable={true}>
                          {ride.userId}
                        </Typography.Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="보험 ID">
                        <Typography.Text copyable={ride.insuranceId}>
                          {ride.insuranceId || '보험이 신청되지 않음'}
                        </Typography.Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Row justify="space-between">
                      <Col>
                        <Typography.Title level={4}>결제 정보</Typography.Title>
                      </Col>
                      <Col>
                        <Button
                          style={{ margin: 3 }}
                          icon={<PlusOutlined />}
                          onClick={() => setShowAddPayment(true)}
                        >
                          추가 결제
                        </Button>
                        <Modal
                          title="추가 결제"
                          visible={showAddPayment}
                          okText="추가 결제"
                          cancelText="취소"
                          onOk={addPaymentForm.submit}
                          onCancel={() => setShowAddPayment(false)}
                        >
                          <Form
                            layout="vertical"
                            form={addPaymentForm}
                            onFinish={onAddPayment}
                            okText="추가"
                            initialValues={{
                              paymentType: 'SERVICE',
                              amount: 1000,
                              description: '관리자에 의해 결제되었습니다.',
                            }}
                          >
                            <Row gutter={[4, 0]}>
                              <Col>
                                <Form.Item
                                  name="paymentType"
                                  label="결제 타입:"
                                  required
                                >
                                  <Radio.Group>
                                    <Radio.Button value="SERVICE">
                                      서비스 금액
                                    </Radio.Button>
                                    <Radio.Button value="SURCHARGE">
                                      추가 금액
                                    </Radio.Button>
                                  </Radio.Group>
                                </Form.Item>
                              </Col>

                              <Col flex="auto">
                                <Form.Item
                                  name="amount"
                                  label="금액:"
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message: '반드시 금액을 입력해주세요.',
                                    },
                                    {
                                      type: 'number',
                                      min: 500,
                                      message:
                                        '500원 이상부터 결제가 가능합니다.',
                                    },
                                    {
                                      type: 'number',
                                      max: 1000000,
                                      message:
                                        '1,000,000원 금액을 초과할 수 없습니다.',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    keyboard={false}
                                    controls={false}
                                    placeholder="결제 금액"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row justify="start" gutter={[4, 0]}>
                              <Col flex="auto">
                                <Form.Item
                                  name="description"
                                  label="결제 내용:"
                                  required
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        '결제 내용을 반드시 입력해주세요.',
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="결제 내용을 입력하세요."
                                    disabled={isLoading}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </Modal>
                        <Popconfirm
                          title="정말로 모두 환불하시겠습니까?"
                          disabled={isLoading}
                          onConfirm={() => refundRidePayment('')}
                          okText="전체 환불"
                          cancelText="취소"
                        >
                          <Button
                            icon={<StopOutlined />}
                            style={{ margin: 3 }}
                            danger
                          >
                            환불
                          </Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                    {ride.terminatedAt ? (
                      <Tabs
                        defaultActiveKey="receipt"
                        onChange={onReceiptChange}
                      >
                        <Tabs.TabPane tab="영수증" key="receipt">
                          <Descriptions bordered size="small">
                            <Descriptions.Item label="영수증 ID" span={2}>
                              <Typography.Text copyable={true}>
                                {ride.receipt.receiptId}
                              </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="심야 요금" span={1}>
                              {ride.receipt.isNightly ? '적용 됨' : '적용 안됨'}
                            </Descriptions.Item>

                            <Descriptions.Item
                              label="기본요금 결제 금액"
                              span={1}
                            >
                              {ride.receipt.standard.price.toLocaleString()}원
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="기본요금 할인 금액"
                              span={1}
                            >
                              -{ride.receipt.standard.discount.toLocaleString()}
                              원
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="기본요금 최종 금액"
                              span={1}
                            >
                              {ride.receipt.standard.total.toLocaleString()}원
                            </Descriptions.Item>

                            <Descriptions.Item
                              label="분당요금 결제 금액"
                              span={1}
                            >
                              {ride.receipt.perMinute.price.toLocaleString()}원
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="분당요금 할인 금액"
                              span={1}
                            >
                              -
                              {ride.receipt.perMinute.discount.toLocaleString()}
                              원
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="분당요금 최종 금액"
                              span={1}
                            >
                              {ride.receipt.perMinute.total.toLocaleString()}원
                            </Descriptions.Item>

                            <Descriptions.Item
                              label="추가요금 결제 금액"
                              span={1}
                            >
                              {ride.receipt.surcharge.price.toLocaleString()}원
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="추가요금 할인 금액"
                              span={1}
                            >
                              -
                              {ride.receipt.surcharge.discount.toLocaleString()}
                              원
                            </Descriptions.Item>
                            <Descriptions.Item
                              label="추가요금 최종 금액"
                              span={1}
                            >
                              {ride.receipt.surcharge.total.toLocaleString()}원
                            </Descriptions.Item>
                            <Descriptions.Item label="전체 결제 금액" span={1}>
                              {ride.receipt.price.toLocaleString()}원
                            </Descriptions.Item>
                            <Descriptions.Item label="전체 할인 금액" span={1}>
                              -{ride.receipt.discount.toLocaleString()}원
                            </Descriptions.Item>
                            <Descriptions.Item label="최종 금액" span={1}>
                              {ride.receipt.total.toLocaleString()}원
                            </Descriptions.Item>
                            <Descriptions.Item label="계산 일자" span={3}>
                              {dayjs(ride.receipt.updatedAt).format(
                                'YYYY년 M월 D일 H시 m분 s초'
                              )}
                            </Descriptions.Item>
                          </Descriptions>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="결제 내역" key="histories">
                          <List
                            loading={isLoading}
                            itemLayout="vertical"
                            dataSource={ridePayments}
                            bordered
                            renderItem={(payment) => (
                              <List.Item>
                                <Row justify="space-between">
                                  <Col>
                                    <Typography.Title
                                      level={5}
                                      copyable={true}
                                      delete={payment.refundedAt}
                                    >
                                      {payment.amount.toLocaleString()}원
                                    </Typography.Title>
                                  </Col>
                                  <Col>
                                    {payment.paymentType === 'SERVICE' ? (
                                      <Tag
                                        color="success"
                                        style={{ margin: 0 }}
                                      >
                                        서비스 요금
                                      </Tag>
                                    ) : (
                                      <Tag
                                        color="processing"
                                        style={{ margin: 0 }}
                                      >
                                        추가 요금
                                      </Tag>
                                    )}
                                  </Col>
                                </Row>
                                <Row justify="space-between">
                                  <Col>
                                    <Col>
                                      <b>처리 시점: </b>
                                      <Typography.Text copyable={true}>
                                        {dayjs(ride.processedAt).format(
                                          'M월 D일 H시 m분 s초'
                                        )}
                                      </Typography.Text>
                                    </Col>
                                  </Col>
                                  <Col>
                                    <Popconfirm
                                      title="정말로 환불하시겠습니까?"
                                      disabled={isLoading || payment.refundedAt}
                                      onConfirm={() =>
                                        refundRidePayment(payment.paymentId)
                                      }
                                      okText="환불"
                                      cancelText="취소"
                                    >
                                      <Button
                                        size="small"
                                        icon={<StopOutlined />}
                                        disabled={payment.refundedAt}
                                        danger
                                      >
                                        {!payment.refundedAt
                                          ? '환불'
                                          : dayjs(ride.processedAt).format(
                                              '환불됨: M월 D일 H시 m분 s초'
                                            )}
                                      </Button>
                                    </Popconfirm>
                                  </Col>
                                </Row>
                              </List.Item>
                            )}
                          />
                        </Tabs.TabPane>
                      </Tabs>
                    ) : (
                      <Result
                        icon={<SmileOutlined />}
                        title="라이드가 종료된 후 반영됩니다."
                      />
                    )}
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </Card>
      </RenderAfterNavermapsLoaded>
    </>
  );
});
