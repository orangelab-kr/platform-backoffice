import {
  HistoryOutlined,
  HomeOutlined,
  KeyOutlined,
  LockOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";

import React from "react";
import { withRouter } from "react-router";

const { Header, Content, Footer, Sider } = Layout;

export const Dashboard = withRouter(({ history, children }) => {
  // eslint-disable-next-line no-restricted-globals
  const currentMenu = location.pathname;
  const onClick = ({ key }) => history.push(key);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        width={150}
        defaultCollapsed={true}
        collapsedWidth={50}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[currentMenu]}
          mode="inline"
          onClick={onClick}
        >
          <Menu.Item key="/dashboard/main" icon={<HomeOutlined />}>
            대시보드
          </Menu.Item>
          <Menu.Item key="/dashboard/users" icon={<UserOutlined />}>
            사용자
          </Menu.Item>
          <Menu.Item key="/dashboard/accessKeys" icon={<KeyOutlined />}>
            액세스 키
          </Menu.Item>
          <Menu.Item key="/dashboard/permissionGroups" icon={<LockOutlined />}>
            권한 그룹
          </Menu.Item>
          <Menu.Item key="/dashboard/logs" icon={<HistoryOutlined />}>
            로그
          </Menu.Item>
          <Menu.Item key="/dashboard/settings" icon={<SettingOutlined />}>
            설정
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ height: "68px" }} />
        <Content style={{ margin: "10px 16px" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>HIKICK Platform ❤️</Footer>
      </Layout>
    </Layout>
  );
});
