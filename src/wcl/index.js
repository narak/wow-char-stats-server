import { useEffect, useState } from 'react';

import { Zone, Difficulty } from '../constants/WarcraftLogs';

import api from '../utils/api';
import useLocalStorage from '../utils/useLocalStorage';

import Main from './Main';

export default function DataProvider(props) {
  const [lsEncs, lsSetEncs] = useLocalStorage('wcsEncounters', []);
  const [lsChars, lsSetChars] = useLocalStorage('wlTrackedChars', []);
  const [apiChars, apiSetChars] = useState([]);
  const { hasId } = props;

  useEffect(() => {
    (async function () {
      const resp = hasId && props.id ? await api.get('/chars/' + props.id) : null;
      if (resp?.data) {
        apiSetChars(resp.data.characters || []);
      }
    })();
  }, [hasId, props.id]);

  async function onApiSetChars(characters) {
    const resp = await api.put('/chars/' + props.id, {
      characters,
    });
    if (resp.status === 200) {
      apiSetChars(resp.data.characters);
    }
  }

  const [zone, setZone] = useLocalStorage(
    'wlZone',
    {
      id: Zone.SOD,
      difficulty: Difficulty.Heroic,
    },
    val => {
      // we used to store 'Heroic|Normal', etc. in the LS first. Now we store "H|N", etc.
      // This is to mitigate that.
      if (Difficulty[val.difficulty]) {
        val.difficulty = Difficulty[val.difficulty];
      }
      return val;
    }
  );

  const [bosses, setBosses] = useLocalStorage('wlBosses', {});

  return (
    <Main
      {...props}
      chars={hasId ? apiChars : lsChars}
      setChars={hasId ? onApiSetChars : lsSetChars}
      encounters={lsEncs}
      setEncounters={lsSetEncs}
      zone={zone}
      setZone={setZone}
      bosses={bosses}
      setBosses={setBosses}
    />
  );
}

// if (typeof window !== 'undefined') {
//  const worker = new Worker(new URL('../workers/worker.js', import.meta.url));
//  worker.postMessage({
//    question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
//  });
//  worker.onmessage = ({ data: { answer } }) => {
//    console.log(answer);
//  };
// }
