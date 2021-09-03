import { SmileOutlined, StopOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  List,
  Popconfirm,
  Result,
  Row,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import Text from 'antd/lib/typography/Text';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Client, useInterval } from '../tools';

export const RidesDetails = withRouter(() => {
  const [ride, setRide] = useState(null);
  const [ridePayments, setRidePayments] = useState([]);
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

  const refundRidePayment = (paymentId) => {
    setLoading(true);

    Client.delete(`/ride/rides/${rideId}/payments/${paymentId}`).then(() => {
      loadRidePayments();
      setLoading(false);
    });
  };

  useEffect(loadRide, [rideId]);
  useInterval(loadRide, ride && !ride.terminatedAt ? 5000 : null);
  return (
    <>
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
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="현재 상태" span={2}>
                      {!ride.terminatedAt ? (
                        <Badge status="processing" text="탑승 중..." />
                      ) : (
                        <Badge status="success" text="탑승 종료됨" />
                      )}
                    </Descriptions.Item>

                    <Descriptions.Item label="킥보드 코드" span={2}>
                      <Text copyable={true}>{ride.kickboardCode}</Text>
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
                    <Descriptions.Item label="반납 사진" span={2}>
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
                      <Text copyable={true}>{ride.userId}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="보험 ID">
                      <Text copyable={ride.insuranceId}>
                        {ride.insuranceId || '보험이 신청되지 않음'}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>결제 정보</Typography.Title>
                  {ride.terminatedAt ? (
                    <Tabs defaultActiveKey="receipt" onChange={onReceiptChange}>
                      <Tabs.TabPane tab="영수증" key="receipt">
                        <Descriptions bordered size="small">
                          <Descriptions.Item label="영수증 ID" span={2}>
                            <Text copyable={true}>
                              {ride.receipt.receiptId}
                            </Text>
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
                            -{ride.receipt.standard.discount.toLocaleString()}원
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
                            -{ride.receipt.perMinute.discount.toLocaleString()}
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
                            -{ride.receipt.surcharge.discount.toLocaleString()}
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
                                    <Tag color="success" style={{ margin: 0 }}>
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
                                    <Text copyable={true}>
                                      {dayjs(ride.processedAt).format(
                                        'M월 D일 H시 m분 s초'
                                      )}
                                    </Text>
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
    </>
  );
});
