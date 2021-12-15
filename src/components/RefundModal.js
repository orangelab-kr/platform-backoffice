import { Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import { useState } from 'react';

export const RefundModal = ({ payment, refundPayment, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const onRefund = async (props) => {
    try {
      setLoading(true);
      console.log(props);
      const { paymentId } = payment;
      refundPayment(paymentId, props);
    } finally {
      setLoading(false);
      close();
    }
  };

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <Modal
      title="환불"
      visible={visible}
      okType="danger"
      okText="환불"
      cancelText="취소"
      onOk={form.submit}
      onCancel={close}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onRefund}
        initialValues={payment}
      >
        <Row gutter={[4, 0]}>
          <Col flex="auto">
            <Form.Item
              name="amount"
              label="환불 금액:"
              required
              rules={[
                {
                  required: true,
                  message: '반드시 금액을 입력해주세요.',
                },
                {
                  type: 'number',
                  max: payment.amount,
                  message: '결제 금액을 초과할 수 없습니다.',
                },
              ]}
            >
              <InputNumber
                keyboard={false}
                controls={false}
                placeholder="환불 금액"
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="start" gutter={[4, 0]}>
          <Col flex="auto">
            <Form.Item
              name="reason"
              label="환불 사유:"
              required
              rules={[
                {
                  required: true,
                  message: '환불 사유를 반드시 입력해주세요.',
                },
              ]}
            >
              <Input
                placeholder="환불 사유를 입력해주세요."
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
