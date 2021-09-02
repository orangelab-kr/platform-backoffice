import { Button, Card, Col, Descriptions, Row, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Client } from '../tools';
import ReactJson from 'react-json-view';

const { Title } = Typography;

export const WebhooksDetails = withRouter(({ history }) => {
  const [request, setRequest] = useState(null);
  const { requestId } = useParams();
  const [isLoading, setLoading] = useState(false);

  const loadRequest = () => {
    if (!requestId) return;
    setLoading(true);

    Client.get(`/webhook/requests/${requestId}`).then(({ data }) => {
      setRequest(data.request);
      setLoading(false);
    });
  };

  useEffect(loadRequest, [requestId]);
  return (
    <>
      <Card>
        <Row justify="start" style={{ marginBottom: 20 }} gutter={[4, 4]}>
          <Col span={24}>
            <Row justify="space-between">
              <Col>
                <Title level={3} copyable={request}>
                  {request ? request.requestId : '로딩 중...'}
                </Title>
              </Col>
            </Row>
          </Col>
          {request && (
            <>
              <Col span={24}>
                <Card>
                  <Title level={4}>요청 정보</Title>
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="요청 일자" span={2}>
                      {dayjs(request.createdAt).format(
                        'YYYY년 M월 D일 H시 m분'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="처리 일자" span={2}>
                      {dayjs(request.completedAt).format(
                        'YYYY년 M월 D일 H시 m분'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="요청 내용">
                      <ReactJson name={false} src={JSON.parse(request.data)} />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Title level={4}>웹훅 정보</Title>
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="웹훅 타입" span={2}>
                      {request.webhook.type === 'rideEnd'
                        ? '라이드 종료'
                        : request.webhook.type === 'payment'
                        ? '결제 호출'
                        : request.webhook.type === 'refund'
                        ? '환불 호출'
                        : request.webhook.type}
                    </Descriptions.Item>
                    <Descriptions.Item label="웹훅 ID" span={2}>
                      <Text copyable={true}>{request.webhook.webhookId}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="웹훅 수정일자" span={2}>
                      {dayjs(request.webhook.updatedAt).format(
                        'YYYY년 M월 D일 H시 m분'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="웹훅 주소">
                      <Text copyable={true}>{request.webhook.url}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </>
  );
});
