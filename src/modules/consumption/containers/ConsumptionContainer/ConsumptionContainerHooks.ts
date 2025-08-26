import { YEAR_TS } from 'helpers/date';
import { consumptionActions, useConsumptionState } from 'modules/consumption/redux/consumption';
import queryString from 'query-string';
import { useEffect } from 'react';
import useRouter from 'use-react-router';
import { useDispatch } from '../../../common/helpers/redux/useActions';
import { MONTH } from '../../constants/periods';

interface ConsumptionRouteProps extends Pick<ConsumptionDataRequestSettings, 'from' | 'to' | 'period' | 'offset'> {}

export const CONSUMPTION_DEFAULT_ROUTE_PROPS = {
	period: MONTH,
	offset: 1, // 1 - 31
	to: Date.now(),
	from: Date.now() - YEAR_TS,
};

export function getConsumptionDefaultRouteProps() {
	return queryString.stringify(CONSUMPTION_DEFAULT_ROUTE_PROPS);
}

function getConsumptionRouteProps(query: string): Pick<ConsumptionDataRequestSettings, 'period' | 'from' | 'to' | 'offset'> {
	const props: ConsumptionRouteProps = queryString.parse(query);
	return {
		period: props.period || CONSUMPTION_DEFAULT_ROUTE_PROPS.period,
		to: Number(props.to) || CONSUMPTION_DEFAULT_ROUTE_PROPS.to,
		from: Number(props.from) || CONSUMPTION_DEFAULT_ROUTE_PROPS.from,
		offset: Number(props.offset) || CONSUMPTION_DEFAULT_ROUTE_PROPS.offset,
	};
}

interface ConsumptionRoute {
	settings: ConsumptionDataRequestSettings;
	changeHandler: (nextSettings: ConsumptionDataRequestSettings & { building: string }) => void;
}

export function useConsumptionRoute(): ConsumptionRoute {
	const {
		history,
		location: { search },
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();
	const routeProps = getConsumptionRouteProps(search);
	const dispatch = useDispatch();

	const settings = {
		...routeProps,
		building: uuid,
	};

	const changeHandler = (nextSettings: ConsumptionDataRequestSettings & { building: string }) => {
		const { building, ...rest } = nextSettings;
		history.push(`/consumption/${building}?${queryString.stringify(nextSettings)}`);
		setTimeout(() => dispatch(consumptionActions.fetch(nextSettings)), 300);
	};

	return {
		settings,
		changeHandler,
	};
}

export function useConsumptionData() {
	const { data, status } = useConsumptionState();
	const { settings, changeHandler } = useConsumptionRoute();
	const dispatch = useDispatch();

	/**
	 * Fetch new consumption data on every [settings] update
	 */
	useEffect(() => {
		if (settings && settings.building) {
			dispatch(consumptionActions.fetch(settings));
		}
	}, []);

	return {
		data,
		status,
		settings,
		building: data.building,
		changeHandler,
	};
}
