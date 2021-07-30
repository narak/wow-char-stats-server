import admin from 'firebase-admin';
import atob from 'atob';

const GoogleCred = JSON.parse(atob(process.env.GOOGLE_CREDENTIALS));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(GoogleCred),
  });
}

const db = admin.firestore();

// (async function () {
//   const colc = db.collection('stats-page');

//   await colc.add({
//     characters: [
//       {
//         name: 'vhad',
//         server: 'frostmourne',
//         region: 'us',
//       },
//       {
//         name: 'abhihunt',
//         server: 'frostmourne',
//         region: 'us',
//       },
//       {
//         name: 'errorgon',
//         server: 'frostmourne',
//         region: 'us',
//       },
//     ],
//   });
// });

export async function getStatsPage(id) {
  if (!id) {
    throw new Error('Cannot fetch stats page without ID');
  }
  const snapshot = await db.doc('stats-page/' + id).get();
  return snapshot;
}
