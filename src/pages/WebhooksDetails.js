import { RedoOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { useParams, withRouter } from 'react-router-dom';
import { Client, useInterval } from '../tools';

export const WebhooksDetails = withRouter(({ history }) => {
  const [request, setRequest] = useState(null);
  const [requestHistories, setRequestHistories] = useState([]);
  const { requestId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const columns = [
    {
      title: '상세요청 ID',
      dataIndex: 'historyId',
      key: 'historyId',
    },
    {
      title: '응답 코드',
      dataIndex: 'statusCode',
      key: 'statusCode',
      render: (statusCode) => (
        <Tag color={statusCode === 200 ? 'success' : 'warning'}>
          {statusCode}
        </Tag>
      ),
    },
    {
      title: '응답',
      dataIndex: 'body',
      key: 'body',
      render: (body) => (
        <Button
          type="link"
          onClick={() =>
            Modal.info({
              title: '서버로부터 받은 응답은 아래와 같습니다.',
              content: (
                <Typography.Paragraph>
                  <pre>{body}</pre>
                </Typography.Paragraph>
              ),
            })
          }
        >
          응답({body.length}자)
        </Button>
      ),
    },
    {
      title: '요청일자',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => dayjs(createdAt).format('YYYY년 MM월 DD일'),
    },
  ];

  const loadRequest = () => {
    if (!requestId) return;
    Client.get(`/webhook/requests/${requestId}`).then(({ data }) => {
      setRequest(data.request);
    });
  };

  const loadRequestHistories = () => {
    if (!requestId) return;
    Client.get(`/webhook/requests/${requestId}/histories`).then(({ data }) => {
      setRequestHistories(data.histories);
    });
  };

  const onRetryRequest = () => {
    if (!requestId) return;
    setLoading(true);

    Client.get(`/webhook/requests/${requestId}/retry`).then(({ data }) => {
      setLoading(false);
    });
  };

  useEffect(loadRequest, [requestId]);
  useEffect(loadRequestHistories, [requestId]);
  useInterval(loadRequest, request && !request.completedAt ? 5000 : null);
  useInterval(
    loadRequestHistories,
    request && !request.completedAt ? 5000 : null
  );

  return (
    <>
      <Card>
        <Row justify="start" style={{ marginBottom: 20 }} gutter={[4, 4]}>
          <Col span={24}>
            <Row justify="space-between">
              <Col>
                <Typography.Title level={3} copyable={request}>
                  {request ? request.requestId : '로딩 중...'}
                </Typography.Title>
              </Col>
              {request && !request.completedAt && (
                <Col>
                  <Button
                    icon={<RedoOutlined />}
                    onClick={onRetryRequest}
                    loading={isLoading}
                    danger
                  >
                    재시도 요청
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
          {request && (
            <>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>요청 정보</Typography.Title>
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="요청 일자" span={2}>
                      {dayjs(request.createdAt).format(
                        'YYYY년 M월 D일 H시 m분'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="처리 일자" span={2}>
                      {request.completedAt
                        ? dayjs(request.completedAt).format(
                            'YYYY년 M월 D일 H시 m분'
                          )
                        : '처리되지 않음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="요청 내용">
                      <ReactJson
                        name={false}
                        collapsed={true}
                        src={JSON.parse(request.data)}
                      />
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>웹훅 정보</Typography.Title>
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
                      <Typography.Text copyable={true}>
                        {request.webhook.webhookId}
                      </Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="웹훅 수정일자" span={2}>
                      {dayjs(request.webhook.updatedAt).format(
                        'YYYY년 M월 D일 H시 m분'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="웹훅 주소">
                      <Typography.Text copyable={true}>
                        {request.webhook.url}
                      </Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>상세요청 기록</Typography.Title>
                  <Table columns={columns} dataSource={requestHistories} />
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </>
  );
});
