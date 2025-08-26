import { NotificationsActiveOutlined, NotificationsNoneOutlined, NotificationsOffOutlined } from '@mui/icons-material';
import { AppBar, Tabs } from '@mui/material';
import { omit, pick } from 'lodash';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import EventsV2AlarmsBlocksListContainer from 'modules/events_v2/components/EventsV2AlarmsBlocksList/EventsV2AlarmsBlocksListContainer';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import useRouter from 'use-react-router';
import EventsV2ListContainer from '../EventsV2List/EventsV2ListContainer';
import EventsV2Tab from './EventsV2Tab/EventsV2Tab';
import styles from './EventsV2Tabs.module.scss';

interface EventsV2buildingTabsProps {
	building: Building;
}

const EventsV2BuildingTabs: React.FC<EventsV2buildingTabsProps> = ({ building }) => {
	const [disabledTabs, setDisabledTabs] = useState<boolean>(false);
	const { location, history } = useRouter();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		if (!urlParams.has('F_building') || urlParams.get('F_building') !== building.uuid) {
			urlParams.set('F_building', building.uuid);
			urlParams.delete('F_reason');
			urlParams.delete('F_isActive');
			history.replace({
				pathname: `/building/${building.uuid}/events-v2/active`,
				search: urlParams.toString(),
			});
		}
	}, [location.search, location.pathname, building]);

	const { t } = useTranslation();

	const getCurrentTabIndex = (pathname: string) => {
		if (pathname.startsWith(`/building/${building.uuid}/events-v2/active`)) return 0;
		if (pathname.startsWith(`/building/${building.uuid}/events-v2/history`)) return 1;
		if (pathname.startsWith(`/building/${building.uuid}/events-v2/confirmed`)) return 2;
		return false;
	};

	return (
		<React.Fragment>
			<Route
				path='/building/:uuid/events-v2'
				render={history => {
					const queryParams = {
						...queryString.parse(history.location.search),
						F_building: building?.uuid,
					};

					return (
						<AppBar style={{ background: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between' }} position='static' elevation={0}>
							<Tabs textColor='primary' className={styles.tabs} value={getCurrentTabIndex(history.location.pathname)}>
								<EventsV2Tab
									label={t('events.tabs.active')}
									icon={NotificationsActiveOutlined}
									history={history}
									to={`/building/${building?.uuid}/events-v2/active?${queryString.stringify(omit(queryParams, ['F_reason', 'o']))}`}
									tabPath='/building/:uuid/events-v2/active'
									value={0}
									disabled={disabledTabs}
								/>
								<EventsV2Tab
									label={t('events.tabs.history')}
									icon={NotificationsNoneOutlined}
									history={history}
									to={`/building/${building?.uuid}/events-v2/history?${queryString.stringify(omit(queryParams, ['F_reason', 'F_isActive', 'o']))}`}
									tabPath='/building/:uuid/events-v2/history'
									value={1}
									disabled={disabledTabs}
								/>
								<AuthDevOrAdmin>
									<EventsV2Tab
										label={t('events.tabs.confirmed')}
										icon={NotificationsOffOutlined}
										history={history}
										to={`/building/${building?.uuid}/events-v2/confirmed?${queryString.stringify(pick(queryParams, ['F_building', 'F_reason', 's']))}`}
										tabPath='/building/:uuid/events-v2/confirmed'
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
				<Route
					exact
					path='/building/:uuid/events-v2'
					render={() => <Redirect to={`/building/${building?.uuid}/events-v2/active?${queryString.stringify({ F_building: building.uuid })}`} />}
				/>
				<Route
					path='/building/:uuid/events-v2/active/:eventUUID?/:confirm?'
					render={() => <EventsV2ListContainer tab={'active'} buildingUUID={building?.uuid} setDisabledTabs={setDisabledTabs} />}
				/>
				<Route
					path='/building/:uuid/events-v2/history/:eventUUID?/:confirm?'
					render={() => <EventsV2ListContainer tab={'history'} buildingUUID={building?.uuid} setDisabledTabs={setDisabledTabs} />}
				/>
				<Route
					path='/building/:uuid/events-v2/confirmed/:code?'
					render={() => (
						<AuthDevOrAdmin>
							<EventsV2AlarmsBlocksListContainer buildingUUID={building?.uuid} setDisabledTabs={setDisabledTabs} />
						</AuthDevOrAdmin>
					)}
				/>
				<Route
					exact
					path='/building/:uuid/events-v2/*'
					render={() => <Redirect to={`/building/${building?.uuid}/events-v2/active/${queryString.stringify({ F_building: building.uuid })}`} />}
				/>
			</Switch>
		</React.Fragment>
	);
};

export default EventsV2BuildingTabs;
