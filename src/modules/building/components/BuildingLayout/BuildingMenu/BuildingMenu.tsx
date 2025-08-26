import {
	AddOutlined,
	AssignmentOutlined,
	CategoryOutlined,
	EditOutlined,
	FormatListNumberedOutlined,
	InfoOutlined,
	TabletOutlined,
	ViewModuleOutlined,
} from '@mui/icons-material';
import { Divider } from '@mui/material';
import BuildingMenuEventsIconContainer from 'modules/building/components/BuildingLayout/BuildingMenu/BuildingMenuEventsIcons/BuildingMenuEventsIconContainer';
import { AuthDevOrAdmin } from 'modules/common/components/Auth/Auth';
import VertIconsList from 'modules/common/components/Lists/VertIconsList/VertIconsList';
import VertIconsListItem from 'modules/common/components/Lists/VertIconsList/VertIconsListItem';
import moment from 'moment';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './BuildingMenu.module.scss';
import BuildingMenuViewsIcon from './BuildingMenuViewsIcon';

interface BuildingMenuProps {}

interface BuildingRouteProps {
	uuid: string;
	tab?: string;
}

export const BUILDING_INFO = 'info';
export const BUILDING_DATA = 'data';
export const BUILDING_VIEWS = 'views';
export const BUILDING_VIEW = 'view';
export const BUILDING_EDIT = 'edit';
export const BUILDING_NEW = 'new';
export const BUILDING_POINTS = 'points';
export const BUILDING_UNITS = 'units';
export const BUILDING_VHMI = 'vhmi';
export const BUILDING_DASHBOARD = 'dashboard';
export const BUILDING_HISTORY = 'history';
export const BUILDING_EVENTSV2 = 'events-v2';

const useBuildingMenu = () => {
	const {
		history,
		match: {
			params: { uuid, tab: activeTab },
		},
	} = useRouter<BuildingRouteProps>();

	const clickTabHandler = useCallback(
		(tab: string) => {
			if (tab !== activeTab) {
				history.push(`/building/${uuid}/${tab}`);
			}
		},
		[activeTab]
	);

	const handleShowBuildingHistory = () => {
		if (uuid) {
			history.push(`/users-audits?fromTs=${moment(moment.now()).add(-1, 'years').valueOf()}&building=${uuid}&type=SETPOINT`);
		}
	};

	return {
		activeTab,
		clickTabHandler,
		handleShowBuildingHistory,
		buildingUUID: uuid,
	};
};

const BuildingMenu: React.FC<BuildingMenuProps> = () => {
	const { clickTabHandler, activeTab, handleShowBuildingHistory } = useBuildingMenu();
	const { t } = useTranslation();

	return (
		<>
			{activeTab === BUILDING_NEW ? (
				<VertIconsList className={styles.list} size={50}>
					<VertIconsListItem index={1} icon={AddOutlined} title={t('users.building_create')} onClick={() => {}} active={true} disabled />
				</VertIconsList>
			) : (
				<VertIconsList className={styles.list} size={50}>
					<>
						<VertIconsListItem
							index={0}
							icon={InfoOutlined}
							title={t('buildings.building_info')}
							onClick={() => clickTabHandler(BUILDING_INFO)}
							active={activeTab === BUILDING_INFO}
						/>
						<VertIconsListItem
							index={1}
							icon={ViewModuleOutlined}
							title={t('buildings.building_data')}
							onClick={() => clickTabHandler(BUILDING_DATA)}
							active={activeTab === BUILDING_DATA}
						/>
						<VertIconsListItem
							index={3}
							icon={CategoryOutlined}
							title={t('buildings.building_devices')}
							onClick={() => clickTabHandler(BUILDING_UNITS)}
							active={activeTab === BUILDING_UNITS || activeTab === BUILDING_UNITS}
							testId='building-units-button'
						/>
						<BuildingMenuViewsIcon activeTab={activeTab} onClick={() => clickTabHandler(BUILDING_VIEWS)} />
						<VertIconsListItem
							index={5}
							icon={FormatListNumberedOutlined}
							title={t('buildings.building_points')}
							onClick={() => clickTabHandler(BUILDING_POINTS)}
							active={activeTab === BUILDING_POINTS}
						/>
						<VertIconsListItem
							index={6}
							icon={TabletOutlined}
							title={t('buildings.building_vhmi')}
							onClick={() => clickTabHandler(BUILDING_VHMI)}
							active={activeTab === BUILDING_VHMI}
							permission={2}
							testId='building-vhmi-button'
						/>
						<VertIconsListItem
							index={7}
							icon={AssignmentOutlined}
							title={'Historia zmian'}
							onClick={() => handleShowBuildingHistory()}
							active={activeTab === BUILDING_HISTORY}
							devOrAdminOnly
						/>
						<BuildingMenuEventsIconContainer active={activeTab === BUILDING_EVENTSV2} onClick={() => clickTabHandler(BUILDING_EVENTSV2)} />
						<AuthDevOrAdmin>
							<Divider />
						</AuthDevOrAdmin>
						<VertIconsListItem
							index={8}
							icon={EditOutlined}
							title={t('buildings.building_edit')}
							onClick={() => clickTabHandler(BUILDING_EDIT)}
							active={activeTab === BUILDING_EDIT}
							devOrAdminOnly
							testId='building-edit-button'
						/>
					</>
				</VertIconsList>
			)}
		</>
	);
};

export default BuildingMenu;
