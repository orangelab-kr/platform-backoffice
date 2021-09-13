import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { Client } from '../tools';

const { Title } = Typography;

export const License = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const checkLicense = ({ realname, birthday, identity, license }) => {
    setLoading(true);
    const body = {
      realname,
      identity,
      birthday: birthday.format('YYYY-MM-DD'),
      license: license.split('-'),
    };

    Client.post(`/license`, body)
      .then(({ data }) => setResult(data.isValid))
      .finally(() => setLoading(false));
  };

  return (
    <Card style={{ maxWidth: 500 }}>
      <Title level={4}>운전면허</Title>
      <Form
        layout="vertical"
        onValuesChange={() => setResult(null)}
        onFinish={checkLicense}
      >
        <Row justify="start" gutter={[4, 0]}>
          <Col flex="auto">
            <Form.Item
              name="realname"
              label="이름:"
              required
              rules={[
                { required: true, message: '이름을 반드시 입력해주세요.' },
                { min: 2, message: '이름은 2자 이상이여야 합니다.' },
              ]}
            >
              <Input placeholder="이름을 입력하세요." disabled={isLoading} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="birthday"
              label="생년월일:"
              required
              rules={[
                { required: true, message: '생년월일을 반드시 입력해주세요.' },
              ]}
            >
              <DatePicker
                format="YYYY/MM/DD"
                placeholder="생일을 입력하세요."
                defaultPickerValue={moment('2000-01-01')}
                disabled={isLoading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[4, 0]}>
          <Col flex="auto">
            <Form.Item
              name="license"
              label="운전면허:"
              required
              rules={[
                {
                  required: true,
                  message: '올바른 운전면허를 입력해주세요.',
                  pattern: /^.{2}-[0-9]{2}-[0-9]{6}-[0-9]{2}$/,
                },
              ]}
            >
              <Input
                maxLength={15}
                placeholder="운전면허 번호를 입력하세요."
                disabled={isLoading}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="identity"
              label="검증 코드:"
              rules={[
                {
                  pattern: /^[A-z0-9]{6}$/,
                  message: '올바른 검증코드를 입력해주세요.',
                },
              ]}
            >
              <Input
                maxLength={6}
                placeholder="6자리를 입력하세요."
                disabled={isLoading}
              />
            </Form.Item>
          </Col>
        </Row>

        {result !== null && (
          <Row>
            <Col flex="auto">
              <Alert
                message={
                  result
                    ? '운전면허가 유효합니다.'
                    : '운전면허가 유효하지 않습니다.'
                }
                type={result ? 'success' : 'error'}
                showIcon
              />
            </Col>
          </Row>
        )}

        <Row justify="end">
          <Col>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              style={{ margin: '.5em 0 .5em .5em' }}
            >
              운전면허 검증
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
