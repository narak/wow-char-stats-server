import styles from './index.module.css';

import useLocalStorage from '../../utils/useLocalStorage';

import { Layout } from 'antd';
import AddChar from '../common/AddChar';
import Char from './Char';

const { Content } = Layout;

export default function Index() {
	const [chars, setChars] = useLocalStorage('raiderio', []);

	function onAdd(char) {
		setChars([...chars, char]);
	}

	function onDelete(index) {
		setChars([...chars.slice(0, index), ...chars.slice(index + 1)]);
	}

	return (
		<>
			<Content style={{ padding: '20px 50px' }}>
				<AddChar onAdd={onAdd} />
			</Content>
			<Content className={styles.cards}>
				{chars &&
					chars.map((char, index) => (
						<Char key={index} char={char} onDelete={onDelete.bind(this, index)} />
					))}
			</Content>
		</>
	);
}
