import { Log } from 'modules/common/debug/Debug';
import LogsListItem from 'modules/common/debug/components/LogsListItem';
import * as React from 'react';
import styles from './LogsList.module.scss';

interface LogsListProps {
	logs: Log[];
}

const LogsList: React.FC<LogsListProps> = ({ logs }) => {
	return (
		<div className={styles.container}>
			<div className={styles.stats}>{logs.length}</div>
			<div className={styles.logs}>
				{logs.map((log, index) => (
					<LogsListItem log={log} key={index} />
				))}
			</div>
		</div>
	);
};

export default LogsList;
