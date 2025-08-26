import { DAY_TS } from 'helpers/date';
import _ from 'lodash';
import queryString from 'query-string';
import { useEffect } from 'react';
import useRouter from 'use-react-router';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { AsyncReducerState } from 'modules/common/helpers/redux/reducers';
import { mediaDeviceDataActions, useMediaDeviceDataState } from 'modules/media/redux/mediaData';

interface MediaParamsRouteProps extends Pick<MediaParamsRequestSettings, 'fromTs' | 'toTs' | 'deviceUUID' | 'p'> { }

export const MEDIA_PARAMS_DEFAULT_ROUTE_PROPS = {
  p: [] as string[],
  fromTs: Date.now() - DAY_TS,
  toTs: Date.now()
};

export function getParamsDefaultRouteProps() {
  return queryString.stringify(MEDIA_PARAMS_DEFAULT_ROUTE_PROPS);
}

function getMediaParamsRouteProps(query: string): Pick<MediaParamsRequestSettings, 'fromTs' | 'toTs' | 'deviceUUID' | 'p'> {
  const props: MediaParamsRouteProps = queryString.parse(query);

  return {
    p: props.p || MEDIA_PARAMS_DEFAULT_ROUTE_PROPS.p,
    fromTs: Number(props.fromTs) || MEDIA_PARAMS_DEFAULT_ROUTE_PROPS.fromTs,
    toTs: Number(props.toTs) || MEDIA_PARAMS_DEFAULT_ROUTE_PROPS.toTs
  }
}

interface MediaParamsRoute {
  settings: MediaParamsRequestSettings;
  changeHandler: (nextSettings: MediaParamsRequestSettings) => void;
}

export function useMediaParamsRoute(): MediaParamsRoute {
  const { history, location: { search }, match: { params: { deviceUUID } } } = useRouter<{ deviceUUID?: string }>();
  const routeProps = getMediaParamsRouteProps(search);
  const dispatch = useDispatch();

  const settings = {
    ...routeProps,
  };

  const changeHandler = (nextSettings: MediaParamsRequestSettings) => {
    if (settings && settings.p && deviceUUID) {
      history.push(`/media/${deviceUUID}/params?${queryString.stringify(nextSettings)}`);
      setTimeout(() => dispatch(mediaDeviceDataActions.getDevicePointData.request({ ...nextSettings, deviceUUID })), 300);
    }
  }

  return {
    settings,
    changeHandler
  };
}

export function useMediaParamsData() {
  const { match: { params: { deviceUUID } } } = useRouter<{ deviceUUID?: string }>();
  const { data, fetched, fetching, error, errorMessage } = useMediaDeviceDataState();
  const { settings, changeHandler } = useMediaParamsRoute();
  const dispatch = useDispatch();

  useEffect(() => {
    if (settings && settings.p && settings.p.length !== 0 && settings.fromTs && settings.toTs && deviceUUID) {
      dispatch(mediaDeviceDataActions.getDevicePointData.request({ ...settings, deviceUUID }));
    } else {
      dispatch(mediaDeviceDataActions.resetDevicePointData.request());
    }
  }, [])

  const status: AsyncReducerState = { fetched, fetching, error, errorMessage };
  const pointsValues = mediaPointsDataToPointsValues(data);

  return {
    data,
    pointsValues,
    status,
    settings,
    changeHandler,
  }
}

function mediaPointsDataToPointsValues(mediaPointsData: MediaPointsData): PointsValues {
  const pointsValues = Object.entries(mediaPointsData).reduce((acc, [key, {uuid, values}]) => {
    return {
      ...acc,
      [uuid]: values
    };
  }, {})
  return pointsValues;
}