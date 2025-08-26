import { store } from 'modules/common/containers/AppContainer';
import * as React from 'react';
// const styles = require("./AppState.scss");

interface AppStateProps {}

const AppState: React.FC<AppStateProps> = () => {
	const state = store.getState();
	const content = JSON.stringify(state);

	return (
		<div>
			<textarea>{JSON.stringify(content, null, 2)}</textarea>
		</div>
	);
};

export default AppState;
