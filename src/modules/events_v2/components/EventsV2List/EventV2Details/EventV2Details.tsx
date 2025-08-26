import { BarChartOutlined, DetailsOutlined, ErrorOutlined, HistoryOutlined } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Badge, Box, Tab, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import AlarmsConfigListItemPriorityCell from 'modules/alarmsConfig/components/AlarmsConfigList/AlarmsConfigListItem/AlarmsConfigListItemPriorityCell';
import CustomDialog from 'modules/common/components/Dialogs/CustomDialog/CustomDialog';
import { ElpEventV2 } from 'modules/events_v2/interfaces/eventV2.interface';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EventV2Details.module.scss';
import EventV2DetailsHeatmaps from './EventV2DetailsHeatmaps/EventV2DetailsHeatmaps';
import EventV2DetailsHistory from './EventV2DetailsHistory/EventV2DetailsHistory';
import EventV2DetailsInstance from './EventV2DetailsInstance/EventV2DetailsInstance';

interface EventV2DetailsProps {
	event: ElpEventV2;
	onClose: () => void;
	params: {
		eventUUID: string | null;
		alarmCode: string | null;
		deviceUUID: string | null;
	};
	tab: 'active' | 'history';
}

const EventDetails: React.FC<EventV2DetailsProps> = ({ event, params, onClose, tab }) => {
	const [value, setValue] = useState('event-instance');

	const onChange = (event: React.ChangeEvent<object>, value: any) => {
		setValue(value);
	};

	const theme = useTheme();
	const mobileSize = useMediaQuery(theme.breakpoints.down('sm'));
	const { t } = useTranslation();
	const { name, isActive, code } = event;

	return (
		<CustomDialog
			open
			customTitle={
				<Box style={{ display: 'flex', alignItems: 'center', gap: isActive ? 12 : 8 }}>
					<Badge
						overlap='rectangular'
						badgeContent={
							isActive && (
								<Tooltip title={isActive ? t('general.active') : t('general.inactive')}>
									<ErrorOutlined color='error' />
								</Tooltip>
							)
						}
					>
						<AlarmsConfigListItemPriorityCell row={event} value={event.priority} />
					</Badge>
					<Box style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<Typography variant='h6' style={{ fontSize: mobileSize ? '0.875rem' : '1.25rem', fontWeight: 400 }}>
							{name}
						</Typography>
						<Typography variant='h6' style={{ fontSize: mobileSize ? '0.875rem' : '1.25rem', fontWeight: 400, color: '#aaa' }}>
							({code})
						</Typography>
					</Box>
				</Box>
			}
			style={{ height: value === 'stats' ? '800px' : '500px' }}
			maxWidth={value === 'stats' ? 'xl' : 'lg'}
			onClose={onClose}
		>
			<TabContext value={value}>
				<Box style={{ height: 'calc(100% - 24px)' }}>
					<TabList
						textColor='primary'
						variant='scrollable'
						scrollButtons='auto'
						style={{ minHeight: '35px', whiteSpace: 'nowrap', borderBottom: '1px solid #ddd' }}
						onChange={onChange}
					>
						<Tab
							className={styles.tab}
							style={{ minHeight: '35px', whiteSpace: 'nowrap', textTransform: 'none', flexDirection: 'row' }}
							icon={<DetailsOutlined fontSize='inherit' />}
							label={<Typography style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>{t('events.tabs_details.details')}</Typography>}
							value='event-instance'
						/>
						<Tab
							className={styles.tab}
							style={{ minHeight: '35px', whiteSpace: 'nowrap', textTransform: 'none', flexDirection: 'row' }}
							icon={<HistoryOutlined fontSize='inherit' />}
							label={<Typography style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>{t('events.tabs_details.history')}</Typography>}
							value='history'
						/>
						<Tab
							className={styles.tab}
							style={{ minHeight: '35px', whiteSpace: 'nowrap', textTransform: 'none', flexDirection: 'row' }}
							icon={<BarChartOutlined fontSize='inherit' />}
							label={<Typography style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>{t('events.tabs_details.stats')}</Typography>}
							value='stats'
						/>
					</TabList>
					<TabPanel style={{ padding: 0, height: 'calc(100% - 38px)', width: '100%' }} value='event-instance'>
						<EventV2DetailsInstance tab={tab} params={params} event={event} />
					</TabPanel>
					<TabPanel style={{ padding: 0, height: 'calc(100% - 38px)', width: '100%' }} value='history'>
						<EventV2DetailsHistory params={params} event={event} />
					</TabPanel>
					<TabPanel style={{ padding: 0, height: 'calc(100% - 38px)', width: '100%' }} value='stats'>
						<EventV2DetailsHeatmaps params={params} event={event} />
					</TabPanel>
				</Box>
			</TabContext>
		</CustomDialog>
	);
};

export default EventDetails;
