import Head from 'next/head';
import Layout, { Tabs } from '../common/Layout';
import RaiderIO from '../rio';

export default function Rio() {
  return (
    <>
      <Head>
        <title>Raider.IO Tracker</title>
      </Head>
      <Layout activeTab={Tabs.RAIDERIO}>
        <RaiderIO />
      </Layout>
    </>
  );
}
