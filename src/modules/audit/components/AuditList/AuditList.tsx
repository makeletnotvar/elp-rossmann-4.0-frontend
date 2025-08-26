import { AssignmentOutlined } from '@mui/icons-material';
import cn from 'classnames';
import { dateString } from 'helpers/date';
import AuditListRefsCell from 'modules/audit/components/AuditList/AuditListColumnCells/AuditListRefsCell';
import AuditListTypeCell from 'modules/audit/components/AuditList/AuditListColumnCells/AuditListTypeCell';
import { AuditListRoutingPagitnationProps, useAuditListPaginationRouter } from 'modules/audit/components/AuditList/AuditListHook';
import AuditListSettings from 'modules/audit/components/AuditList/AuditListSettings/AuditListSettings';
import { useAuditState } from 'modules/audit/redux/audits';
import Content from 'modules/common/components/Layout/Content/Content';
import SuperTable, { SuperTableDataColumns, SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import TitleBar from 'modules/common/components/Layout/TitleBar/TitleBar';
import { convertPaginationRouteProps } from 'modules/common/helpers/router/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AuditList.module.scss';

const getDynamicColumns = (updateSettingsDataHandler: (ob: Partial<AuditListRoutingPagitnationProps>) => void): SuperTableDataColumns => ({
	type: {
		label: 'audit.type',
		custom: AuditListTypeCell,
		tdClassName: styles.type,
	},
	user: {
		label: 'audit.user',
		custom: ({ value }) => (
			<React.Fragment>
				<a
					className={styles.link}
					onClick={() =>
						updateSettingsDataHandler({
							user: value.uuid,
							building: null as any,
							point: null as any,
							type: null as any,
							toTs: null as any,
						})
					}
				>
					{value.username}
				</a>
			</React.Fragment>
		),
		tdClassName: styles.username,
	},
	ts: {
		label: 'audit.ts',
		custom: ({ value }) => (
			<React.Fragment>
				<span>{dateString(value)}</span>
			</React.Fragment>
		),
	},
	details: {
		label: 'audit.refs',
		custom: ({ value, row }) => <AuditListRefsCell value={value} row={row} updateSettingsDataHandler={updateSettingsDataHandler} />,
	},
});

const AuditList: React.FC = () => {
	const [openFilters, setOpenFilters] = useState<boolean>(false);
	const { update, offset, rowsPerPage, values } = useAuditListPaginationRouter();
	const { events, countAll, fetching } = useAuditState();

	const { t } = useTranslation();

	const updateSettingsHandler = (ob: Partial<SuperTableDisplaySettings>): void => {
		update(convertPaginationRouteProps(ob));
	};

	const updateSettingsDataHandler = (ob: Partial<AuditListRoutingPagitnationProps>): void => {
		update(ob);
	};

	return (
		<div className={cn(styles.container, { [styles.openFilters]: openFilters })}>
			<TitleBar label={t('users.user_audit')} icon={AssignmentOutlined} className={styles.titleBar}></TitleBar>
			<AuditListSettings updateSettingsDataHandler={updateSettingsDataHandler} values={values} openFilters={openFilters} setOpenFilters={setOpenFilters} />
			<Content className={cn(styles.content, { [styles.openFilters]: openFilters })}>
				<SuperTable
					className={styles.table}
					wrapperClassName={styles.wrapper}
					paginationClassName={styles.pagination}
					columns={getDynamicColumns(updateSettingsDataHandler)}
					data={(events || []).sort((a, b) => b.ts - a.ts)}
					fetching={fetching}
					checkable={false}
					sortable={false}
					rowsPerPage={rowsPerPage}
					offset={offset}
					count={countAll}
					onUpdateSettings={updateSettingsHandler}
					translator={t}
				/>
			</Content>
		</div>
	);
};

export default AuditList;
