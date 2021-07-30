import Layout, { Tabs } from '../../common/Layout';
import WarcraftLogs from '../../wcl';

export default function WCL() {
  return (
    <Layout activeTab={Tabs.WARCRAFTLOGS}>
      <WarcraftLogs />
    </Layout>
  );
}
