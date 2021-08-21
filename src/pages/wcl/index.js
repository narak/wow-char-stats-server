import Head from 'next/head';
import Layout, { Tabs } from '../../common/Layout';
import WarcraftLogs from '../../wcl';

export default function WCL() {
  return (
    <>
      <Head>
        <title>Character Performance - WarcraftLogs</title>
      </Head>
      <Layout activeTab={Tabs.WARCRAFTLOGS}>
        <WarcraftLogs />
      </Layout>
    </>
  );
}
