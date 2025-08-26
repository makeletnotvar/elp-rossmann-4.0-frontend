import AlarmsConfigDetailsContainer from 'modules/alarmsConfig/components/AlarmsConfigDetails/AlarmsConfigDetailsContainer';
import AlarmsConfigTitleBar from 'modules/alarmsConfig/components/AlarmsConfigLayout/AlarmsConfigTitleBar/AlarmsConfigTitleBar';
import AlarmsConfigList from 'modules/alarmsConfig/components/AlarmsConfigList/AlarmsConfigList';
import { alarmsConfigActions, useAlarmsConfigState } from 'modules/alarmsConfig/redux/alarmsConfig';
import { SuperTableDisplaySettings } from 'modules/common/components/Layout/SuperTable/SuperTable';
import { useDispatchOnce } from 'modules/common/helpers/redux/useActions';
import queryString from 'query-string';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useRouter from 'use-react-router';
import styles from './AlarmsConfigList.module.scss';

const AlarmsConfigListContainer: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<AlarmConfig[]>([]);
	const { alarmsConfig, fetching, count } = useAlarmsConfigState();
	const {
		history,
		location: { search },
	} = useRouter();
	const { d, p, code, name, priority, isBlocking } = queryString.parse(search);

	useDispatchOnce(alarmsConfigActions.getMany.request());

	const onUpdateSettings = useCallback(
		(ob: any) => {
			const { sortingDir, sortingParam } = ob;
			history.push(`${history.location.pathname}?d=${sortingDir}&p=${sortingParam}`);
		},
		[history]
	);

	const { sortedAlarmsConfigs, sortingDir, sortingParam } = useMemo(() => {
		const getValue = (obj: any, path: string) => {
			const value = path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
			// eslint-disable-next-line no-prototype-builtins
			return value && typeof value === 'object' && value.hasOwnProperty('name') ? value.name : value;
		};

		const sortedAlarmsConfigs = [...alarmsConfig].sort((a, b) => {
			const valueA = getValue(a, (p as string) || 'code');
			const valueB = getValue(b, (p as string) || 'code');
			if (valueA < valueB) return d === 'desc' ? 1 : -1;
			if (valueA > valueB) return d === 'desc' ? -1 : 1;
			return 0;
		});

		return { sortedAlarmsConfigs, sortingDir: d || 'asc', sortingParam: p || 'code' };
	}, [alarmsConfig, d, p]);

	const searchHandler = useCallback(
		(query: string) => {
			const queryLower = query.toLowerCase();
			const filteredResults = sortedAlarmsConfigs.filter(alarmConfig => {
				const matchesQuery = `${alarmConfig.code}${alarmConfig.name}${alarmConfig.unitXid}`.toLowerCase().includes(queryLower);
				return matchesQuery;
			});
			setSearchQuery(query);
			setSearchResults(filteredResults);
		},
		[sortedAlarmsConfigs]
	);

	const resetSearchHandler = useCallback(() => {
		searchHandler('');
		setSearchResults([]);
	}, [searchHandler]);

	useEffect(() => {
		if (code && name && priority && isBlocking) {
			const alarmConfig = alarmsConfig.find(alarmConfig => alarmConfig?.code?.toLowerCase() === (code as string)?.toLowerCase());

			if (alarmConfig) {
				history.replace(`/alarmsConfig/${code}?d=${sortingDir}&p=${sortingParam}`);
			} else {
				history.replace(`/alarmsConfig/add?&code=${code}&name=${name}&priority=${priority}&isBlocking=${isBlocking}&d=${sortingDir}&p=${sortingParam}`);
			}
		}
	}, [code, name, priority, isBlocking, alarmsConfig, sortingDir, sortingParam]);

	const onOpenDialog = useCallback(
		(code?: string) => {
			if (code) {
				history.push(`/alarmsConfig/${code}?d=${sortingDir}&p=${sortingParam}`);
			} else {
				history.push(`/alarmsConfig/add?d=${sortingDir}&p=${sortingParam}`);
			}
		},
		[sortingDir, sortingParam]
	);

	const onCloseDialog = useCallback(() => {
		history.replace(`/alarmsConfig?d=${sortingDir}&p=${sortingParam}`);
	}, [sortingDir, sortingParam]);

	return (
		<div className={styles.containerMain}>
			<AlarmsConfigTitleBar onSearch={searchHandler} onReset={resetSearchHandler} query={searchQuery} onOpen={onOpenDialog} />
			<AlarmsConfigList
				alarmsConfig={searchResults.length > 0 ? searchResults : searchQuery.length > 0 ? [] : sortedAlarmsConfigs}
				settings={{ sortingDir, sortingParam } as Partial<SuperTableDisplaySettings>}
				onChangeSettings={onUpdateSettings}
				fetching={fetching}
				count={count}
				query={searchQuery}
				onAlarmConfigDetails={onOpenDialog}
			/>
			<AlarmsConfigDetailsContainer onClose={onCloseDialog} />
		</div>
	);
};

export default AlarmsConfigListContainer;
