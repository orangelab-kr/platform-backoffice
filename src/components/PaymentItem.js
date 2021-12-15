import { StopOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

export const PaymentItem = ({ payment, showRefundModel }) => {
  const {
    amount,
    initialAmount,
    paymentType,
    createdAt,
    processedAt,
    refundedAt,
    description,
  } = payment;

  return (
    <List.Item>
      <Row justify="space-between">
        <Col>
          {refundedAt ? (
            <Tag>
              <del>{initialAmount.toLocaleString()}원</del>
              {amount > 0 ? `➡️ ${amount.toLocaleString()}원` : ''}
            </Tag>
          ) : (
            <Tag>{amount.toLocaleString()}원</Tag>
          )}
          {description && (
            <Typography.Title level={5} style={{ display: 'inline' }}>
              {description}
            </Typography.Title>
          )}
        </Col>
        <Col>
          {paymentType === 'SERVICE' ? (
            <Tag color="success" style={{ margin: 0 }}>
              서비스 요금
            </Tag>
          ) : paymentType === 'SURCHARGE' ? (
            <Tag color="processing" style={{ margin: 0 }}>
              추가 요금
            </Tag>
          ) : (
            <Tag>{paymentType}</Tag>
          )}
        </Col>
      </Row>
      <Row justify="space-between">
        <Col>
          <Row>
            <Col span={24}>
              <b>요청 시점: </b>
              <Typography.Text copyable={true}>
                {dayjs(createdAt).format('M월 D일 H시 m분')}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <b>처리 시점: </b>
              <Typography.Text copyable={true}>
                {processedAt
                  ? dayjs(processedAt).format('M월 D일 H시 m분')
                  : '처리되지 않음'}
              </Typography.Text>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button
            size="small"
            icon={<StopOutlined />}
            disabled={refundedAt && !amount}
            onClick={showRefundModel}
            danger
          >
            {!refundedAt
              ? '환불'
              : (amount > 0 ? '부분 환불됨' : '환불됨') +
                dayjs(refundedAt).format(': M월 D일 H시 m분')}
          </Button>
        </Col>
      </Row>
    </List.Item>
  );
};
