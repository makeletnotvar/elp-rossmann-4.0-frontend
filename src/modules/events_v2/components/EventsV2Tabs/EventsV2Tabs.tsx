import { NotificationsActiveOutlined, NotificationsNoneOutlined, NotificationsOffOutlined } from '@mui/icons-material';
import { AppBar, Tabs } from '@mui/material';
import { omit, pick } from 'lodash';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import EventsV2AlarmsBlocksListContainer from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListContainer';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import EventsV2ListContainer from '../EventsV2List/EventsV2ListContainer';
import EventsV2Tab from './EventsV2Tab/EventsV2Tab';
import styles from './EventsV2Tabs.module.scss';

const EventsV2Tabs: React.FC = () => {
	const [disabledTabs, setDisabledTabs] = useState<boolean>(false);

	const { t } = useTranslation();

	const getCurrentTabIndex = (pathname: string) => {
		if (pathname.startsWith('/events-v2/active')) return 0;
		if (pathname.startsWith('/events-v2/history')) return 1;
		if (pathname.startsWith('/events-v2/confirmed')) return 2;
		return false;
	};

	return (
		<React.Fragment>
			<Route
				path='/events-v2'
				render={history => {
					const queryParams = queryString.parse(history.location.search);

					return (
						<AppBar style={{ background: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between' }} position='static' elevation={0}>
							<Tabs textColor='primary' className={styles.tabs} value={getCurrentTabIndex(history.location.pathname)}>
								<EventsV2Tab
									label={t('events.tabs.active')}
									icon={NotificationsActiveOutlined}
									history={history}
									to={`/events-v2/active?${queryString.stringify(omit(queryParams, ['F_reason', 'o']))}`}
									tabPath='/events-v2/active'
									value={0}
									disabled={disabledTabs}
								/>
								<EventsV2Tab
									label={t('events.tabs.history')}
									icon={NotificationsNoneOutlined}
									history={history}
									to={`/events-v2/history?${queryString.stringify(omit(queryParams, ['F_reason', 'F_isActive', 'o']))}`}
									tabPath='/events-v2/history'
									value={1}
									disabled={disabledTabs}
								/>
								<AuthDevOrAdmin>
									<EventsV2Tab
										label={t('events.tabs.confirmed')}
										icon={NotificationsOffOutlined}
										history={history}
										to={`/events-v2/confirmed?${queryString.stringify(pick(queryParams, ['F_building', 'F_reason', 's']))}`}
										tabPath='/events-v2/confirmed'
										value={2}
										disabled={disabledTabs}
									/>
								</AuthDevOrAdmin>
							</Tabs>
							<div id='events-custom' className={styles.titleBarCustom}></div>
						</AppBar>
					);
				}}
			/>
			<Switch>
				<Route exact path='/events-v2' render={() => <Redirect to='/events-v2/active' />} />
				<Route path='/events-v2/active/:eventUUID?/:confirm?' render={() => <EventsV2ListContainer tab={'active'} setDisabledTabs={setDisabledTabs} />} />
				<Route path='/events-v2/history/:eventUUID?/:confirm?' render={() => <EventsV2ListContainer tab={'history'} setDisabledTabs={setDisabledTabs} />} />
				<Route
					path='/events-v2/confirmed/:code?'
					render={() => (
						<AuthDevOrAdmin>
							<EventsV2AlarmsBlocksListContainer setDisabledTabs={setDisabledTabs} />
						</AuthDevOrAdmin>
					)}
				/>
				<Route exact path='/events-v2/*' render={() => <Redirect to='/events-v2/active' />} />
			</Switch>
		</React.Fragment>
	);
};

export default EventsV2Tabs;
