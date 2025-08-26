import { AddOutlined, DeleteOutlined, EditOutlined, SettingsOutlined } from '@mui/icons-material';
import { Fab, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import cn from 'classnames';
import SuperTable, { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import ArchiveIcon from 'modules/common/components/Points/ArchiveIcon/ArchiveIcon';
import PointTypeIcon from 'modules/common/components/Points/PointIcon/PointTypeIcon';
import SettableIcon from 'modules/common/components/Points/SettableIcon/SettableIcon';
import { DevicePointsProps } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePoints';
import { customRenderTooltip } from 'modules/device/components/DeviceTabs/DevicePoints/DevicePointsImport/DevicePointsTransfer/DevicePointsTransferHooks';
import { isSuggestedArchivePoint } from 'modules/device/helpers/suggestedArchive';
import * as React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useRouter from 'use-react-router';
import styles from './DevicePoints.module.scss';

interface DevicePointsListProps extends DevicePointsProps {
	onEdit: (uuid: string) => void;
	onDelete: (uuid: string) => void;
	onImport: () => void;
	sortingDir: 'desc' | 'asc' | undefined;
	sortingParam: string;
	onUpdateSettings: (ob: any) => void;
}

const rowClassNameProvider = (selectedUUID: string) => {
	return (point: Point) => {
		return cn({
			[styles.isSelected]: selectedUUID === point.uuid,
			[styles.inactive]: !point.active,
		});
	};
};

const getDynamicColumns = (isMinimized: boolean): SuperTableDataColumns => ({
	type: {
		label: 'Typ',
		custom: ({ row }) => <PointTypeIcon type={row.type} settable={row.settable} />,
		tdClassName: styles.min,
		thClassName: styles.min,
	},
	settable: {
		label: 'Set',
		custom: ({ row }) => <SettableIcon settable={row.settable} settableRegister={row.settableRegister} />,
		tdClassName: styles.min,
		thClassName: styles.min,
	},
	archive: {
		label: 'Archive',
		custom: ({ row }) => <ArchiveIcon archive={row.archive || false} isSuggested={isSuggestedArchivePoint(row.xid)} />,
		tdClassName: styles.min,
		thClassName: styles.min,
	},
	name: {
		label: 'Nazwa',
		custom: ({ row }) => <>{row.name || 'Bez nazwy'}</>,
	},
	xid: {
		label: 'XID',
	},
	registerNumber: {
		label: 'Reg',
		tdClassName: styles.min,
		thClassName: styles.min,
	},
	customRender: {
		label: 'Render',
		custom: ({ row }) => (
			<>
				<Tooltip title={<Typography style={{ whiteSpace: 'pre-line', fontSize: 12 }}>{customRenderTooltip(row.customRender)}</Typography>}>
					<SettingsOutlined fontSize='small' />
				</Tooltip>
			</>
		),
	},
	stats: {
		label: 'Stats',
		custom: ({ row }) => <PointArchiveStats point={row as Point} />,
	},
});

const DevicePointsList: React.FC<DevicePointsListProps> = ({ points, onEdit, onDelete, onImport, sortingDir, sortingParam, onUpdateSettings }) => {
	const { t } = useTranslation();
	const {
		match: {
			params: { pointUUID },
		},
	} = useRouter<{ pointUUID: string }>();

	const editHandler = useCallback(
		(uuid: string | undefined) => () => {
			uuid && onEdit(uuid);
		},
		[]
	);

	return (
		<Paper className={styles.listContainer} elevation={1}>
			<div className={styles.header}>
				<label className={styles.label}>
					{t('devices.current_points_list')} ({points.length.toString()})
				</label>
				<Tooltip placement='bottom' title={t('devices.messages.add_new_device')}>
					<Fab color='primary' size='small' className={styles.addButton} onClick={onImport}>
						<AddOutlined />
					</Fab>
				</Tooltip>
			</div>
			<SuperTable
				data={points}
				wrapperClassName={styles.wrapper}
				columns={getDynamicColumns(pointUUID !== undefined)}
				rowActions={row => <PointsListRowActions onEdit={() => onEdit(row.uuid)} onDelete={() => onDelete(row.uuid)} />}
				sortable={true}
				rowClassName={rowClassNameProvider(pointUUID)}
				hidePagination={true}
				sortingDir={sortingDir}
				sortingParam={sortingParam}
				onUpdateSettings={onUpdateSettings}
			/>
		</Paper>
	);
};

const PointsListRowActions: React.FC<{ onEdit: any; onDelete: any }> = ({ onEdit, onDelete }) => {
	return (
		<>
			<IconButton title='Use with CTRL' className={styles.delete} size='small' color='default' onClick={evt => evt.ctrlKey && onDelete()}>
				<DeleteOutlined fontSize='inherit' />
			</IconButton>
			<IconButton size='small' color='default' onClick={onEdit}>
				<EditOutlined fontSize='inherit' />
			</IconButton>
		</>
	);
};

const PointArchiveStats: React.FC<{ point: Point }> = ({ point }) => {
	return (
		<>
			{point.archive && point.archiveConfig
				? `${Math.round(point.archiveConfig.time / 60)}m ${point.archiveConfig.change ? `| %${point.archiveConfig.change}` : ``}`
				: null}
		</>
	);
};

export default DevicePointsList;
