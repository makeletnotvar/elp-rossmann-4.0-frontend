import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomContextMenu, { CustomContextMenuItemProps } from '../../CustomContextMenu/CustomContextMenu';

interface SuperTableContextMenuProps {
	rowData: any;
	tab?: 'active' | 'history';
	menuItems: CustomContextMenuItemProps[];
}

const SuperTableContextMenu: React.FC<SuperTableContextMenuProps> = ({ menuItems }) => {
	const { t } = useTranslation();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Zoom in={true} timeout={100}>
				<Tooltip title={t('general.options')}>
					<IconButton size='small' onClick={handleContextMenu}>
						<MoreHorizOutlined fontSize='inherit' />
					</IconButton>
				</Tooltip>
			</Zoom>
			<CustomContextMenu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose} menuItems={menuItems} />
		</>
	);
};

export default SuperTableContextMenu;
