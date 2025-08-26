import { Accordion, AccordionDetails, AccordionSummary, TextField, Typography } from '@mui/material';
import { filterObjectProps, uniqueArray } from 'helpers/data';
import { capitalize } from 'lodash';
import BuildingListConfigItemCheck from 'modules/buildings/components/BuildingsListConfig/BuildingListConfigItemCheck';
import { SuperTableDataColumns } from 'modules/common/components/Layout/SuperTable/SuperTable';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import styles from './BuildingsListConfig.module.scss';

interface BuildingsListConfigCheckboxGroupProps {
	columns: SuperTableDataColumns;
	onToggleParam: (column: string, nextState: boolean) => void;
	activeColumns: string[];
	title: string;
	filter?: boolean;
	grouping?: boolean;
	type: 'static' | 'dynamic';
	activeColumnsCount?: number;
}

const isSkippedInFilter = (label: string, filterQuery: string = ''): boolean => {
	const query = filterQuery.toLowerCase().trim();
	const words = query.split(' ');
	const rawLabel = label.toLowerCase();

	return filterQuery.length >= 3 && !words.every(word => rawLabel.includes(word));
};

const BuildingsListConfigCheckboxGroup: React.FC<BuildingsListConfigCheckboxGroupProps> = ({
	columns,
	onToggleParam,
	activeColumns,
	activeColumnsCount,
	title,
	filter,
	grouping,
	type,
}) => {
	const [query, setQ] = useState('');
	const [debouncedQuery] = useDebounce(query, 300);
	const { t } = useTranslation();

	const changeFilterHandler = React.useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>) => {
			const value = evt.currentTarget.value;
			filter && setQ(value);
		},
		[filter]
	);

	const groups: string[] = React.useMemo(
		() =>
			grouping
				? []
				: uniqueArray(
						Object.values(columns)
							.map(column => column.group || '')
							.filter(Boolean)
				  ),
		[grouping, columns]
	);

	const CUSTOM_LABEL_GROUPS = {
		main: 'Ogólne',
		ahu: 'Centrala',
		ahu2: 'Centrala 2',
	};

	return (
		<Accordion expanded={true} className={styles.group} onClick={undefined}>
			<AccordionSummary className={styles.summary} expandIcon={undefined}>
				<Typography>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails className={styles.details}>
				{filter && (
					<div className={styles.filterContainer}>
						<TextField className={styles.filterInput} type='search' onChange={changeFilterHandler} placeholder='Filtruj po nazwie' />
					</div>
				)}
				<div className={styles.params}>
					{['', ...groups].map((group, index) => {
						const groupColumns = filterObjectProps(columns, column => (group === '' ? column.group === undefined : column.group === group));

						const filteredEntries = Object.entries(groupColumns).filter(([, columnConfig]) => {
							const label = columnConfig.label;
							return !filter || !isSkippedInFilter(t(label), debouncedQuery);
						});

						if (filteredEntries.length === 0) return null;

						const firstItem = CUSTOM_LABEL_GROUPS[group as keyof typeof CUSTOM_LABEL_GROUPS]
							? CUSTOM_LABEL_GROUPS[group as keyof typeof CUSTOM_LABEL_GROUPS]
							: Object.values(groupColumns)[0]?.groupName;
						const groupLabel: string | null = firstItem ? firstItem.split('-').slice(0, 2).join('-').trim() : null;

						return (
							<div key={group} className={styles.subGroup}>
								{index !== 0 && <h4 style={{ margin: 5, marginLeft: 0 }}>{groupLabel}</h4>}
								{filteredEntries.map(([columnName, columnConfig]) => {
									const { label, disabledHide } = columnConfig;
									const finalLabel = label.replace((groupLabel || '') + ' - ', '');

									const isChecked = activeColumns.includes(columnName);
									const isMaxSelected = type === 'dynamic' && (activeColumnsCount || 0) >= 20;

									return (
										<BuildingListConfigItemCheck
											disabled={disabledHide || (isMaxSelected && !isChecked)}
											key={columnName}
											label={capitalize(t(finalLabel))}
											checked={isChecked}
											onChange={evt => onToggleParam(columnName, evt.currentTarget.checked)}
										/>
									);
								})}
							</div>
						);
					})}
				</div>
			</AccordionDetails>
		</Accordion>
	);
};

export default BuildingsListConfigCheckboxGroup;
