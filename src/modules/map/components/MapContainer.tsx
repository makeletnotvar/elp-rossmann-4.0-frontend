import MapLayout from 'modules/map/components/MapLayout';
import React from 'react';
import useMapData from '../hooks/useMapData';

const MapContainer: React.FC = () => {
	const { groups, pins, stats, triggerMapData, fetching, fetched } = useMapData();

	return <MapLayout pins={pins} groups={groups} statistics={stats} triggerMapData={triggerMapData} fetching={fetching} fetched={fetched} />;
};

export default MapContainer;
