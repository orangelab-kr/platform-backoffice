import { Card, Col, Descriptions, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Client } from '../tools';

export const DiscountGroupDetails = withRouter(({ history }) => {
  const [discountGroup, setRequest] = useState(null);
  const [discountGroupHistories, setRequestHistories] = useState([]);
  const { discountGroupId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(0);

  const columns = [
    {
      title: '디스카운트 ID',
      dataIndex: 'discountId',
      key: 'discountId',
    },
    {
      title: '사용일자',
      dataIndex: 'usedAt',
      key: 'usedAt',
      render: (usedAt) => dayjs(usedAt).format('YYYY년 MM월 DD일 H시 M분 S초'),
    },
    {
      title: '생성일자',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) =>
        dayjs(createdAt).format('YYYY년 MM월 DD일 H시 M분 S초'),
    },
    {
      title: '만료일자',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      render: (expiredAt) =>
        dayjs(expiredAt).format('YYYY년 MM월 DD일 H시 M분 S초'),
    },
  ];

  const loadDiscountGroup = () => {
    if (!discountGroupId) return;
    Client.get(`/discount/${discountGroupId}`).then(({ data }) => {
      setRequest(data.discountGroup);
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

  useEffect(loadDiscountGroup, [discountGroupId]);

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
            </Row>
          </Col>

          {discountGroup && (
            <>
              <Col span={24}>
                <Card>
                  <Typography.Title level={4}>디스카운트 정보</Typography.Title>
                  <Descriptions bordered size="small">
                    <Descriptions.Item label="디스카운트 그룹ID" span={2}>
                      <Typography.Text copyable={true}>
                        {discountGroup.discountGroupId}
                      </Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="설명">
                      {discountGroup.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="남은 디스카운트">
                      {discountGroup.remainingCount !== null
                        ? `${discountGroup.remainingCount.toLocaleString()}개`
                        : '제한 없음'}
                    </Descriptions.Item>
                    <Descriptions.Item label="자동 만료">
                      {discountGroup.validity
                        ? `${discountGroup.validity / 1000}초`
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
            </>
          )}
        </Row>
      </Card>
    </>
  );
});
