import { IconButton, Typography } from '@mui/material';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { usePoint } from 'modules/common/redux/points';
import { usePointValue } from 'modules/common/redux/poll';
import React, { CSSProperties, useState } from 'react';
import styles from './Params.module.scss';

interface ParamsProps {
	children?: React.ReactNode;
	className?: string;
	style?: CSSProperties;
	title?: string;
	collapsed?: boolean;
	collapsable?: boolean;
	hideCount?: boolean;
	display?: boolean;

	summaryAlarmPointRef?: string;
	communicationAlarmPointRef?: string;
	wrapperStyle?: CSSProperties;
	wrapperClassName?: string;
}

const usePointXidValue = (xid: string | undefined): number | null => {
	const point = usePoint(null, xid);
	const value = usePointValue((point ? point.uuid : '') || '');

	return value ? value.value : null;
};

const useParamsGroupStatusClasses = (summaryAlarmPointRef: string | undefined, communicationAlarmPointRef: string | undefined): boolean[] => {
	const summaryAlarmPointValue = Boolean(usePointXidValue(summaryAlarmPointRef));
	const communicationAlarmPointValue = Boolean(usePointXidValue(communicationAlarmPointRef));

	return [false || Boolean(summaryAlarmPointRef && summaryAlarmPointValue), false || Boolean(communicationAlarmPointValue && communicationAlarmPointValue)];
};

const Params: React.FC<ParamsProps> = ({
	children,
	className,
	style,
	title,
	collapsed: forcedCollapsed,
	hideCount = false,
	display = true,
	summaryAlarmPointRef,
	communicationAlarmPointRef,
	collapsable = true,
	wrapperStyle,
	wrapperClassName,
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(Boolean(forcedCollapsed));
	const [inSummaryAlarm, inCommunicationAlarm] = useParamsGroupStatusClasses(summaryAlarmPointRef, communicationAlarmPointRef);
	const paramsCount = React.Children.count(children);
	const isEmpty = paramsCount === 0;
	const shouldDisplay = display;

	return shouldDisplay ? (
		<div
			className={cn(styles.params, className, {
				[styles.collapseable]: !isEmpty && collapsable,
				[styles.collapsed]: collapsable && collapsed,
				[styles.summaryAlarm]: inSummaryAlarm,
				[styles.communicationAlarm]: inCommunicationAlarm,
			})}
			style={style}
		>
			{title && (
				<div className={styles.header} onClick={() => !isEmpty && setCollapsed(!collapsed)}>
					{!isEmpty && collapsable && (
						<IconButton size='small'>{collapsed ? <ExpandMoreOutlined fontSize='inherit' /> : <ExpandLessOutlined fontSize='inherit' />}</IconButton>
					)}
					<Typography className={styles.title}>
						{title} {hideCount ? '' : `(${paramsCount})`}
						{inCommunicationAlarm ? ' - brak komunikacji' : inSummaryAlarm ? ' - alarm zbiorczy' : ''}
					</Typography>
				</div>
			)}
			<div className={cn(styles.wrapper, wrapperClassName, { [styles.emptyTitle]: !title })} style={wrapperStyle}>
				{children}
			</div>
		</div>
	) : null;
};

export default Params;
