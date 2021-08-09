import axios from 'axios';
import getWCLAuthToken from '../../../utils/getWCLAuthToken';

async function get(data) {
  const token = await getWCLAuthToken();
  return axios({
    method: 'post',
    url: 'https://www.warcraftlogs.com/api/v2/client',
    data,
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
}

export default async function Char(req, res) {
  const resp = await get(req.body);
  res.status(200).json(resp.data);
}
