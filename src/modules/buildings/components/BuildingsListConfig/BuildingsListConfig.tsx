import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material';
import { UI } from 'config/ui';
import { countObjectProps } from 'helpers/data';
import BuildingsListConfigCheckboxGroup from 'modules/buildings/components/BuildingsListConfig/BuildingsListConfigCheckboxGroup';
import { useSplitedColumnsConfig, useTableColumnsConfig } from 'modules/buildings/components/BuildingsListConfig/BuildingsListConfigHooks';
import CancelButton from 'modules/common/components/Buttons/CancelButton';
import ClearButton from 'modules/common/components/Buttons/ClearButton';
import ConfirmButton from 'modules/common/components/Buttons/ConfirmButton';
import { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BuildingsListConfig.module.scss';

interface BuildingsListConfigProps {
	open: boolean;
	onClose: () => void;
	onSave: (activeColumns: string[]) => void;
	columns: SuperTableDataColumns;
}

const BuildingsListConfig: React.FC<BuildingsListConfigProps> = ({ open, onClose, onSave, columns }) => {
	const { t } = useTranslation();
	const { activeColumns, toggleColumn, restoreDefaults } = useTableColumnsConfig(columns);

	const theme = useTheme();

	const {
		// Ref columns are params related to points values
		refColumns,
		refActiveColumnsCount,
		// No ref columns are no point values params
		noRefColumns,
		noRefActiveColumnsCount,
	} = useSplitedColumnsConfig(columns, activeColumns);

	const noRefColumnsTitle = `${t('buildings.params_general')} (${noRefActiveColumnsCount} z ${countObjectProps(noRefColumns)})`;
	const refColumnsTitle = `${t('buildings.params_points_live')} (${refActiveColumnsCount} z ${countObjectProps(refColumns)})`;

	const saveHandler = () => {
		onSave(activeColumns);
		onClose();
	};

	return (
		<Dialog {...{ open, onClose }} className={styles.dialog} maxWidth='xl' fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}>
			<DialogTitle>
				Wybierz kolumny ({activeColumns.length} z {Object.keys(columns).length})
			</DialogTitle>
			<DialogContent className={styles.content}>
				<BuildingsListConfigCheckboxGroup
					type='static'
					columns={noRefColumns}
					onToggleParam={toggleColumn}
					activeColumns={activeColumns}
					title={noRefColumnsTitle}
				/>
				<BuildingsListConfigCheckboxGroup
					type='dynamic'
					columns={refColumns}
					onToggleParam={toggleColumn}
					activeColumns={activeColumns}
					title={refColumnsTitle}
					filter
					activeColumnsCount={refActiveColumnsCount}
				/>
			</DialogContent>
			<DialogActions style={{ padding: 10 }}>
				<ClearButton onClick={restoreDefaults}>{t('general.defaults')}</ClearButton>
				<CancelButton onClick={onClose}>{t('general.cancel')}</CancelButton>
				<ConfirmButton disabled={activeColumns.length < UI.TABLES.MIN_SELECTED_COLUMNS} onClick={saveHandler}>
					{t('general.ok')}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default BuildingsListConfig;
