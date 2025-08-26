import { Divider, List } from '@mui/material';
import { Modules } from 'constants/modules';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import DebugContainer from 'modules/common/debug/containers/DebugContainer';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { appActions } from 'modules/common/redux/app';
import { useApp } from 'modules/common/selectors/app';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPageListItem, useUserPagesList } from '../../../hooks/userPagesList';
import styles from './ASide.module.scss';
import ASideMenuItem from './ASideMenuItem';

interface ASideMenuProps {
	isOpen: boolean;
	isDebuggingEnabled: boolean;
	onClose: () => void;
}

const ASideMenu: React.FC<ASideMenuProps> = ({ isOpen, isDebuggingEnabled, onClose }) => {
	const userPageList: UserPageListItem[] = useUserPagesList();
	const dispatch = useDispatch();
	const { currentModule } = useApp();
	const [debugOpen, setDebugOpen] = useState<boolean>(false);
	const { debug } = useApp();

	const runDebug = React.useCallback(() => {
		dispatch(appActions.setDebug(true));
		setDebugOpen(true);
	}, []);

	const { t } = useTranslation();
	return (
		<>
			<List style={{ padding: 0 }} className={styles.list}>
				{currentModule !== Modules.VIEW_EDITOR &&
					userPageList
						.filter(page => !page.devOnly)
						.map(({ title, icon, isActive, disabled, premiumMarked, route, absoluteRoute, badge, devOnly, className }, index) => {
							return (
								<ASideMenuItem
									key={index}
									Icon={icon}
									{...{ title: t(title), isActive, disabled, premiumMarked, absoluteRoute, route, isOpen, index, devOnly, badge, className, onClose }}
								/>
							);
						})}
				{currentModule !== Modules.VIEW_EDITOR && userPageList.filter(page => page.devOnly).length > 0 && <Divider />}
				{currentModule !== Modules.VIEW_EDITOR &&
					userPageList
						.filter(page => page.devOnly)
						.map(({ title, icon, isActive, disabled, premiumMarked, route, absoluteRoute, badge, devOnly, className }, index) => {
							return (
								<ASideMenuItem
									key={index}
									Icon={icon}
									{...{ title: t(title), isActive, disabled, premiumMarked, absoluteRoute, route, isOpen, index, devOnly, badge, className, onClose }}
								/>
							);
						})}
				<div id='aside-menu'></div>
			</List>
			<>
				{isDebuggingEnabled && (
					<AuthDev>
						<DebugContainer open={debugOpen} onClose={() => setDebugOpen(false)} />
					</AuthDev>
				)}
			</>
		</>
	);
};

export default ASideMenu;
