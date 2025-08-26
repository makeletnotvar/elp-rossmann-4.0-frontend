// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import AuditList from 'modules/audit/components/AuditList/AuditList';
import { getAuditModule } from 'modules/audit/redux';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { DynamicModuleLoader } from 'redux-dynamic-modules';
import useRouter from 'use-react-router';

interface AuditAppProps {}

const AuditApp: React.FC<AuditAppProps> = () => {
	const { location, history } = useRouter();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		if (!urlParams.has('fromTs')) {
			urlParams.set('fromTs', String(moment().subtract(7, 'days').add(4, 'hours').valueOf()));
			history.replace({
				pathname: location.pathname,
				search: urlParams.toString(),
			});
		}
	}, [location.search, location.pathname, history]);

	return (
		<DynamicModuleLoader modules={[getAuditModule()]}>
			<Switch>
				<Route path='/users-audits' exact render={() => <AuditList />} />
			</Switch>
		</DynamicModuleLoader>
	);
};

export default AuditApp;
