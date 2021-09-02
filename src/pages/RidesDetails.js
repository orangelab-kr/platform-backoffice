import { SmileOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Image,
  Result,
  Row,
  Typography,
} from 'antd';
import { List } from 'antd/lib/form/Form';
import Text from 'antd/lib/typography/Text';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams, withRouter } from 'react-router-dom';
import { Client } from '../tools';

const { Title } = Typography;

export const RidesDetails = withRouter(({ history }) => {
  const [ride, setRide] = useState(null);
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

  useEffect(loadRide, [rideId]);
  return (
    <>
      <Card>
        <Row justify="start" style={{ marginBottom: 20 }} gutter={[4, 4]}>
          <Col span={24}>
            <Row justify="space-between">
              <Col>
                <Title level={3} copyable={ride}>
                  {ride ? ride.rideId : '로딩 중...'}
                </Title>
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
                  <Title level={4}>라이드 정보</Title>
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
                  <Title level={4}>탑승자 정보</Title>
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
                  <Title level={4}>영수증 정보</Title>
                  <Row justify="space-between">
                    <Col span={12}>
                      {ride.terminatedAt ? (
                        <Descriptions bordered size="small">
                          <Descriptions.Item label="영수증 ID" span={3}>
                            <Text copyable={true}>
                              {ride.receipt.receiptId}
                            </Text>
                          </Descriptions.Item>

                          <Descriptions.Item label="결제 금액" span={3}>
                            {ride.receipt.price.toLocaleString()}원
                          </Descriptions.Item>
                          <Descriptions.Item label="할인 금액" span={3}>
                            -{ride.receipt.discount.toLocaleString()}원
                          </Descriptions.Item>
                          <Descriptions.Item label="총 금액" span={3}>
                            {ride.receipt.total.toLocaleString()}원
                          </Descriptions.Item>
                          <Descriptions.Item label="심야 요금" span={3}>
                            {ride.receipt.isNightly
                              ? '적용됨'
                              : '적용되지 않음'}
                          </Descriptions.Item>
                          <Descriptions.Item label="계산 일자" span={3}>
                            {dayjs(ride.receipt.updatedAt).format(
                              'YYYY년 M월 D일 H시 m분 s초'
                            )}
                          </Descriptions.Item>
                        </Descriptions>
                      ) : (
                        <Result
                          icon={<SmileOutlined />}
                          title="라이드가 종료된 후 반영됩니다."
                        />
                      )}
                    </Col>
                    <Col span={12}>
                      <InfiniteScroll initialLoad={true} loadMore={console.log}>
                        <List
                          dataSource={[
                            { id: 'asdsad', name: 'asdsad', email: 'asdasd' },
                          ]}
                          renderItem={(item) => (
                            <List.Item key={item.id}>
                              <List.Item.Meta
                                title={
                                  <a href="https://ant.design">{item.name}</a>
                                }
                                description={item.email}
                              />
                              <div>Content</div>
                            </List.Item>
                          )}
                        ></List>
                      </InfiniteScroll>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </>
  );
});
