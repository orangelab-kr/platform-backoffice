import {
  CheckCircleOutlined,
  LockOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Descriptions,
  Row,
  Table,
  Typography,
  Input,
  Button,
  Popconfirm,
  message,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Client } from '../tools';

export const DiscountGroupsDetails = withRouter(({ history }) => {
  const [discountGroup, setDiscountGroup] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const { discountGroupId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);

  const columns = [
    {
      title: '할인 ID',
      dataIndex: 'discountId',
      key: 'discountId',
      render: (discountId) => (
        <Typography.Text copyable={true}>{discountId}</Typography.Text>
      ),
    },
    {
      title: '사용일자',
      dataIndex: 'usedAt',
      key: 'usedAt',
      render: (usedAt, { discountId, lockedAt, expiredAt }) =>
        usedAt ? (
          <Button size="small" icon={<CheckCircleOutlined />} disabled>
            사용 완료: {dayjs(usedAt).format('YYYY년 MM월 DD일 H시 m분 s초')}
          </Button>
        ) : lockedAt ? (
          <Button size="small" icon={<LockOutlined />} disabled>
            사용 중: {dayjs(lockedAt).format('YYYY년 MM월 DD일 H시 m분 s초')}
          </Button>
        ) : dayjs(expiredAt).isBefore() ? (
          <Button size="small" icon={<LockOutlined />} disabled>
            만료 됨: {dayjs(expiredAt).format('YYYY년 MM월 DD일 H시 m분 s초')}
          </Button>
        ) : (
          <Popconfirm
            title="정말로 취소하시겠습니까?"
            okText="네"
            cancelText="아니요"
            onConfirm={() => revokeDiscount(discountId)}
          >
            <Button size="small" icon={<StopOutlined />} danger>
              발급 취소
            </Button>
          </Popconfirm>
        ),
    },
    {
      title: '생성일자',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 H시 m분 s초'),
    },
    {
      title: '만료일자',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      render: (expiredAt) =>
        dayjs(expiredAt).format('YYYY년 MM월 DD일 H시 m분 s초'),
    },
  ];

  const loadDiscountGroup = () => {
    if (!discountGroupId) return;
    setLoading(true);
    const params = {
      take,
      skip,
      search,
    };

    Client.get(`/discount/discountGroups/${discountGroupId}`, { params })
      .finally(() => setLoading(false))
      .then(({ data }) => {
        setDiscountGroup(data.discountGroup);
        setDiscounts(data.discounts);
        setTotal(data.total);
      });
  };

  const revokeDiscount = (discountId) => {
    if (!discountGroupId || !discountId) return;
    setLoading(true);

    Client.delete(`/discount/discountGroups/${discountGroupId}/${discountId}`)
      .finally(() => setLoading(false))
      .then(() => loadDiscountGroup());
  };

  const generateDiscount = () => {
    if (!discountGroupId) return;
    setLoading(true);

    Client.get(`/discount/discountGroups/${discountGroupId}/generate`)
      .finally(() => setLoading(false))
      .then(({ data }) => {
        message.success(
          <>
            <Typography.Text copyable={true}>
              {data.discount.discountId}
            </Typography.Text>
            가 발급되었습니다.
          </>
        );

        loadDiscountGroup();
      });
  };

  const onPagnationChange = (page, pageSize) => {
    setTake(pageSize);
    setSkip(page * pageSize);
    loadDiscountGroup();
  };

  const onSearch = (search) => {
    setSearch(search);
    loadDiscountGroup();
  };

  useEffect(loadDiscountGroup, [discountGroupId, search, skip, take]);

  return (
    <>
      <Card>
        <Row justify="start" style={{ marginBottom: 20 }} gutter={[4, 4]}>
          <Col span={24}>
            <Row justify="space-between">
              <Col>
                <Typography.Title level={3} copyable={discountGroup}>
                  {discountGroup ? discountGroup.name : '로딩 중...'}
                </Typography.Title>
              </Col>
              <Col>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={generateDiscount}
                >
                  할인 발급
                </Button>
              </Col>
            </Row>
          </Col>

          {discountGroup && (
            <>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>할인 정보</Typography.Title>
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="할인 그룹 ID" span={2}>
                      <Typography.Text copyable={true}>
                        {discountGroup.discountGroupId}
                      </Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="설명">
                      {discountGroup.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="남은 할인">
                      {discountGroup.remainingCount !== null
                        ? `${discountGroup.remainingCount.toLocaleString()}개`
                        : '제한 없음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="자동 만료">
                      {discountGroup.validity
                        ? `${discountGroup.validity}초`
                        : '만료 없음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="발급 일자">
                      {dayjs(discountGroup.createdAt).format(
                        'YYYY년 M월 D일 H시 m분'
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="퍼센트 할인">
                      {discountGroup.ratioPriceDiscount
                        ? `${discountGroup.ratioPriceDiscount}%`
                        : '없음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="고정금액 할인">
                      {discountGroup.staticPriceDiscount
                        ? `${discountGroup.staticPriceDiscount.toLocaleString()}원`
                        : '없음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="고정시간 할인">
                      {discountGroup.staticMinuteDiscount
                        ? `${discountGroup.staticMinuteDiscount}분`
                        : '없음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="기본요금 할인 적용여부" span={2}>
                      {discountGroup.isStandardPriceIncluded
                        ? '적용됨'
                        : '적용되지 않음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="기본요금 할인 적용여부">
                      {discountGroup.isStandardPriceIncluded
                        ? '적용됨'
                        : '적용되지 않음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="분당요금 할인 적용여부" span={2}>
                      {discountGroup.isPerMinutePriceIncluded
                        ? '적용됨'
                        : '적용되지 않음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="추가요금 할인 적용여부">
                      {discountGroup.isSurchargeIncluded
                        ? '적용됨'
                        : '적용되지 않음'}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  <Row justify="space-between">
                    <Col>
                      <Typography.Title level={4}>할인 목록</Typography.Title>
                    </Col>
                    <Col>
                      <Row>
                        <Col>
                          <Input.Search
                            placeholder="검색"
                            onSearch={onSearch}
                            loading={isLoading}
                            enterButton
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Table
                    columns={columns}
                    dataSource={discounts}
                    scroll={{ x: '100%' }}
                    loading={isLoading}
                    pagination={{
                      onChange: onPagnationChange,
                      onShowSizeChange: setTake,
                      total,
                    }}
                  />
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </>
  );
});
