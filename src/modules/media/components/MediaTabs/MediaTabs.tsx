import MediaConsumptions from 'modules/media/components/MediaTabs/MediaConsumptions/MediaConsumptions';
import MediaEvents from 'modules/media/components/MediaTabs/MediaEvents/MediaEvents';
import MediaParams from 'modules/media/components/MediaTabs/MediaParams/MediaParams';
import MediaReadings from 'modules/media/components/MediaTabs/MediaReadings/MediaReadings';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

interface MediaTabsProps {
	points: Point[];
}

const MediaTabs: React.FC<MediaTabsProps> = ({ points }) => {
	return (
		<Switch>
			<Route exact path={`/media/:deviceUUID/readings/:horizontalTab?`} render={() => <MediaReadings points={points} />} />
			<Route exact path={`/media/:deviceUUID/consumptions`} render={() => <MediaConsumptions />} />
			<Route exact path={`/media/:deviceUUID/params`} render={() => <MediaParams points={points} />} />
			<Route exact path={`/media/:deviceUUID/events/:mediaEventUUID?`} render={() => <MediaEvents />} />
		</Switch>
	);
};

export default MediaTabs;
