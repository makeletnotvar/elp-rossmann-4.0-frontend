import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import styles from './CompaniesList.module.scss';

interface CompaniesListProps {
	companies: Company[];
	settings: Partial<SuperTableDisplaySettings>;
	onChangeSettings: (settings: Partial<SuperTableDisplaySettings>) => void;
	fetching: boolean;
	count: number;
	countAll: number;
}

const columns: SuperTableDataColumns<Company> = {
	name: {
		label: 'companies.params.name',
		custom: ({ value, row }) => <Link to={`/companies/${row.uuid}/info`}>{value}</Link>,
	},
};

const CompaniesList: React.FC<CompaniesListProps> = ({ companies, settings, onChangeSettings, fetching, countAll }) => {
	const { t } = useTranslation();
	const { query, rowsPerPage, sortingParam, sortingDir, offset } = settings;

	return (
		<div className={styles.container}>
			<Content>
				<SuperTable
					data={companies}
					columns={columns}
					onUpdateSettings={onChangeSettings}
					translator={t}
					sortable={true}
					rowActions={rowData => <CompaniesRowActions rowData={rowData} />}
					fetching={fetching}
					noResults={(query || '').length > 0 && (companies || []).length === 0}
					rowClassName={rowData => (!rowData.active ? styles.inactive : '')}
					count={countAll}
					{...{
						query,
						rowsPerPage,
						sortingParam,
						sortingDir,
						offset,
					}}
				/>
			</Content>
		</div>
	);
};

interface CompaniesRowActionsProps {
	rowData: any;
}

const CompaniesRowActions: React.FC<CompaniesRowActionsProps> = ({ rowData }) => {
	const { history } = useRouter();
	const { t } = useTranslation();

	const clickHandler = useCallback(() => {
		history.push(`/companies/${rowData?.uuid}/info`);
	}, [rowData]);

	return (
		<>
			<Tooltip title={t('general.details')} placement='bottom'>
				<span>
					<IconButton data-testid={`company-more-button-${rowData.uuid}`} size='small' onClick={clickHandler}>
						<MoreHorizOutlined fontSize='inherit' />
					</IconButton>
				</span>
			</Tooltip>
		</>
	);
};

export default CompaniesList;
