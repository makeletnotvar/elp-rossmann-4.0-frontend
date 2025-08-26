import { AcUnitOutlined, FunctionsOutlined } from '@mui/icons-material';
import { AppBar, Tab, Tabs } from '@mui/material';
import cn from 'classnames';
import Content from 'modules/common/components/Layout/Content/Content';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { pollActions } from 'modules/common/redux/poll';
import MediaReadingsAirConditioning from 'modules/media/components/MediaTabs/MediaReadings/MediaReadingsAirConditioning/MediaReadingsAirConditioning';
import MediaReadingsTotalConsumptions from 'modules/media/components/MediaTabs/MediaReadings/MediaReadingsTotalConsumption/MediaReadingsTotalConsumption';
import * as React from 'react';
import { useEffect } from 'react';
import { Redirect, Route, Link as RouterLink, Switch } from 'react-router-dom';
import useRouter from 'use-react-router';
import styles from './MediaReadings.module.scss';

interface MediaReadingsProps {
	points: Point[];
}

const MediaReadings: React.FC<MediaReadingsProps> = ({ points }) => {
	const {
		match: {
			params: { deviceUUID },
		},
	} = useRouter<{ deviceUUID: string }>();
	const dispatch = useDispatch();

	const isActive = (historyPath: string, path: string) => {
		return historyPath.includes(path);
	};

	const isActiveTab = (historyPath: string, tab: string) => {
		return cn(styles.tab, {
			[styles.activeTab]: isActive(historyPath, tab),
		});
	};

	useEffect(() => {
		const uuids = points.map(point => point.uuid).filter(uuid => uuid && uuid !== undefined) as string[];
		dispatch(pollActions.poll.request(uuids));
	}, [points]);

	return (
		<Content>
			<Route
				path='/media/:deviceUUID/readings'
				render={history => (
					<AppBar style={{ background: '#dfdfdf', flexDirection: 'row', justifyContent: 'space-between' }} position='static' elevation={0}>
						<Tabs
							textColor='primary'
							className={styles.tabs}
							value={history.location.pathname !== `/media/${deviceUUID}/readings` ? history.location.pathname : false}
						>
							<Tab
								className={isActiveTab(history.location.pathname, `/media/${deviceUUID}/readings/total`)}
								icon={<FunctionsOutlined fontSize='small' style={{ margin: 0, marginRight: '3px' }} />}
								label={`Zużycie sumaryczne`}
								value={history.location.pathname.includes(`/media/${deviceUUID}/readings/total`) ? history.location.pathname : false}
								component={RouterLink}
								to={`/media/${deviceUUID}/readings/total`}
							/>
							<Tab
								className={isActiveTab(history.location.pathname, `/media/${deviceUUID}/readings/ac`)}
								icon={<AcUnitOutlined fontSize='small' style={{ margin: 0, marginRight: '3px' }} />}
								label={`Klimatyzacja`}
								value={history.location.pathname.includes(`/media/${deviceUUID}/readings/ac`) ? history.location.pathname : false}
								component={RouterLink}
								to={`/media/${deviceUUID}/readings/ac`}
							/>
						</Tabs>
					</AppBar>
				)}
			/>
			<Switch>
				<Route exact path='/media/:deviceUUID/readings' render={() => <Redirect to={`/media/${deviceUUID}/readings/total`} />} />
				<Route path='/media/:deviceUUID/readings/total' render={() => <MediaReadingsTotalConsumptions points={points} />} />
				<Route path='/media/:deviceUUID/readings/ac' render={() => <MediaReadingsAirConditioning points={points} />} />
				<Route exact path='/media/:deviceUUID/readings/*' render={() => <Redirect to={`/media/${deviceUUID}/readings/total`} />} />
			</Switch>
		</Content>
	);
};

export default MediaReadings;
