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

export async function getCharsById(id) {
  if (!id) {
    throw new Error('Cannot fetch characters without ID');
  }
  return await db.doc('stats-page/' + id).get();
}

export async function updateCharsById(id, chars) {
  if (!id) {
    throw new Error('Cannot update characters without ID');
  }
  if (!chars) {
    throw new Error('Cannot update characters without characters as input');
  }
  const docRef = db.doc('stats-page/' + id);
  return await docRef.update({ characters: chars });
}
