import {
	AddOutlined,
	AutorenewOutlined,
	CheckOutlined,
	ClearOutlined,
	CloudDownloadOutlined,
	FilterListOutlined,
	SettingsOutlined,
	ShopTwoOutlined,
} from '@mui/icons-material';
import { Badge, Fab, IconButton, Tooltip } from '@mui/material';
import { AuthDev } from 'modules/common/components/Auth/Auth';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import { useDispatch } from 'modules/common/helpers/redux/useActions';
import { pollActions, usePoll } from 'modules/common/redux/poll';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BuildingsSearch from './BuildingsSearch';
import styles from './BuildingsTitleBar.module.scss';

interface BuildingsTitleBarProps {
	onConfigOpen: () => void;
	onFiltersOpen: () => void;
	onSearch: (q: string) => void;
	onResetSearch: () => void;
	onAdd: () => void;
	query: string;
	activeFiltersCount: number;
	activeColumnsCount: number;
}

const exportHandler = () => () => {
	let downloadLink;
	const $table = document.querySelector('table');

	if ($table) {
		const tableHTML = ('<meta charset = "utf-8">' + $table.outerHTML).replace(/ /g, '%20');
		const filename = `Eksport_drogerii-${new Date().toLocaleDateString().replace(/\./g, '-')}.xls`;

		// Create download link element
		downloadLink = document.createElement('a');
		document.body.appendChild(downloadLink);

		if ((navigator as any).msSaveOrOpenBlob) {
			const blob = new Blob(['\ufeff', tableHTML], {
				type: 'data:application/vnd.ms-excel;',
			});
			(navigator as any).msSaveOrOpenBlob(blob, filename);
		} else {
			// Create a link to the file
			downloadLink.href = 'data:application/vnd.ms-excel,' + tableHTML;

			// Setting the file name
			downloadLink.download = filename;

			//triggering the function
			downloadLink.click();
		}
	}
};

const BuildingsTitleBar: React.FC<BuildingsTitleBarProps> = ({
	onFiltersOpen,
	activeFiltersCount,
	onConfigOpen,
	onSearch,
	onResetSearch,
	onAdd,
	query,
	activeColumnsCount = 0,
}) => {
	const { stopped: pollStopped } = usePoll();
	const [q, setQ] = useState(query || '');
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const searchHandler = () => {
		q.length >= 1 && onSearch(q);
	};

	const pollEnabledHandler = () => {
		dispatch(pollActions.setStopped(!pollStopped));
	};

	return (
		<TitleBar label={t('buildings.buildings_list')} icon={ShopTwoOutlined} labelClassName={styles.titleLabel}>
			<div className={styles.icons}>
				<Tooltip title='Automatycznie odświeżaj wartości'>
					<IconButton size='small' onClick={pollEnabledHandler} style={{ opacity: !pollStopped ? 1 : 0.5, marginRight: 10, color: '#303030' }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: '#205de0',
								position: 'absolute',
								top: -4,
								right: -4,
								width: '15px',
								height: '15px',
								padding: '2px',
								borderRadius: '50%',
							}}
						>
							{!pollStopped ? <CheckOutlined fontSize='inherit' style={{ color: 'white' }} /> : <ClearOutlined fontSize='inherit' style={{ color: 'white' }} />}
						</div>
						<AutorenewOutlined />
					</IconButton>
				</Tooltip>
				<IconButton style={{ color: '#303030' }} size='small' onClick={exportHandler()}>
					<Tooltip title='Eksportuj do Excel...'>
						<CloudDownloadOutlined />
					</Tooltip>
				</IconButton>
				<IconButton style={{ color: '#303030' }} size='small' onClick={onFiltersOpen}>
					<Tooltip title='Filtruj dane'>
						<Badge overlap='rectangular' classes={{ badge: styles.badge }} badgeContent={activeFiltersCount} color='primary'>
							<FilterListOutlined />
						</Badge>
					</Tooltip>
				</IconButton>
				<Tooltip title='Konfiguruj kolumny tabeli'>
					<IconButton style={{ color: '#303030' }} size='small' onClick={onConfigOpen}>
						<Badge overlap='rectangular' classes={{ badge: styles.badge }} badgeContent={activeColumnsCount || null} color='primary'>
							<SettingsOutlined />
						</Badge>
					</IconButton>
				</Tooltip>
			</div>
			<BuildingsSearch
				onChange={setQ}
				query={q}
				queryParam={query}
				onSearch={searchHandler}
				onReset={() => {
					setQ('');
					onResetSearch();
				}}
			/>
			<AuthDev>
				<div className={styles.addContainer}>
					<Tooltip placement='bottom' title={t('buildings.add_building')}>
						<Fab data-testid='buildings-add-button' className={styles.addIconFab} aria-label='Add' onClick={onAdd} size='small' color='primary'>
							<AddOutlined className={styles.addIcon} />
						</Fab>
					</Tooltip>
				</div>
			</AuthDev>
		</TitleBar>
	);
};

export default BuildingsTitleBar;
