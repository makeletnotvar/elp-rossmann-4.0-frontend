import { MAP_DEFAULT_LATITUDE, MAP_DEFAULT_LONGITUDE, MAP_DEFAULT_ZOOM } from '../components/MapLayout';

export const useGetUrlParams = (search: string, formattedBounds: { n: number; s: number; e: number; w: number }) => {
	const urlParams = new URLSearchParams(search);
	const zoomFromUrl = urlParams.get('zoom');
	const latFromUrl = urlParams.get('lat');
	const lngFromUrl = urlParams.get('lng');
	const filterConnectionFromUrl = urlParams.get('filterConnection');
	const filterAlarmFromUrl = urlParams.get('filterAlarm');
	const filterAlarmStateFromUrl = urlParams.get('filterAlarmState');
	const q = urlParams.get('q');
	const n = urlParams.get('n') || formattedBounds.n;
	const s = urlParams.get('s') || formattedBounds.s;
	const e = urlParams.get('e') || formattedBounds.e;
	const w = urlParams.get('w') || formattedBounds.w;

	return {
		zoom: zoomFromUrl ? parseFloat(zoomFromUrl) : MAP_DEFAULT_ZOOM,
		center: { lat: latFromUrl ? parseFloat(latFromUrl) : MAP_DEFAULT_LATITUDE, lng: lngFromUrl ? parseFloat(lngFromUrl) : MAP_DEFAULT_LONGITUDE },
		filterConnection: filterConnectionFromUrl || 'ALL',
		filterAlarm: filterAlarmFromUrl || 'ALL',
		filterAlarmState: filterAlarmStateFromUrl ? filterAlarmStateFromUrl.split(',').map(Number) : [0, 1, 2, 3, 4],
		q,
		n,
		s,
		e,
		w,
	};
};
