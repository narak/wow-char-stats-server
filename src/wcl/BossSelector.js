import { Select } from 'antd';
const { Option } = Select;

export default function ZoneSelector({ bosses = [], value = [], onChange }) {
    return (
        <div>
            <Select
                mode="multiple"
                allowClear
                style={{ minWidth: 700 }}
                value={value}
                onChange={onChange}
                placeholder="Select Bosses"
            >
                {bosses.map(key => {
                    return <Option key={key}>{key}</Option>;
                })}
            </Select>
        </div>
    );
}
