import { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Abbrs = {
    'Spires of Ascension': 'soa',
    'Theater of Pain': 'top',
    'Halls of Atonement': 'hoa',
    'The Necrotic Wake': 'nw',
    'De Other Side': 'dos',
    'Mists of Tirna Scithe': 'mots',
    'Sanguine Depths': 'sd',
    Plaguefall: 'pf',
};

function getAbbr(key) {
    return Abbrs[key];
}

const BG = styled.div`
    background: #000;
    line-height: 45px;
    padding: 0px 22px;
`;
const FilterTitle = styled.b`
    margin-right: 1rem;
`;
const Filter = styled.span`
    cursor: pointer;
    font-family: monospace;
`;

export default function LFGFilter({ runs }) {
    const [copied, setCopied] = useState(false);

    const [keysByLvl, lowestKey] = useMemo(() => {
        const _keysByLvl = {};
        let _lowestKey = 999;
        runs?.forEach(run => {
            if (_keysByLvl[run.mythic_level]) {
                _keysByLvl[run.mythic_level].push(run.dungeon);
            } else {
                _keysByLvl[run.mythic_level] = [run.dungeon];
            }
            if (run.mythic_level <= _lowestKey) {
                _lowestKey = run.mythic_level;
            }
        });
        return [_keysByLvl, _lowestKey];
    }, [runs]);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    const filterText = keysByLvl[lowestKey].map(getAbbr).join(' or ');

    return (
        <BG>
            <FilterTitle>LFG Filter</FilterTitle>
            <CopyToClipboard text={filterText} onCopy={() => setCopied(true)}>
                <Filter>{!copied ? filterText : 'Copied!'}</Filter>
            </CopyToClipboard>
        </BG>
    );
}
