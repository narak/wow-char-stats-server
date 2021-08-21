import { useRouter } from 'next/router';
import Head from 'next/head';

import Layout, { Tabs } from '../../common/Layout';
import WarcraftLogs from '../../wcl';

export default function WCLById() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Character Performance - WarcraftLogs</title>
      </Head>
      <Layout activeTab={Tabs.WARCRAFTLOGS}>
        <WarcraftLogs id={router.query.id} hasId={true} />
      </Layout>
    </>
  );
}
