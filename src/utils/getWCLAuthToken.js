// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const formUrlEncoded = x =>
  Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

let _req;
function getToken(cb) {
  if (!_req) {
    _req = axios({
      method: 'post',
      url: 'https://www.warcraftlogs.com/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: formUrlEncoded({
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });
  }
  _req
    .then(resp => {
      cb(resp.data);
    })
    .catch(e => {
      cb(e.response.data);
    });
}

let _token, _tokenTime, _tokenExpiresOn;

function isTokenValid() {
  return _token && Date.now() < _tokenExpiresOn - 10000;
}

export default function getWCLAuthToken(req, res) {
  return new Promise(resolve => {
    if (isTokenValid()) {
      console.log('Cached WCLAuthToken');
      resolve(_token);
    } else {
      console.log('Fetching WCLAuthToken');
      getToken(token => {
        console.log('Fetched WCLAuthToken');
        _token = token;
        _tokenTime = Date.now();
        _tokenExpiresOn = _tokenTime + _token.expires_in * 1000;
        resolve(_token);
      });
    }
  });
}

// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' });
// }
