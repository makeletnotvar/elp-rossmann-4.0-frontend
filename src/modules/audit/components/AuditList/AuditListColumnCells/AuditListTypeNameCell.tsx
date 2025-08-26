import { SuperTableCustomCellProps } from 'modules/common/components/Layout/SuperTable/SuperTable';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AuditListTypeNameCell: React.FC<SuperTableCustomCellProps> = ({ row }) => {
	const { t } = useTranslation();
	const typeName = t(`audit.types.${row.type}`);

	return <>{typeName}</>;
};

export default AuditListTypeNameCell;
