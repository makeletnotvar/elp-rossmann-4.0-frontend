import cn from 'classnames';
import { Log } from 'modules/common/debug/Debug';
import * as React from 'react';
import { useState } from 'react';
import styles from './LogsList.module.scss';

interface LogsListItemProps {
	log: Log;
}

const LogsListItem: React.FC<LogsListItemProps> = ({ log }) => {
	const { ts, message, source, tags, data, level } = log;
	const time = new Date(ts).toLocaleTimeString() + ':' + Math.round(ts % 1000);
	const tagsStr = (tags || []).map(tag => `#${tag}`).join('|');

	return (
		<div className={cn(styles.log, styles[level])}>
			<span className={styles.indicator}></span>
			<span className={styles.time}>{time}</span>
			{source && <span className={styles.source}>{source}</span>}
			{tags && <span className={styles.tags}>{tagsStr}</span>}
			<span className={styles.message}>
				<LimitText text={message} />
			</span>
		</div>
	);
};

const LimitText: React.FC<{ text: string }> = ({ text }) => {
	const [expand, setExpand] = useState(false);
	const LIMIT = 50;
	const isLimited = text.length > LIMIT;
	const outputText = expand ? text : text.substring(0, LIMIT);

	return (
		<>
			{outputText}
			{isLimited && (
				<span className={styles.more} onClick={() => setExpand(!expand)}>
					{expand ? '<' : '>'}
				</span>
			)}
		</>
	);
};

export default LogsListItem;
