import { useDispatch } from "modules/common/helpers/redux/useActions";
import { mergeQueryParams, numQuery } from "modules/common/helpers/router/router";
import { mediaDevicesActions } from 'modules/media/redux/mediaDevices';
import queryString from 'query-string';
import { useCallback, useEffect } from "react";
import useRouter from "use-react-router";

export interface MediaDevicesListRoutingPagitnationProps {
  q?: string;
  d?: 'asc' | 'desc';
  p?: string;
  s?: number;
  o?: number;
  c?: string[];

  [param: string]: any;
}

export const useMediaDevicesListPaginationRouter = () => {
  const { history, location: { search } } = useRouter();
  const locationProps: MediaDevicesListRoutingPagitnationProps = queryString.parse(search);
  const dispatch = useDispatch();

  const update = useCallback((ob: MediaDevicesListRoutingPagitnationProps) => {
    const nextSearch = mergeQueryParams<MediaDevicesListRoutingPagitnationProps>(locationProps, ob);
    const nextSearchString = queryString.stringify(nextSearch);
    const { c, ...nextSearchWithJustApiParams } = nextSearch;
    dispatch(mediaDevicesActions.getMediaDevices.request(nextSearchWithJustApiParams as any));
    history.push(`/media/list/?${nextSearchString}`);
  }, [search]);

  useEffect(() => update({}), []);

  return {
    q: locationProps.q || '',
    dir: (locationProps.d || 'desc') as 'asc' | 'desc',
    param: <string>(locationProps.p || ''),
    rowsPerPage: numQuery(locationProps.s, 20),
    offset: numQuery(locationProps.o, 0),
    update,
    activeFilters: Object.entries(locationProps).filter(p => p[0].startsWith('F_')),
  }
}