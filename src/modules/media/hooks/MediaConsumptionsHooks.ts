import { DAY_TS } from 'helpers/date';
import _ from 'lodash';
import queryString from 'query-string';
import { useEffect, useMemo } from 'react';
import useRouter from 'use-react-router';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { AsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { DAY } from 'modules/media/constants/periods';
import { mediaDeviceConsumptionDataActions, useMediaDeviceConsumptionDataState } from 'modules/media/redux/mediaConsumptionData';
import { prepareData } from 'modules/consumption/redux/consumption';

interface MediaConsumptionsRouteProps extends Pick<MediaConsumptionsRequestSettings, 'fromTs' | 'toTs' | 'deviceUUID' | 'source' | 'period'> { }

export const MEDIA_CONSUMPTIONS_DEFAULT_ROUTE_PROPS: Pick<MediaConsumptionsRequestSettings, 'fromTs' | 'toTs' | 'source' | 'period'> = {
  period: DAY,
  source: 'TOTAL',
  fromTs: Date.now() - 31 * DAY_TS,
  toTs: Date.now()
};

export function getConsumptionsDefaultRouteProps() {
  return queryString.stringify(MEDIA_CONSUMPTIONS_DEFAULT_ROUTE_PROPS);
}

function getMediaConsumptionsRouteProps(query: string): Pick<MediaConsumptionsRequestSettings, 'fromTs' | 'toTs' | 'deviceUUID' | 'source' | 'period'> {
  const props: MediaConsumptionsRouteProps = queryString.parse(query);

  return {
    period: props.period || MEDIA_CONSUMPTIONS_DEFAULT_ROUTE_PROPS.period,
    source: props.source || MEDIA_CONSUMPTIONS_DEFAULT_ROUTE_PROPS.source,
    fromTs: Number(props.fromTs) || MEDIA_CONSUMPTIONS_DEFAULT_ROUTE_PROPS.fromTs,
    toTs: Number(props.toTs) || MEDIA_CONSUMPTIONS_DEFAULT_ROUTE_PROPS.toTs
  }
}

interface MediaConsumptionsRoute {
  settings: MediaConsumptionsRequestSettings;
  changeHandler: (nextSettings: MediaConsumptionsRequestSettings) => void;
}

export function useMediaConsumptionsRoute(): MediaConsumptionsRoute {
  const { history, location: { search }, match: { params: { deviceUUID } } } = useRouter<{ deviceUUID?: string }>();
  const routeProps = getMediaConsumptionsRouteProps(search);
  const dispatch = useDispatch();

  const settings = {
    ...routeProps,
  };

  const changeHandler = (nextSettings: MediaConsumptionsRequestSettings) => {
    history.push(`/media/${deviceUUID}/consumptions?${queryString.stringify(nextSettings)}`);
    setTimeout(() => dispatch(mediaDeviceConsumptionDataActions.getDevicePointConsumptionsData.request({ ...nextSettings, deviceUUID })), 300);
  }

  return {
    settings,
    changeHandler
  };
}

export function useMediaConsumptionsData() {
  const { match: { params: { deviceUUID } } } = useRouter<{ deviceUUID?: string }>();
  const { consumptionData, fetched, fetching, error, errorMessage } = useMediaDeviceConsumptionDataState();
  const { settings, changeHandler } = useMediaConsumptionsRoute();
  const dispatch = useDispatch();

  useEffect(() => {
    if (settings && settings.fromTs && settings.toTs && settings.period && settings.source && deviceUUID) {
      dispatch(mediaDeviceConsumptionDataActions.getDevicePointConsumptionsData.request({ ...settings, deviceUUID }));
    } else {
      dispatch(mediaDeviceConsumptionDataActions.resetDevicePointConsumptionsData.request());
    }
  }, [])

  const status: AsyncReducerState = { fetched, fetching, error, errorMessage };

  return {
    consumptionData,
    consumptionValues: consumptionData ? prepareData(consumptionData.values) : [],
    status,
    settings,
    changeHandler,
  }
}