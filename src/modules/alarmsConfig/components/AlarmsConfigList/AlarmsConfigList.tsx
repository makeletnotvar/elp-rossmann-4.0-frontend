import { IconButton, Tooltip } from '@mui/material';
import { EditOutlined, ExpandLessOutlined, ExpandMoreOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { sortBy } from 'lodash';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList as List } from 'react-window';
import styles from './AlarmsConfigList.module.scss';
import AlarmsConfigListItemPriorityCell from './AlarmsConfigListItem/AlarmsConfigListItemPriorityCell';

interface Column<T> {
	label: string;
	key: keyof T | 'actions';
	custom?: (row: T, action: any) => React.ReactNode;
	sortable?: boolean;
	align?: 'center' | 'right';
}

const columns: Column<AlarmConfig>[] = [
	{
		key: 'priority',
		label: 'Priorytet',
		sortable: true,
		custom: row => <AlarmsConfigListItemPriorityCell value={row.priority} />,
		align: 'center',
	},
	{ key: 'code', label: 'Kod', sortable: true },
	{ key: 'name', label: 'Nazwa', sortable: true },
	{
		key: 'unitXid',
		label: 'UnitXID',
		sortable: true,
		custom: row => <span>{row.unitXid || 'Brak'}</span>,
	},
	{
		key: 'isBlocking',
		label: 'Blokujący',
		custom: row => <span>{row.isBlocking ? 'Tak' : 'Nie'}</span>,
		sortable: true,
	},
	{
		key: 'actions',
		label: 'Akcje',
		custom: (row, onAlarmConfigDetails) => (
			<Tooltip title='Edytuj alarm'>
				<IconButton data-testid={`more-alarmConfig-${row.code}`} size='small' onClick={() => onAlarmConfigDetails(row.code)}>
					<EditOutlined fontSize='inherit' />
				</IconButton>
			</Tooltip>
		),
		align: 'right',
	},
];

const useSortedAlarmConfigs = (alarmsConfig: AlarmConfig[]) => {
	const [dir, setDir] = React.useState<'asc' | 'desc'>('asc');
	const [param, setParam] = React.useState<keyof AlarmConfig>('priority');

	const updateHandler = (nextSettings: Partial<SuperTableDisplaySettings>) => {
		setDir(nextSettings.sortingDir || dir);
		setParam((nextSettings.sortingParam as keyof AlarmConfig) || param);
	};

	const sortedAlarms = React.useMemo(() => {
		return dir === 'desc' ? sortBy(alarmsConfig, param).reverse() : sortBy(alarmsConfig, param);
	}, [alarmsConfig, dir, param]);

	return { dir, param, updateHandler, sortedAlarms };
};

interface AlarmsConfigListProps {
	alarmsConfig: AlarmConfig[];
	settings: Partial<SuperTableDisplaySettings>;
	onChangeSettings: (settings: Partial<SuperTableDisplaySettings>) => void;
	fetching: boolean;
	query?: string;
	count: number;
	onAlarmConfigDetails: (code: string) => void;
}

const AlarmsConfigList: React.FC<AlarmsConfigListProps> = ({ alarmsConfig, onAlarmConfigDetails }) => {
	const { t } = useTranslation();
	const { dir, param, updateHandler, sortedAlarms } = useSortedAlarmConfigs(alarmsConfig);
	const [listHeight, setListHeight] = React.useState(window.innerHeight - 142);

	React.useEffect(() => {
		const updateHeight = () => setListHeight(window.innerHeight - 142);
		window.addEventListener('resize', updateHeight);
		return () => window.removeEventListener('resize', updateHeight);
	}, []);

	const handleSort = (key: keyof AlarmConfig) => {
		updateHandler({ sortingDir: param === key && dir === 'asc' ? 'desc' : 'asc', sortingParam: key });
	};

	return (
		<div className={cn(styles.containerTable, { [styles.isQuery]: (sortedAlarms || []).length === 0 })}>
			<div className={`${styles.header} ${styles.headerRow}`}>
				{columns.map(column => (
					<div
						key={column.key as string}
						className={cn(styles.cell, {
							[styles.sortable]: column.sortable,
							[styles.center]: column.align === 'center',
							[styles.right]: column.align === 'right',
							[styles.codeCell]: column.key === 'code',
							[styles.nameCell]: column.key === 'name',
							[styles.typeCell]: column.key === 'priority',
							[styles.blockingCell]: column.key === 'isBlocking',
						})}
						onClick={() => column.sortable && handleSort(column.key as keyof AlarmConfig)}
					>
						{t(column.label)}
						{column.sortable && param === column.key && (dir === 'asc' ? <ExpandLessOutlined /> : <ExpandMoreOutlined />)}
					</div>
				))}
			</div>
			<List height={listHeight} itemCount={sortedAlarms.length} itemSize={35} width='100%'>
				{({ index, style }) => (
					<div className={styles.row} style={{ ...style, width: 'fit-content', minWidth: '100%' }}>
						{columns.map(column => (
							<div
								key={column.key as string}
								className={cn(styles.cell, {
									[styles.sortable]: column.sortable,
									[styles.center]: column.align === 'center',
									[styles.right]: column.align === 'right',
									[styles.codeCell]: column.key === 'code',
									[styles.nameCell]: column.key === 'name',
									[styles.typeCell]: column.key === 'priority',
									[styles.blockingCell]: column.key === 'isBlocking',
									[styles.textEllipsis]: column.key === 'name' || column.key === 'code',
								})}
							>
								{column.custom ? column.custom(sortedAlarms[index], onAlarmConfigDetails) : sortedAlarms[index][column.key as keyof AlarmConfig]}
							</div>
						))}
					</div>
				)}
			</List>
		</div>
	);
};

export default AlarmsConfigList;
