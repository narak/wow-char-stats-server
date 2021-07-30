import styles from './addchar.module.css';

import url from 'url';
import { useState } from 'react';
import { Button, Input, Select, Tooltip } from 'antd';

const { Option } = Select;

const NameHelp =
    'You can paste your WarcraftLogs, Raider.IO or WoW Armory link in here to auto add.';

export default function AddChar({ onAdd }) {
    const [char, setChar] = useState({ region: 'us', server: 'frostmourne', name: '' });
    function onSubmit(e) {
        e.preventDefault();
        onAdd(char);
    }

    function onChangeSelect(key, value) {
        setChar({ ...char, [key]: value });
    }
    function onChange(key, e) {
        setChar({ ...char, [key]: e.target.value });
    }
    function onChangeName(e) {
        const name = e.target.value;

        // is url
        if (/^http.*/i.test(name)) {
            const { path, hostname } = url.parse(name);
            const pathBits = path.split('/');

            if (/warcraftlogs/i.test(hostname)) {
                const [, , region, server, name] = pathBits;
                onAdd({ region, server, name });
            } else if (/raider\.io/i.test(hostname)) {
                const [, , region, server, name] = pathBits;
                onAdd({ region, server, name });
            } else if (/worldofwarcraft/i.test(hostname)) {
                const [, , , region, server, name] = pathBits;
                onAdd({ region, server, name });
            }
        } else {
            onChange('name', e);
        }
    }

    return (
        <form onSubmit={onSubmit} className={styles.cont}>
            <div className={styles.field}>
                <Select
                    style={{ width: 120 }}
                    value={char.region}
                    onChange={onChangeSelect.bind(this, 'region')}
                >
                    <Option value="us">us</Option>
                    <Option value="eu">eu</Option>
                    <Option value="tw">tw</Option>
                    <Option value="kr">kr</Option>
                    <Option value="cn">cn</Option>
                </Select>
            </div>
            <div className={styles.field}>
                <Input
                    type="text"
                    name="server"
                    value={char.server}
                    placeholder="Server"
                    onChange={onChange.bind(this, 'server')}
                />
            </div>
            <div className={styles.field}>
                <Tooltip placement="bottom" title={NameHelp}>
                    <Input
                        type="text"
                        name="char"
                        value={char.name}
                        placeholder="Character"
                        onChange={onChangeName}
                    />
                </Tooltip>
            </div>
            <div className={styles.field}>
                <Button type="primary" htmlType="submit">
                    Add
                </Button>
            </div>
        </form>
    );
}
