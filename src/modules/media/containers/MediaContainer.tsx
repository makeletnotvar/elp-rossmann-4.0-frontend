import MediaLayoutContainer from 'modules/media/components/MediaLayout/MediaLayoutContainer';
import MediaList from 'modules/media/components/MediaList/MediaList';
import { getDefaultMediaDevicesListPath } from 'modules/media/helpers/media';
import { Redirect, Route, Switch } from 'react-router-dom';

const MediaContainer = () => {
	return (
		<Switch>
			<Route exact path='/media' render={() => <Redirect to={getDefaultMediaDevicesListPath()} />} />
			<Route exact path='/media/list' render={() => <MediaList />} />
			<Route exact path='/media/:deviceUUID/:tab?/:horizontalTab?' render={() => <MediaLayoutContainer />} />
		</Switch>
	);
};

export default MediaContainer;
