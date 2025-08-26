import { Button, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import elpDebug, { Log } from 'modules/common/debug/Debug';
import LogsList from 'modules/common/debug/components/LogsList';
import { DebugContainerProps } from 'modules/common/debug/containers/DebugContainer';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { appActions } from 'modules/common/redux/app';
import { useApp } from 'modules/common/selectors/app';
import * as React from 'react';
import { useEffect, useState } from 'react';
// const styles = require("./DebugDialog.scss");

interface DebugDialogProps extends Pick<DebugContainerProps, 'open' | 'onClose'> {}

const useLogs = () => {
	const [logs, setLogs] = useState<Log[]>([]);

	useEffect(() => {
		elpDebug.addSubscriber(logs => {
			setLogs(logs);
		});
	}, []);

	return { logs };
};

const DebugDialog: React.FC<DebugDialogProps> = ({ open, onClose }) => {
	const { logs } = useLogs();
	const { debug } = useApp();
	const dispatch = useDispatch();
	const theme = useTheme();

	const toggleDebug = () => {
		dispatch(appActions.setDebug(!debug));
	};

	return (
		<Dialog open={open} onClose={onClose} title={'debug:dev'} fullWidth maxWidth='xl' fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle>
				Debug:logger
				<Button onClick={toggleDebug}>Debug:{debug ? 'on' : 'off'}</Button>
			</DialogTitle>
			<DialogContent style={{ height: 800 }}>
				<LogsList logs={logs} />
			</DialogContent>
		</Dialog>
	);
};

export default DebugDialog;
