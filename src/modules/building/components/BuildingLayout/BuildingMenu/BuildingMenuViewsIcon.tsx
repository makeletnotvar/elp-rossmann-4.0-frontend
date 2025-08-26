import { ListItemText, Menu, MenuItem } from '@mui/material';
import { PhotoOutlined } from '@mui/icons-material';
import { BUILDING_VIEW, BUILDING_VIEWS } from 'modules/building/components/BuildingLayout/BuildingMenu/BuildingMenu';
import VertIconsListItem from 'modules/common/components/Lists/VertIconsList/VertIconsListItem';
import { useViews } from 'modules/common/redux/views';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './BuildingMenu.module.scss';

interface BuildingMenuViewsIconProps {
	activeTab: string | undefined;
	onClick: () => void;
}

const BuildingMenuViewsIcon: React.FC<BuildingMenuViewsIconProps> = ({ activeTab, onClick }) => {
	const { views } = useViews();
	const { t } = useTranslation();

	const [anchorEl, setAnchorEl] = React.useState(null);
	const isMenuOpen = Boolean(anchorEl);

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const viewsClickHandler = (event: any) => {
		if (activeTab === BUILDING_VIEW && views && (views || []).length > 1) {
			setAnchorEl(event.currentTarget);
		} else {
			onClick();
		}
	};

	return (
		<>
			<VertIconsListItem
				index={4}
				icon={PhotoOutlined}
				title={t('buildings.building_views')}
				onClick={viewsClickHandler}
				active={activeTab === BUILDING_VIEWS || activeTab === BUILDING_VIEW}
			/>
			<Menu
				className={styles.menu}
				id='views'
				aria-labelledby='views'
				anchorEl={anchorEl}
				open={isMenuOpen}
				onClose={handleMenuClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				style={{ marginLeft: 51 }}
			>
				<BuildingMenuViewsIconMenuItems views={views} onClose={handleMenuClose} />
			</Menu>
		</>
	);
};

interface BuildingMenuViewsIconMenuItemsProps {
	views: ViewType[];
	onClose: () => void;
}

const BuildingMenuViewsIconMenuItems: React.FC<BuildingMenuViewsIconMenuItemsProps> = ({ views, onClose }) => {
	const {
		history,
		match: {
			params: { uuid },
		},
	} = useRouter<{ uuid: string }>();

	const openViewHandler = (viewUUID: string) => {
		onClose();
		history.push(`/building/${uuid}/view/${viewUUID}`);
	};

	return (
		<>
			{views &&
				(views || []).map(view => (
					<MenuItem className={styles.menuItem} key={view.uuid} onClick={() => openViewHandler(view.uuid)}>
						<PhotoOutlined />
						<ListItemText primary={view.name} />
					</MenuItem>
				))}
		</>
	);
};

export default BuildingMenuViewsIcon;
