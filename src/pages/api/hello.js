// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

import getWCLAuthToken from '../../utils/getWCLAuthToken';

export default async function useWCLAuthToken(req, res) {
  const token = await getWCLAuthToken();
  res.status(200).json({ name: 'hello world', data: token });
}

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' });
// }
