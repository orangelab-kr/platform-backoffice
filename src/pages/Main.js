import { Card, Typography } from 'antd';
import React from 'react';
import { License } from '../components';

const { Title } = Typography;

export const Main = () => {
  return (
    <>
      <Card>
        <Title level={3}>대시보드</Title>
        <License />
      </Card>
    </>
  );
};
