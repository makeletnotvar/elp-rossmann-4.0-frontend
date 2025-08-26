// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import MapContainer from 'modules/map/components/MapContainer';
import { getMapModule } from 'modules/map/redux';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';

const MapApp = () => {
	return (
		<DynamicModuleLoader modules={[getMapModule()]}>
			<MapContainer />
		</DynamicModuleLoader>
	);
};

export default MapApp;
