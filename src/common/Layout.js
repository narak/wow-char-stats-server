import styles from './layout.module.css';

import Link from 'next/link';
import { Layout, Menu } from 'antd';
const { Header } = Layout;

export const Tabs = {
  RAIDERIO: 'rio',
  WARCRAFTLOGS: 'wcl',
};

export default function _Layout({ activeTab, children }) {
  return (
    <Layout className={styles.app}>
      <Header>
        <Menu theme="dark" mode="horizontal" selectedKeys={[activeTab]}>
          <Menu.Item key={Tabs.RAIDERIO}>
            <Link href="/rio">Raider.IO</Link>
          </Menu.Item>
          <Menu.Item key={Tabs.WARCRAFTLOGS}>
            <Link href="/wcl">Warcraft Logs</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <div style={{ position: 'relative' }}>{children}</div>
    </Layout>
  );
}
