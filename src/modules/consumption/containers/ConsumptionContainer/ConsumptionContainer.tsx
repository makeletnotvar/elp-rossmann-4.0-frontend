import ConsumptionSettings from 'modules/consumption/components/ConsumptionSettings/ConsumptionSettings';
import * as React from 'react';
import { useState } from 'react';
import { isFetched, isFetching } from 'vredux';
import ConsumptionLayout from '../../components/ConsumptionLayout/ConsumptionLayout';
import styles from './ConsumptionContainer.module.scss';
import { useConsumptionData } from './ConsumptionContainerHooks';

interface ConsumptionContainerProps {}

const ConsumptionContainer: React.FC<ConsumptionContainerProps> = () => {
	const { data, status, settings, changeHandler, building } = useConsumptionData();
	const [isOpenMenu, setIsOpenMenu] = useState(true);
	const isBuildingSpecified = Boolean(settings.building);
	const isDataFetching = isFetching(status);
	const isDataFetched = Boolean(data.data) && isFetched(status);

	const onOpenMenu = () => {
		setIsOpenMenu(!isOpenMenu);
	};

	return (
		<div className={styles.container}>
			<ConsumptionSettings settings={settings} extended={!isDataFetched} onChange={changeHandler} isOpenMenu={!isOpenMenu} onOpenMenu={onOpenMenu} />
			{isBuildingSpecified && building && isDataFetched && (
				<ConsumptionLayout fetching={isDataFetching} data={data} settings={settings} building={building} isOpenMenu={isOpenMenu} />
			)}
		</div>
	);
};

export default ConsumptionContainer;
