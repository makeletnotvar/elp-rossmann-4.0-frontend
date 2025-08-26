import { pages } from 'config/pages';
import TransformerProvider from 'modules/common/components/StyleTransformer/context/StyleTransformerContext';
import moment from 'moment';
import 'moment/dist/locale/pl';
import React, { lazy } from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncRoute } from './AsyncComponent';
import AppContainer, { store } from './modules/common/containers/AppContainer';
import './styles/common.scss';
moment.locale('pl');

import AuthApp from 'modules/auth/AuthApp';

const ExpiredPasswordApp = lazy(() => import('modules/expired-password/ExpiredPasswordApp'));
const BuildingAsCodeRedirect = lazy(() => import('modules/common/components/BuildingAsCodeRedirect/BuildingAsCodeRedirect'));

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<TransformerProvider>
				<AppContainer>
					{user => (
						<Switch>
							<Redirect from='/' exact to={`/buildings`} />
							<Route path='/login' component={AuthApp} />
							<Route path='/password-expired' component={ExpiredPasswordApp} />
							<Route path='/buildings/as-code/:code' component={BuildingAsCodeRedirect} />
							{user &&
								user?.fetched &&
								Object.values(pages).map(page => {
									const route = page?.routeWithParams ? `/${page?.routeWithParams}` : page?.route && `/${page?.route}`;
									const devOnlyOrCustomAuth = page?.devOnly ? page?.devOnly : false;
									const devOrAdminOnlyOrCustomAuth = page?.devOrAdminOnly ? page?.devOrAdminOnly : false;
									const isCustomAuthPermitted = !page.customAuth || (user && page.customAuth(user.user as UserAuth));

									return (
										route && (
											<AsyncRoute
												key={page.moduleType}
												userState={user}
												devOnly={devOnlyOrCustomAuth || !isCustomAuthPermitted}
												devOrAdminOnly={devOrAdminOnlyOrCustomAuth || !isCustomAuthPermitted}
												page={page}
												path={route}
												loader={page.component}
											/>
										)
									);
								})}
						</Switch>
					)}
				</AppContainer>
			</TransformerProvider>
		</Provider>
	);
};

export default App;
