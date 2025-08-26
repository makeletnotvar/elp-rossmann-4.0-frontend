import { MapOutlined } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import Loader from 'modules/common/components/Loaders/Loader';
import { getEventsPriorityName } from 'modules/events_v2/helpers/eventsV2';
import MapFilters from 'modules/map/components/MapFilters/MapFilters';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer } from 'react-leaflet';
import useRouter from 'use-react-router';
import { useGetUrlParams } from '../hooks/useGetUrlParams';
import { TriggerMapDataProps } from '../hooks/useMapData';
import { useMapPolling } from '../redux/map';
import MapContainerContent from './MapContainerContent';
import MapInfo from './MapInfo/MapInfo';
import styles from './MapLayout.module.scss';
import MapSearch from './MapSearch/MapSearch';
import MapZoomControl from './MapZoomControl/MapZoomControl';

interface MapLayoutProps {
	groups: MapBuildingGroupPin[];
	pins: MapBuildingPin[];
	statistics: MapBuildingStats;
	triggerMapData: (props: TriggerMapDataProps) => void;
	fetching: boolean;
	fetched: boolean;
}

export const MAP_DEFAULT_ZOOM = 7.1;
export const MAP_DEFAULT_LATITUDE = 52.0;
export const MAP_DEFAULT_LONGITUDE = 19.5;

const MapLayout: React.FC<MapLayoutProps> = ({ pins, groups, statistics, triggerMapData, fetching, fetched }) => {
	const [initialLoading, setInitialLoading] = useState(true);
	const mapRef = useRef<any>(null);
	const { t } = useTranslation();

	const {
		history,
		location: { search },
	} = useRouter();
	const [filterConnection, setFilterConnection] = useState<string>('ALL');
	const [filterAlarm, setFilterAlarm] = useState<string>('ALL');
	const [filterAlarmState, setFilterAlarmState] = useState<number[]>([0, 1, 2, 3, 4]);
	const [filterSearch, setFilterSearch] = useState<string | null>(null);
	const [zoom, setZoom] = useState<number>(MAP_DEFAULT_ZOOM);
	const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: MAP_DEFAULT_LATITUDE, lng: MAP_DEFAULT_LONGITUDE });
	const [formattedBounds, setFormattedBounds] = useState<{ n: number; s: number; e: number; w: number }>({
		n: 54.7816821000196,
		s: 49.07386590128542,
		e: 26.257324218750004,
		w: 12.744140625000002,
	});
	const urlParamsFromSearch = useGetUrlParams(search, formattedBounds);

	const handleTriggerMapData = (overrides: Partial<TriggerMapDataProps> = {}) => {
		triggerMapData({
			lat: center.lat,
			lng: center.lng,
			zoom,
			n: formattedBounds.n,
			s: formattedBounds.s,
			e: formattedBounds.e,
			w: formattedBounds.w,
			f_c: filterConnection as 'ALL' | 'ONLINE' | 'OFFLINE',
			f_a: filterAlarm as 'ALL' | 'ACTIVE' | 'INACTIVE',
			f_a_l: filterAlarm === 'ACTIVE' ? filterAlarmState.map(alarmState => getEventsPriorityName(alarmState)) : undefined,
			q: filterSearch,
			...overrides,
		});
	};

	useMapPolling({
		lat: center.lat,
		lng: center.lng,
		zoom,
		n: formattedBounds.n,
		s: formattedBounds.s,
		e: formattedBounds.e,
		w: formattedBounds.w,
		f_c: filterConnection as 'ALL' | 'ONLINE' | 'OFFLINE',
		f_a: filterAlarm as 'ALL' | 'ACTIVE' | 'INACTIVE',
		f_a_l: filterAlarm === 'ACTIVE' ? filterAlarmState.map(alarmState => getEventsPriorityName(alarmState)) : undefined,
		q: filterSearch,
	});

	useEffect(() => {
		if (fetched) {
			setInitialLoading(false);
		}
	}, [fetched]);

	const mapZoomIn = (e: any) => {
		e.preventDefault();
		mapRef.current.setZoom(mapRef.current.getZoom() + 1);
	};

	const mapZoomOut = (e: any) => {
		e.preventDefault();
		mapRef.current.setZoom(mapRef.current.getZoom() - 1);
	};

	useEffect(() => {
		const { zoom, center, filterConnection, filterAlarm, filterAlarmState, q, n, s, e, w } = urlParamsFromSearch;
		setZoom(zoom);
		setCenter(center);
		setFilterConnection(filterConnection);
		setFilterAlarm(filterAlarm);
		setFilterAlarmState(filterAlarmState);
		setFilterSearch(q);
		setFormattedBounds({ n: Number(n), s: Number(s), e: Number(e), w: Number(w) });
		mapRef?.current?.setView(center, zoom);
	}, [mapRef?.current]);

	useEffect(() => {
		const urlParams = new URLSearchParams();
		urlParams.set('lat', center.lat.toString());
		urlParams.set('lng', center.lng.toString());
		urlParams.set('zoom', zoom.toString());
		urlParams.set('filterConnection', filterConnection);
		urlParams.set('filterAlarm', filterAlarm);
		urlParams.set('filterAlarmState', filterAlarmState.join(','));
		filterSearch && urlParams.set('q', filterSearch);
		urlParams.set('n', String(formattedBounds.n));
		urlParams.set('s', String(formattedBounds.s));
		urlParams.set('e', String(formattedBounds.e));
		urlParams.set('w', String(formattedBounds.w));
		history.replace({ search: urlParams.toString() });
	}, [zoom, center, formattedBounds, filterConnection, filterAlarm, filterAlarmState, filterSearch]);

	return (
		<>
			{initialLoading && <Loader />}
			<div className={styles.container}>
				<TitleBar label={t('pages.map')} icon={MapOutlined}>
					<MapFilters
						filterConnection={filterConnection}
						filterAlarm={filterAlarm}
						filterAlarmState={filterAlarmState}
						setFilterConnection={value => {
							setFilterConnection(value);
							handleTriggerMapData({ f_c: value as 'ALL' | 'ONLINE' | 'OFFLINE' });
						}}
						setFilterAlarm={value => {
							setFilterAlarm(value);
							handleTriggerMapData({
								f_a: value as 'ALL' | 'ACTIVE' | 'INACTIVE',
								f_a_l: value === 'ACTIVE' ? filterAlarmState.map(getEventsPriorityName) : undefined,
							});
						}}
						setFilterAlarmState={value => {
							const newValue = Array.isArray(value) ? value : [];
							setFilterAlarmState(newValue);
							handleTriggerMapData({ f_a_l: filterAlarm === 'ACTIVE' ? newValue.map(getEventsPriorityName) : undefined });
						}}
					/>
				</TitleBar>
				<MapInfo statistics={statistics} />
				<MapZoomControl mapZoomIn={mapZoomIn} mapZoomOut={mapZoomOut} zoom={zoom} />
				<MapSearch
					filterSearch={filterSearch}
					setFilterSearch={value => {
						setFilterSearch(value);
						handleTriggerMapData({ q: value });
					}}
				/>
				<MapContainer
					ref={mapRef}
					className={styles.mapContainer}
					center={[center.lat, center.lng]}
					zoom={zoom}
					scrollWheelZoom={true}
					zoomControl={false}
					maxZoom={15}
					minZoom={5}
					whenReady={() => {
						triggerMapData({
							lat: urlParamsFromSearch.center.lat,
							lng: urlParamsFromSearch.center.lng,
							zoom: urlParamsFromSearch.zoom,
							n: Number(urlParamsFromSearch.n) || formattedBounds.n,
							s: Number(urlParamsFromSearch.s) || formattedBounds.s,
							e: Number(urlParamsFromSearch.e) || formattedBounds.e,
							w: Number(urlParamsFromSearch.w) || formattedBounds.w,
							f_c: urlParamsFromSearch.filterConnection as 'ALL' | 'ONLINE' | 'OFFLINE',
							f_a: urlParamsFromSearch.filterAlarm as 'ALL' | 'ACTIVE' | 'INACTIVE',
							f_a_l:
								urlParamsFromSearch.filterAlarm === 'ACTIVE'
									? urlParamsFromSearch.filterAlarmState.map(alarmState => getEventsPriorityName(alarmState))
									: undefined,
							q: urlParamsFromSearch.q,
						});
					}}
				>
					<MapContainerContent
						pins={pins}
						groups={groups}
						filterConnection={filterConnection}
						filterAlarm={filterAlarm}
						filterAlarmState={filterAlarmState}
						filterSearch={filterSearch}
						formattedBounds={formattedBounds}
						triggerMapData={triggerMapData}
						zoom={zoom}
						setZoom={setZoom}
						setCenter={setCenter}
						setFormattedBounds={setFormattedBounds}
					/>
				</MapContainer>
			</div>
		</>
	);
};

export default MapLayout;
