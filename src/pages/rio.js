import Layout, { Tabs } from '../components/common/Layout';
import RaiderIO from '../rio';

export default function Rio() {
  return (
    <Layout activeTab={Tabs.RAIDERIO}>
      <RaiderIO />
    </Layout>
  );
}
