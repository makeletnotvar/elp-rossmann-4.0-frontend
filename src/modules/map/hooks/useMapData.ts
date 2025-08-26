import { useDispatch } from 'react-redux';
import { mapDataActions, useMapDataState } from '../redux/map';

export interface TriggerMapDataProps {
	zoom: number;
	lat: number;
	lng: number;
	n?: number;
	s?: number;
	e?: number;
	w?: number;
	f_c?: 'ALL' | 'ONLINE' | 'OFFLINE';
	f_a?: 'ALL' | 'ACTIVE' | 'INACTIVE';
	f_a_l?: EventPriority[];
	q?: string | null;
}

const useMapData = () => {
	const {
		data: { groups, pins, stats },
		fetching,
		fetched,
	} = useMapDataState();
	const dispatch = useDispatch();

	const triggerMapData = (props: TriggerMapDataProps) => {
		const triggerProps: TriggerMapDataProps = Object.fromEntries(Object.entries(props).filter(([_, v]) => v !== null)) as TriggerMapDataProps;
		dispatch(mapDataActions.getMapData.request(triggerProps));
	};

	return {
		groups,
		pins,
		stats,
		triggerMapData,
		fetching,
		fetched,
	};
};

export default useMapData;
