// import { createStore, combineReducers, ReducersMapObject, applyMiddleware } from 'redux';
import { getSessionStorageUser } from 'modules/common/auth/storage';
import { authActions } from 'modules/common/redux/auth';
import { applyMiddleware } from 'redux';
import { createStore } from 'redux-dynamic-modules';
import { getThunkExtension } from 'redux-dynamic-modules-thunk';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { getRootModule } from './redux';

const createRootStore = () => {
	const middlewares = [thunk];
	if (import.meta.env.VITE_APP_NODE_ENV === `development`) {
		const logger = createLogger({
			collapsed: true,
			diff: true,
		});
		middlewares.push(logger as any);
	}
	const store = createStore({}, [applyMiddleware(...middlewares)], [getThunkExtension()], getRootModule());
	if (getSessionStorageUser()) {
		store.dispatch(authActions.verify.request() as any);
	} else {
		if (!window.location.href.includes('/login')) {
			store.dispatch(authActions.logout.request() as any);
		}
	}

	return store;
};

export default createRootStore;
