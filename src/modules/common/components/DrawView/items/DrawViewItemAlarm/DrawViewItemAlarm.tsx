import { CheckOutlined, Close, ReportProblemOutlined } from '@mui/icons-material';
import { Badge, Box, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, Tooltip, Typography } from '@mui/material';
import cn from 'classnames';
import { t } from 'i18next';
import { useApp } from 'modules/common/selectors/app';
import { getEventsPriorityName, getPriorityClassName } from 'modules/events_v2/helpers/eventsV2';
import * as React from 'react';
import { CSSProperties, useMemo, useState } from 'react';
import { StyleTransformer } from 'typings/styleTransformer';
import useRouter from 'use-react-router';
import styles from './DrawViewItemAlarm.module.scss';

export const DRAW_VIEW_ITEM_ALARM = 'alarm';

export interface DrawViewItemAlarmComponentProps extends DrawViewItemBase, Partial<DrawViewItemDimensions> {
	pointRef: PointReference | null;
	label: string;
	type: 'alarm';
	style?: CSSProperties;
	css?: string;
	transformers?: StyleTransformer[];
	setActive?: (transformerId: string, stateCSSPropertyValue: string | number | null) => void;
	editing: boolean;
	user: UserAuth | null;
	codes: { [key: number]: string }[];
	buildingUUID: string;
}

export const alarmTemplate: Partial<DrawViewItemAlarmComponentProps> = {
	label: '',
	type: DRAW_VIEW_ITEM_ALARM,
	style: {},
};

const DrawViewItemAlarmComponent: React.FC<DrawViewItemAlarmComponentProps> = ({ label, style, codes, buildingUUID, editing }) => {
	const { events } = useApp();
	const { history } = useRouter();

	const [open, setOpen] = useState(false);
	const lowerCaseCodes = (codes || []).map(codeObj => Object.values(codeObj)[0]?.toLocaleLowerCase());
	const activeEvents = events.filter(event => event?.building.uuid === buildingUUID).filter(event => lowerCaseCodes.includes(event?.code?.toLocaleLowerCase()));
	const maxPriority = Math.max(...activeEvents.map(event => event?.priority));

	const classNames = useMemo(
		() =>
			cn(styles.label, {
				[styles.empty]: label.length === 0,
			}),
		[label.length === 0]
	);

	return (
		<>
			<div className={classNames} style={{ ...style, padding: '10px' }}>
				{editing && (activeEvents || []).length === 0 ? (
					<CheckOutlined />
				) : (activeEvents || []).length > 0 ? (
					<Tooltip
						title={
							<Box display='flex' flexDirection='column' justifyContent='center' gap={2}>
								<Typography style={{ fontSize: '0.813rem' }}>Aktywne alarmy</Typography>
								{activeEvents.map(event => (
									<Box display='flex' gap={5}>
										<ReportProblemOutlined fontSize='small' className={getPriorityClassName(getEventsPriorityName(event.priority || 0), styles)} />
										<Typography variant='subtitle1' style={{ fontSize: '0.75rem' }}>
											{event.name || 'Brak nazwy'}
										</Typography>
									</Box>
								))}
							</Box>
						}
					>
						<IconButton size='small' onClick={() => setOpen(true)}>
							<Badge overlap='rectangular' color='primary' badgeContent={activeEvents.length}>
								<ReportProblemOutlined className={getPriorityClassName(getEventsPriorityName(maxPriority || 0), styles)} />
							</Badge>
						</IconButton>
					</Tooltip>
				) : null}
			</div>
			<Dialog
				onContextMenu={e => {
					e.stopPropagation();
				}}
				open={open}
				onClose={() => setOpen(false)}
				fullWidth
				maxWidth='sm'
			>
				<DialogTitle className={styles.dialogTitle}>
					Aktywne alarmy
					<Box display='flex' alignItems='center' gap={10}>
						<Tooltip title={t('general.close')}>
							<IconButton size='small' style={{ color: '#303030' }} onClick={() => setOpen(false)}>
								<Close />
							</IconButton>
						</Tooltip>
					</Box>
				</DialogTitle>
				<DialogContent>
					<List style={{ padding: 0 }}>
						{activeEvents.map((event, index) => (
							<ListItem className={styles.alarm} key={`${event.code}${index}`} onClick={() => event?.uuid && history.push(`/events/${event.uuid}`)} divider>
								<ReportProblemOutlined className={getPriorityClassName(getEventsPriorityName(event.priority || 0), styles)} />
								<Box display='flex' flexDirection='column' width='100%'>
									<Typography variant='subtitle1' style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
										{event.name || 'Brak nazwy'}
									</Typography>
									<Typography variant='body2' color='textSecondary' style={{ fontSize: '0.75rem' }}>
										<strong>Kod:</strong> {event.code}
									</Typography>
									<Typography variant='body2' color='textSecondary' style={{ fontSize: '0.75rem' }}>
										<strong>Aktywny od:</strong> {event.activeTs ? new Date(event.activeTs).toLocaleString() : 'Brak danych'}
									</Typography>
								</Box>
							</ListItem>
						))}
					</List>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DrawViewItemAlarmComponent;
