import { auditActions } from 'modules/audit/redux/audits';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { mergeQueryParams, numQuery } from 'modules/common/helpers/router/router';
import queryString from 'query-string';
import { useCallback, useEffect } from 'react';
import useRouter from 'use-react-router';

export interface AuditListRoutingPagitnationProps {
	s?: number;
	o?: number;
	fromTs?: number;
	toTs?: number;
	building?: string;
	user?: string;
	type?: string;
	point?: string;
	[param: string]: any;
}

function compareObjects(obj1: any, obj2: any) {
	for (const key in obj1) {
		if (!(key in obj2)) {
			return false;
		}
		if (obj1[key] !== obj2[key]) {
			return false;
		}
	}
	return true;
}

export const useAuditListPaginationRouter = () => {
	const {
		history,
		location: { search },
	} = useRouter();
	const locationProps: AuditListRoutingPagitnationProps = queryString.parse(search);
	const dispatch = useDispatch();

	const update = useCallback(
		(ob: AuditListRoutingPagitnationProps, firstLoad?: boolean) => {
			const resetOffsetFields: (keyof AuditListRoutingPagitnationProps)[] = ['fromTs', 's', 'toTs', 'building', 'user', 'type', 'point'];
			let offset = ob.o;
			const shouldResetOffset = resetOffsetFields.some(key => {
				if (ob[key] === undefined || locationProps[key] === undefined) {
					return false;
				}
				return ob[key] != locationProps[key];
			});
			if (shouldResetOffset) {
				offset = 0;
			}
			const nextSearch = mergeQueryParams<AuditListRoutingPagitnationProps>(locationProps, {
				...ob,
				o: offset,
			});
			const nextSearchString = queryString.stringify(nextSearch);
			const isSameQuery = compareObjects(nextSearch, locationProps);
			if (firstLoad || isSameQuery) {
				history.replace(`/users-audits?${nextSearchString}`);
			} else {
				history.push(`/users-audits?${nextSearchString}`);
			}
		},
		[search]
	);

	useEffect(() => {
		dispatch(auditActions.get.request(locationProps));
	}, [JSON.stringify(search)]);

	return {
		rowsPerPage: numQuery(locationProps.s, 20),
		offset: numQuery(locationProps.o, 0),
		values: locationProps,
		update,
	};
};
