import { SaveOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Row,
  Table,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Client } from '../tools';

const { Title } = Typography;
const { Search } = Input;

export const Webhooks = withRouter(({ history }) => {
  const form = Form.useForm()[0];
  const [dataSource, setDataSource] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);
  const columns = [
    {
      title: '요청 ID',
      dataIndex: 'requestId',
      render: (value) => (
        <Link to={`/dashboard/webhooks/${value}`}>{value}</Link>
      ),
    },
    {
      title: '웹훅 유형',
      dataIndex: 'webhook',
      render: (webhook) =>
        webhook.type === 'rideEnd'
          ? '라이드 종료'
          : webhook.type === 'payment'
          ? '결제 호출'
          : webhook.type === 'refund'
          ? '환불 호출'
          : webhook.type,
    },
    {
      title: '요청 일자',
      dataIndex: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초'),
    },
    {
      title: '완료 일자',
      dataIndex: 'completedAt',
      render: (completedAt) =>
        completedAt
          ? dayjs(completedAt).format('YYYY년 MM월 DD일 hh시 mm분 ss초')
          : '전송 실패',
    },
  ];

  const requestWebhookSettings = () => {
    setLoading(true);
    Client.get('/webhook/settings').then((res) => {
      const fields = {};
      const { webhooks } = res.data;
      webhooks.forEach(({ type, url }) => (fields[type] = url));
      form.setFieldsValue(fields);
      setSettings(fields);
      setLoading(false);
    });
  };

  const saveWebhookSettings = async (settings) => {
    setLoading(true);
    await Promise.all([
      Object.keys(settings).map((type) =>
        Client.post(`/webhook/settings/${type}`, {
          url: settings[type] || '',
        })
      ),
    ]);

    message.success(`저장되었습니다.`);
    setLoading(false);
  };

  const requestWebhookRequests = () => {
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get('/webhook/requests', { params }).then((res) => {
      const { requests, total } = res.data;
      setDataSource(requests);
      setTotal(total);
      setLoading(false);
    });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    requestWebhookRequests();
  };

  const onSearch = (search) => {
    setSearch(search);
    requestWebhookRequests();
  };

  useEffect(requestWebhookRequests, [search, skip, take]);
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={3}>웹훅</Title>
          </Col>
          <Col>
            <Search
              placeholder="검색"
              onSearch={onSearch}
              loading={isLoading}
              enterButton
            />
          </Col>
        </Row>
        <Collapse
          onChange={requestWebhookSettings}
          style={{ marginBottom: 10 }}
        >
          <Collapse.Panel header="웹훅 설정" key="settings">
            <Form layout="vertical" form={form} onFinish={saveWebhookSettings}>
              {settings &&
                Object.keys(settings).map((type) => (
                  <Form.Item
                    key={type}
                    name={type}
                    label={
                      type === 'rideEnd'
                        ? '라이드 종료'
                        : type === 'payment'
                        ? '결제 호출'
                        : type === 'refund'
                        ? '환불 호출'
                        : type
                    }
                  >
                    <Input disabled={isLoading} />
                  </Form.Item>
                ))}
              <Button
                icon={<SaveOutlined />}
                loading={isLoading}
                type="primary"
                htmlType="submit"
              >
                저장하기
              </Button>
            </Form>
          </Collapse.Panel>
        </Collapse>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="requestId"
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
