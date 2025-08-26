import { store } from 'modules/common/containers/AppContainer';
import * as React from 'react';
import { Provider } from 'react-redux';

const TestContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};

export default TestContainer;
