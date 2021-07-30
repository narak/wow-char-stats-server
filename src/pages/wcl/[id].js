import { useRouter } from 'next/router';

import Layout, { Tabs } from '../../common/Layout';
import WarcraftLogs from '../../wcl';

export default function WCLById(req) {
  const router = useRouter();
  return (
    <Layout activeTab={Tabs.WARCRAFTLOGS}>
      <WarcraftLogs id={router.query.id} hasId={true} />
    </Layout>
  );
}
