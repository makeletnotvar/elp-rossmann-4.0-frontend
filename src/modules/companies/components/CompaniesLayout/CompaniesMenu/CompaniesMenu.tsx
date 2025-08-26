import { AddOutlined, EditOutlined, InfoOutlined } from '@mui/icons-material';
import VertIconsList from 'modules/common/components/Lists/VertIconsList/VertIconsList';
import VertIconsListItem from 'modules/common/components/Lists/VertIconsList/VertIconsListItem';
import { INSTALLATION_COMPANY_EDIT, INSTALLATION_COMPANY_INFO } from 'modules/companies/constants/company';
import useCompaniesMenu from 'modules/companies/hooks/useCompaniesMenu';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CompaniesMenu.module.scss';

interface CompaniesMenuProps {
	isNew: boolean;
}

const CompaniesMenu: React.FC<CompaniesMenuProps> = ({ isNew }) => {
	const { t } = useTranslation();
	const { clickTabHandler, activeTab } = useCompaniesMenu();

	return (
		<>
			{isNew ? (
				<VertIconsList className={styles.list} size={50}>
					<VertIconsListItem index={0} icon={AddOutlined} title={t('companies.tabs.create')} onClick={() => {}} active={true} />
				</VertIconsList>
			) : (
				<VertIconsList className={styles.list} size={50}>
					<VertIconsListItem
						index={1}
						icon={InfoOutlined}
						title={t('companies.tabs.info')}
						onClick={() => clickTabHandler(INSTALLATION_COMPANY_INFO)}
						active={activeTab === INSTALLATION_COMPANY_INFO}
					/>
					<VertIconsListItem
						index={2}
						icon={EditOutlined}
						title={t('companies.tabs.edit')}
						onClick={() => clickTabHandler(INSTALLATION_COMPANY_EDIT)}
						active={activeTab === INSTALLATION_COMPANY_EDIT}
						testId='edit-company-button'
					/>
				</VertIconsList>
			)}
		</>
	);
};

export default CompaniesMenu;
