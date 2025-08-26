import { DragEndEvent, LeafletEvent } from 'leaflet';
import { debounce } from 'lodash';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import React, { useCallback, useState } from 'react';
import { Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { TriggerMapDataProps } from '../hooks/useMapData';
import MapHint from './MapHint/MapHint';
import createGroupIcon from './MapMarkers/createGroupIcon';
import createMarkerIcon from './MapMarkers/createPinIcon';
import './map.css';

interface MapContainerContentProps {
	pins: MapBuildingPin[];
	groups: MapBuildingGroupPin[];
	filterConnection: string;
	filterAlarm: string;
	filterAlarmState: number[];
	filterSearch: string | null;
	triggerMapData: (props: TriggerMapDataProps) => void;
	zoom: number;
	setZoom: React.Dispatch<React.SetStateAction<number>>;
	setCenter: React.Dispatch<
		React.SetStateAction<{
			lat: number;
			lng: number;
		}>
	>;
	formattedBounds: { n: number; s: number; e: number; w: number };
	setFormattedBounds: React.Dispatch<
		React.SetStateAction<{
			n: number;
			s: number;
			e: number;
			w: number;
		}>
	>;
}

const MapContainerContent: React.FC<MapContainerContentProps> = ({
	pins,
	groups,
	filterConnection,
	filterAlarm,
	filterAlarmState,
	filterSearch,
	triggerMapData,
	zoom,
	setZoom,
	setCenter,
	formattedBounds,
	setFormattedBounds,
}) => {
	const [popupKey, setPopupKey] = useState<{ openedUUID: string | null; popupKey: number }>({
		openedUUID: null,
		popupKey: 0,
	});

	const debouncedTriggerMapData = useCallback(
		debounce((center, zoom, bounds, filterConnection: string, filterAlarm: string, filterAlarmState: number[], filterSearch: string | null) => {
			triggerMapData({
				lat: center.lat,
				lng: center.lng,
				zoom: zoom,
				n: bounds.n,
				s: bounds.s,
				e: bounds.e,
				w: bounds.w,
				f_c: filterConnection as 'ALL' | 'ONLINE' | 'OFFLINE',
				f_a: filterAlarm as 'ALL' | 'ACTIVE' | 'INACTIVE',
				f_a_l: filterAlarm === 'ACTIVE' ? filterAlarmState.map(alarmState => getEventsPriorityName(alarmState)) : undefined,
				q: filterSearch,
			});
		}, 600),
		[]
	);

	const onMapEvents = useCallback(
		(evt: DragEndEvent | LeafletEvent) => {
			const zoom = evt.target.getZoom();
			const center = evt.target.getCenter();
			const bounds = evt.target.getBounds();
			const n = bounds?.getNorth() || formattedBounds.n;
			const s = bounds?.getSouth() || formattedBounds.s;
			const e = bounds?.getEast() || formattedBounds.e;
			const w = bounds?.getWest() || formattedBounds.w;
			setCenter(center);
			setZoom(zoom);
			setFormattedBounds({ n, s, e, w });
			debouncedTriggerMapData(center, zoom, { n, s, e, w }, filterConnection, filterAlarm, filterAlarmState, filterSearch);
		},
		[filterConnection, filterAlarm, filterAlarmState, filterSearch]
	);

	useMapEvents({
		load: evt => {
			const zoom = evt.target.getZoom();
			const center = evt.target.getCenter();
			const bounds = evt.target.getBounds();
			const n = bounds?.getNorth() || formattedBounds.n;
			const s = bounds?.getSouth() || formattedBounds.s;
			const e = bounds?.getEarth() || formattedBounds.e;
			const w = bounds?.getWest() || formattedBounds.w;
			setCenter(center);
			setZoom(zoom);
			setFormattedBounds({ n, s, e, w });
		},
		dragend: evt => {
			onMapEvents(evt);
		},
		zoomend: evt => {
			const zoomMap = evt.target.getZoom();
			if (zoom !== zoomMap) {
				onMapEvents(evt);
			}
		},
	});

	return (
		<>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			{pins.map(pin => (
				<Marker
					key={pin.uuid}
					eventHandlers={{
						popupopen: () => setPopupKey(prevKey => ({ openedUUID: pin.uuid, popupKey: prevKey.popupKey + 1 })),
					}}
					icon={createMarkerIcon({ ...pin, zoom })}
					alt={JSON.stringify(pin)}
					position={[Number(pin.pos[0]), Number(pin.pos[1])]}
				>
					<Popup maxWidth={1000} maxHeight={1000}>
						<MapHint popupKey={popupKey} pin={pin} />
					</Popup>
				</Marker>
			))}
			{groups.map(group => (
				<Marker key={group.id} icon={createGroupIcon(group)} alt={JSON.stringify(group)} position={[Number(group.pos[0]), Number(group.pos[1])]} />
			))}
		</>
	);
};

export default MapContainerContent;
