import UINotifications from 'modules/common/components/UINotifications/UINotifications';
import { useUINotifications } from 'modules/common/redux/uiNotifications';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
// const styles = require("./UINotificationsContainer.scss");

interface UINotificationsContainerProps {}

const UINotificationsContainer: React.FC<UINotificationsContainerProps> = () => {
	const {
		data: { notifications },
	} = useUINotifications();

	return (
		<SnackbarProvider maxSnack={3} autoHideDuration={3000}>
			<UINotifications notifications={notifications} />
		</SnackbarProvider>
	);
};

export default UINotificationsContainer;
