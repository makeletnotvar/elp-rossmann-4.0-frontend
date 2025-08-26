import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AuditListLoginRefsCell: React.FC<SuperTableCustomCellProps> = () => {
	const { t } = useTranslation();
	return <span>{t('audit.messages.login_to', { to: 'systemu' })}</span>;
};

export default AuditListLoginRefsCell;
